import Link from 'next/link';

/* Real output of:
   go run ./cmd/weibo-workflow --file examples/workflows/order-totals.yaml --dry-run */
const terminalOutput = [
  ['workflow', 'order-totals'],
  ['delivery', 'at-most-once'],
  ['source', 'generator'],
  ['operators', 'completed(filter), by-customer(keyBy), totals(reduce)'],
  ['sink', 'stdout'],
] as const;

const specs = [
  ['exactly-once', 'Kafka → Kafka, end to end', 'Source offsets, operator state, and sink output commit as one transaction.'],
  ['1 process', 'no cluster, no JVM', 'An embeddable Go library. Runs on a laptop; import it, build, execute.'],
  ['~75 ms', 'checkpoint at 5M keys', 'Pebble hard-link checkpoints scale with changed data — not total state.'],
  ['58 ms', 'state restore after crash', 'Rewind to the last checkpoint and replay. Measured, not aspirational.'],
] as const;

const anatomy = [
  [
    'Plan',
    'stage planner + bounded edges',
    'Operators fuse into stages that run as plain function calls. Bounded channels between stages are the only buffers — a full edge blocks upstream, so a slow sink throttles Kafka by construction.',
  ],
  [
    'Keyed state',
    'hash router + worker clones',
    'KeyBy routes each key to one worker, and every worker owns an isolated state backend — in-memory or a per-worker Pebble LSM on disk.',
  ],
  [
    'Barriers',
    'broadcast + strict alignment',
    'Checkpoint barriers flow in-band. Parallel stages broadcast them to every worker and re-align at the exit; operators snapshot synchronously as the barrier passes.',
  ],
  [
    'Exactly-once',
    'two-phase commit + txn marker',
    'A transactional Kafka sink stages each interval; the coordinator commits sink output, offsets, and state atomically. A marker record resolves crashes between commit and completion.',
  ],
  [
    'Observability',
    'Prometheus + dashboard',
    'Per-stage and per-edge metrics. An edge pinned at capacity names your bottleneck; send-block seconds make backpressure measurable.',
  ],
] as const;

const guarantees = [
  ['at-most-once', 'No checkpointing', 'Restart begins from the configured start offset.'],
  ['at-least-once', 'Checkpointing + any sink', 'State is exact; replay may re-emit records the sink already wrote.'],
  ['exactly-once', 'Exactly-once source + txnKafka sink + checkpointing', 'Committed output visible once, under read_committed.'],
] as const;

const tickerItems = ['source', 'filter', 'keyBy', 'window', 'reduce', 'sink'];

const goSnippet = `env := weibo.NewEnv().
    WithCheckpointing(30*time.Second,
        checkpoint.NewFileStorage("./ckpt")).
    WithStateBackend(state.Pebble("./state"))

env.FromSource(src).
    KeyBy(byCustomer).WithPartitions(4).
    Reduce(sumAmounts).
    ToSink(sink.NewTxnKafkaSink(
        sink.TxnKafkaBrokers("localhost:9092"),
        sink.TxnKafkaTopic("order-totals"),
        sink.TxnKafkaTransactionalID("orders-v1"),
    ))

env.Execute(ctx)`;

const yamlSnippet = `name: order-totals

pipeline:
  - id: completed
    type: filter
    filter: {field: status, operator: equals,
             value: completed}
  - id: by-customer
    type: keyBy
    keyBy: {field: customer.id, partitions: 4}
  - id: totals
    type: reduce
    reduce: {function: sum, field: amount}

sink:
  type: stdout`;

function SectionTag({ index, label, dark }: { index: string; label: string; dark?: boolean }) {
  return (
    <p
      className={`mm-mono text-xs font-semibold uppercase tracking-[0.22em] ${
        dark ? 'text-[var(--mm-yellow)]' : 'text-[var(--mm-ink)]'
      }`}
    >
      <span className={dark ? 'text-[var(--mm-yellow-soft)]' : 'text-[var(--mm-alert)]'}>
        § {index}
      </span>
      {'  '}
      {label}
    </p>
  );
}

export default function HomePage() {
  return (
    <main className="weibo-manual-theme min-h-screen bg-[var(--mm-yellow)] text-[var(--mm-ink)]">
      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden border-b-2 border-[var(--mm-ink)]">
        <div className="mm-grid-bg absolute inset-0" aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-5 pb-14 pt-10 md:px-8 md:pt-14">
          <div className="mm-rise mm-rise-1 mm-mono flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-[0.22em]">
            <span className="bg-[var(--mm-ink)] px-2 py-1 text-[var(--mm-yellow)]">
              MLR·01 field manual
            </span>
            <span>Stream processing engine / Go</span>
          </div>

          <h1 className="mm-display mm-rise mm-rise-2 mt-4 w-full text-[clamp(4.5rem,15.5vw,11.5rem)] leading-[0.82] tracking-tight">
            WEIBO
          </h1>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start">
            <div className="min-w-0">
              <p className="mm-display mm-rise mm-rise-3 max-w-2xl text-[clamp(1.6rem,3.4vw,2.9rem)] leading-[1.02]">
                Keyed state. Event-time windows. Exactly-once Kafka.
                <span className="text-[var(--mm-alert)]"> One process.</span>
              </p>
              <p className="mm-rise mm-rise-4 mt-6 max-w-xl text-lg font-medium leading-7">
                Weibo is an embeddable stream processing engine for Go —
                Flink-style semantics without the cluster. Build pipelines in
                the Go SDK or declare them in YAML; both compile into the same
                stage-based runtime with durable Pebble state and barrier
                checkpointing.
              </p>
              <div className="mm-rise mm-rise-5 mt-8 flex flex-wrap gap-3">
                <Link href="/docs/getting-started" className="mm-btn mm-btn-solid">
                  Get started →
                </Link>
                <Link href="/docs/internals/architecture" className="mm-btn mm-btn-ghost">
                  Read the internals
                </Link>
              </div>
            </div>

            {/* Terminal plate: real CLI transcript */}
            <aside className="mm-rise mm-rise-4 mm-plate border-2 border-[var(--mm-ink)] bg-[var(--mm-ink)] text-[var(--mm-yellow)]">
              <div className="flex items-center justify-between border-b-2 border-[var(--mm-yellow)]/25 px-4 py-2.5">
                <span className="mm-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--mm-yellow-soft)]">
                  weibo-workflow · dry run
                </span>
                <span className="flex gap-1.5" aria-hidden>
                  <i className="block h-2.5 w-2.5 border border-[var(--mm-yellow)]/60" />
                  <i className="block h-2.5 w-2.5 border border-[var(--mm-yellow)]/60" />
                  <i className="block h-2.5 w-2.5 bg-[var(--mm-alert)]" />
                </span>
              </div>
              <div className="mm-mono px-4 py-4 text-[12.5px] leading-6 [overflow-wrap:anywhere] md:text-[13px]">
                <p className="text-[var(--mm-yellow-soft)]">
                  <span className="text-[var(--mm-alert)]">$</span> go run
                  ./cmd/weibo-workflow \
                </p>
                <p className="pl-4 text-[var(--mm-yellow-soft)]">
                  --file examples/workflows/order-totals.yaml --dry-run
                </p>
                <div className="mt-3 border-t border-[var(--mm-yellow)]/20 pt-3">
                  {terminalOutput.map(([k, v]) => (
                    <p key={k}>
                      <span className="text-[var(--mm-khaki)]">{k}:</span>{' '}
                      <span className="font-medium">{v}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3">
                  <span className="text-[var(--mm-alert)]">$</span>
                  <span className="mm-cursor ml-2 inline-block h-4 w-2 translate-y-0.5 bg-[var(--mm-yellow)]" />
                </p>
              </div>
              <div className="mm-mono border-t-2 border-[var(--mm-yellow)]/25 px-4 py-2.5 text-[11px] uppercase tracking-[0.18em] text-[var(--mm-khaki)]">
                parse → validate → resolve secrets → compile → execute
              </div>
            </aside>
          </div>
        </div>

        {/* Conveyor ticker */}
        <div className="relative border-t-2 border-[var(--mm-ink)] bg-[var(--mm-ink)] py-3 text-[var(--mm-yellow)]">
          <div className="mm-ticker mm-mono text-sm font-semibold uppercase tracking-[0.2em]">
            {[0, 1].map((half) => (
              <span key={half} className="flex shrink-0 items-center" aria-hidden={half === 1}>
                {Array.from({ length: 4 }).flatMap((_, rep) =>
                  tickerItems.map((item, i) => (
                    <span key={`${half}-${rep}-${i}`} className="flex items-center">
                      <span className="px-5">{item}</span>
                      <span className="text-[var(--mm-alert)]">▶</span>
                    </span>
                  )),
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ SPEC STRIP ========================== */}
      <section className="border-b-2 border-[var(--mm-ink)] bg-[var(--mm-ink)] text-[var(--mm-paper)]">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y-2 divide-[var(--mm-yellow)]/20 sm:grid-cols-2 lg:grid-cols-4 lg:divide-y-0 lg:divide-x-2">
          {specs.map(([stat, label, body]) => (
            <div key={stat} className="min-w-0 px-6 py-8">
              <p className="mm-display whitespace-nowrap text-2xl leading-[1.05] text-[var(--mm-yellow)] xl:text-3xl">
                {stat}
              </p>
              <p className="mm-mono mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--mm-khaki)]">
                {label}
              </p>
              <p className="mt-3 text-sm font-medium leading-6 text-[var(--mm-paper)]/75">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ======================= TWO AUTHORING SURFACES =================== */}
      <section className="border-b-2 border-[var(--mm-ink)] bg-[var(--mm-paper)] px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mm-ruler text-[var(--mm-ink)]" aria-hidden />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionTag index="01" label="Authoring" />
              <h2 className="mm-display mt-4 max-w-3xl text-4xl leading-[0.95] md:text-6xl">
                Write Go. Or don&apos;t.
              </h2>
            </div>
            <p className="max-w-sm text-base font-medium leading-6 text-[var(--mm-ink)]/75">
              The SDK gives you custom transforms and full connector control.
              YAML workflows give you validated, declarative pipelines with a
              CLI runner. Same planner, same state, same guarantees.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {/* Go SDK card */}
            <div className="mm-plate border-2 border-[var(--mm-ink)] bg-[var(--mm-yellow)]">
              <div className="flex items-center justify-between border-b-2 border-[var(--mm-ink)] px-5 py-3">
                <h3 className="mm-display text-xl">Go SDK</h3>
                <span className="mm-mono bg-[var(--mm-ink)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--mm-yellow)]">
                  main.go
                </span>
              </div>
              <pre className="mm-mono overflow-x-auto px-5 py-5 text-[12.5px] leading-6">
                <code>{goSnippet}</code>
              </pre>
              <div className="border-t-2 border-[var(--mm-ink)] px-5 py-3">
                <Link
                  href="/docs/sdk/overview"
                  className="mm-mono text-xs font-semibold uppercase tracking-[0.18em] underline underline-offset-4 hover:text-[var(--mm-alert)]"
                >
                  SDK reference →
                </Link>
              </div>
            </div>

            {/* YAML card */}
            <div className="mm-plate border-2 border-[var(--mm-ink)] bg-[var(--mm-ink)] text-[var(--mm-paper)]">
              <div className="flex items-center justify-between border-b-2 border-[var(--mm-yellow)]/30 px-5 py-3">
                <h3 className="mm-display text-xl text-[var(--mm-yellow)]">YAML workflow</h3>
                <span className="mm-mono bg-[var(--mm-yellow)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--mm-ink)]">
                  order-totals.yaml
                </span>
              </div>
              <pre className="mm-mono overflow-x-auto px-5 py-5 text-[12.5px] leading-6 text-[var(--mm-yellow-soft)]">
                <code>{yamlSnippet}</code>
              </pre>
              <div className="border-t-2 border-[var(--mm-yellow)]/30 px-5 py-3">
                <Link
                  href="/docs/workflows/overview"
                  className="mm-mono text-xs font-semibold uppercase tracking-[0.18em] text-[var(--mm-yellow)] underline underline-offset-4 hover:text-[var(--mm-paper)]"
                >
                  Workflow guide →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== RUNTIME ANATOMY ======================= */}
      <section className="border-b-2 border-[var(--mm-ink)] bg-[var(--mm-ink)] px-5 py-16 text-[var(--mm-paper)] md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[380px_1fr] lg:items-start">
            <div className="lg:sticky lg:top-24">
              <SectionTag index="02" label="Runtime anatomy" dark />
              <h2 className="mm-display mt-4 text-4xl leading-[0.95] text-[var(--mm-yellow)] md:text-6xl">
                Small surface. Sharp guarantees.
              </h2>
              <p className="mt-6 max-w-sm text-base font-medium leading-7 text-[var(--mm-paper)]/70">
                Five mechanisms carry the whole engine. Each one is documented
                down to the file and covered by crash tests.
              </p>
              <Link href="/docs/internals/execution-engine" className="mm-btn mm-btn-inverse mt-8">
                Execution engine docs
              </Link>
            </div>

            <ol className="divide-y-2 divide-[var(--mm-yellow)]/20 border-y-2 border-[var(--mm-yellow)]/20">
              {anatomy.map(([title, tag, body], i) => (
                <li
                  key={title}
                  className="grid gap-3 py-7 md:grid-cols-[72px_220px_1fr] md:gap-6"
                >
                  <span className="mm-mono text-sm font-semibold text-[var(--mm-alert)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="mm-display text-xl text-[var(--mm-yellow)]">{title}</h3>
                    <p className="mm-mono mt-1 text-[10.5px] uppercase tracking-[0.16em] text-[var(--mm-khaki)]">
                      {tag}
                    </p>
                  </div>
                  <p className="text-sm font-medium leading-6 text-[var(--mm-paper)]/75">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* =========================== GUARANTEES =========================== */}
      <section className="border-b-2 border-[var(--mm-ink)] bg-[var(--mm-yellow)] px-5 py-16 md:px-8 md:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mm-ruler text-[var(--mm-ink)]" aria-hidden />
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <SectionTag index="03" label="Delivery guarantees" />
              <h2 className="mm-display mt-4 max-w-3xl text-4xl leading-[0.95] md:text-6xl">
                Say what you mean by &ldquo;delivered.&rdquo;
              </h2>
            </div>
            <Link
              href="/docs/operations/delivery-guarantees"
              className="mm-mono text-xs font-semibold uppercase tracking-[0.18em] underline underline-offset-4 hover:text-[var(--mm-alert)]"
            >
              Full guarantee table →
            </Link>
          </div>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[720px] border-2 border-[var(--mm-ink)] bg-[var(--mm-paper)]">
              <thead>
                <tr className="mm-mono border-b-2 border-[var(--mm-ink)] bg-[var(--mm-ink)] text-left text-[11px] uppercase tracking-[0.18em] text-[var(--mm-yellow)]">
                  <th className="px-5 py-3 font-semibold">Guarantee</th>
                  <th className="px-5 py-3 font-semibold">Configuration</th>
                  <th className="px-5 py-3 font-semibold">What happens on a crash</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-[var(--mm-ink)]/15">
                {guarantees.map(([g, config, effect]) => (
                  <tr key={g} className="align-top">
                    <td className="mm-display whitespace-nowrap px-5 py-4 text-lg">
                      {g === 'exactly-once' ? (
                        <span className="bg-[var(--mm-ink)] px-2 py-0.5 text-[var(--mm-yellow)]">
                          {g}
                        </span>
                      ) : (
                        g
                      )}
                    </td>
                    <td className="mm-mono px-5 py-4 text-[12.5px] leading-6">{config}</td>
                    <td className="px-5 py-4 text-sm font-medium leading-6 text-[var(--mm-ink)]/80">
                      {effect}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ============================= FOOTER CTA ========================= */}
      <section className="bg-[var(--mm-ink)] text-[var(--mm-paper)]">
        <div className="mm-hazard h-4" aria-hidden />
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-16 md:flex-row md:items-end md:justify-between md:px-8 md:py-20">
          <div>
            <SectionTag index="04" label="Ship it" dark />
            <h2 className="mm-display mt-4 max-w-3xl text-4xl leading-[0.95] text-[var(--mm-yellow)] md:text-6xl">
              Start local. Point it at Kafka when the shape is right.
            </h2>
            <p className="mm-mono mt-6 text-xs uppercase tracking-[0.18em] text-[var(--mm-khaki)]">
              go get github.com/ASHUTOSH-SWAIN-GIT/weibo
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/docs/getting-started" className="mm-btn mm-btn-inverse">
              Get started
            </Link>
            <Link
              href="/docs/examples"
              className="mm-btn mm-btn-ghost !border-[var(--mm-paper)] !text-[var(--mm-paper)] hover:!bg-[var(--mm-paper)] hover:!text-[var(--mm-ink)]"
            >
              Examples
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
