import Link from 'next/link';
import {
  Activity,
  Boxes,
  Braces,
  Check,
  Clock3,
  Code2,
  Database,
  GitBranch,
  Layers3,
  LockKeyhole,
  Repeat2,
  Route,
  ServerCog,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

const stats = [
  ['1 process', 'No cluster, no JVM'],
  ['5M+', 'Keys checkpointed locally'],
  ['<100ms', 'Measured restore path'],
] as const;

const useCases = [
  ['Order totals', Activity, 'yellow'],
  ['Fraud detection', ShieldCheck, 'orange'],
  ['CDC fanout', GitBranch, 'pink'],
  ['Session windows', Clock3, 'green'],
  ['Metrics streams', Repeat2, 'cyan'],
  ['Event enrichment', Layers3, 'red'],
  ['Kafka pipelines', Route, 'purple'],
  ['Local workflow runs', Terminal, 'tan'],
] as const;

const sessions = [
  ['Pebble-backed state', 'Durable local state with cheap hard-link checkpoints.', Database],
  ['Exactly-once Kafka', 'Sink output, source offsets, and state commit together.', LockKeyhole],
  ['Fast local runtime', 'Run pipelines inside one Go service during development.', ServerCog],
  ['Reusable context', 'Workflow YAML and SDK code compile to the same planner.', Boxes],
  ['1-line SDK path', 'Import Weibo, define the graph, execute in-process.', Code2],
  ['Prometheus metrics', 'Inspect edge capacity, blocked sends, records, and lag.', Activity],
] as const;

const snippets = {
  Go: `env := weibo.NewEnv().
  WithCheckpointing(30*time.Second, checkpoint.NewFileStorage("./ckpt")).
  WithStateBackend(state.Pebble("./state"))

env.FromSource(orders).
  KeyBy(byCustomer).WithPartitions(4).
  Reduce(sumAmounts).
  ToSink(sink.NewTxnKafkaSink(...))

env.Execute(ctx)`,
  YAML: `name: order-totals

pipeline:
  - id: completed
    type: filter
  - id: by-customer
    type: keyBy
  - id: totals
    type: reduce

sink:
  type: stdout`,
} as const;

const examples = [
  ['SDK overview', 'Build a pipeline in Go with sources, operators, and sinks.', '/docs/sdk/overview'],
  ['Workflow format', 'Declare the same graph in YAML and run it through the CLI.', '/docs/workflows/format'],
  ['Checkpointing', 'Understand barriers, storage, replay, and recovery paths.', '/docs/internals/checkpointing'],
  ['Kafka operations', 'Wire Weibo into Kafka sources and transactional sinks.', '/docs/operations/kafka'],
  ['Windowing', 'Use event-time windows and deterministic aggregations.', '/docs/internals/windowing'],
  ['Examples', 'Start from complete pipelines instead of blank files.', '/docs/examples'],
] as const;

const guarantees = [
  ['Launch', '$0', 'Start locally and run examples', ['Go SDK', 'YAML workflows', 'Local runner', 'Docs']],
  [
    'Scale',
    'exactly-once',
    'Use Weibo in production pipelines',
    ['Kafka transactions', 'Pebble state', 'Checkpoint barriers', 'Metrics'],
  ],
  [
    'Enterprise',
    'custom',
    'Fit the runtime into your system',
    ['Custom connectors', 'Runtime internals', 'Operational docs', 'Crash semantics'],
  ],
] as const;

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="steel-code">
      <div className="steel-lines" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="weibo-steel min-h-screen bg-[#050505] text-white">
      <div className="steel-bg" aria-hidden />

      <div className="steel-page">
        <div className="steel-announcement">
          <span aria-hidden>●</span>
          <Link href="/docs/getting-started">See what shipped in Weibo docs</Link>
        </div>

        <div className="steel-nav">
          <Link href="#hero" className="steel-brand" aria-label="Weibo home">
            <img src="/weibo-mark.png" alt="" />
          </Link>

          <div className="steel-nav-links">
            <Link href="#runtime">Runtime</Link>
            <Link href="#stack">SDK</Link>
            <Link href="#examples">Examples</Link>
            <Link href="/docs">Docs</Link>
          </div>

          <Link href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo" className="steel-github">
            <GitBranch size={16} />
            <span>GitHub</span>
          </Link>

          <Link href="/docs/getting-started" className="steel-dashboard">
            Dashboard
          </Link>
        </div>

        <section id="hero" className="steel-hero">
          <div className="steel-hero-copy">
            <h1>Stream Infrastructure for Go Services</h1>
            <p>
              Weibo is an embeddable stream processing engine with keyed state,
              event-time windows, checkpointing, and Kafka delivery semantics.
            </p>
            <div className="steel-actions">
              <Link href="/docs/getting-started" className="steel-primary">
                Start Building
              </Link>
              <button type="button" className="steel-secondary">
                Copy Install Command
              </button>
            </div>
          </div>

          <div className="steel-hero-art">
            <div className="steel-cyan-field" aria-hidden />
            <div className="steel-floating steel-floating-a">
              <span>MY_APP</span>
              <p>Aggregate completed orders by customer.</p>
              <p>Checkpoint every 30 seconds.</p>
              <p className="green">Pipeline compiled.</p>
            </div>
            <div className="steel-floating steel-floating-b">
              <span>WEIBO_RUNTIME</span>
              {['source', 'keyBy', 'reduce'].map((item) => (
                <div key={item}>
                  <p>{item}</p>
                  <i />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="steel-stats">
          {stats.map(([value, label]) => (
            <div key={value}>
              <h4>{value}</h4>
              <p>{label}</p>
            </div>
          ))}
        </section>

        <section className="steel-section steel-use-cases">
          <div className="steel-section-copy">
            <p>Use Cases</p>
            <h3>What Developers Build on Weibo</h3>
            <span>
              From local workflow runs to durable Kafka pipelines, Weibo keeps
              stream processing close to your Go application.
            </span>
          </div>
          <div className="steel-use-grid">
            {useCases.map(([label, Icon, tone]) => (
              <div key={label} className={`steel-use-tile tone-${tone}`}>
                <Icon size={20} />
                <p>{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="runtime" className="steel-section steel-sessions">
          <div className="steel-section-copy">
            <Boxes size={30} />
            <h2>Runtime API</h2>
            <p>Spin up local stream pipelines with the same primitives you ship.</p>
            <Link href="/docs/internals/architecture" className="steel-primary">
              Read Internals
            </Link>
          </div>
          <div className="steel-session-grid">
            {sessions.map(([title, body, Icon]) => (
              <div key={title} className="steel-session-card">
                <div className="steel-session-art">
                  <Icon size={34} />
                </div>
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="steel-section steel-code-wide">
          <div className="steel-code-card">
            <div className="steel-panel-title">WEIBO_LOGIC</div>
            <CodeBlock code={snippets.Go} />
          </div>
        </section>

        <section id="stack" className="steel-section steel-stack">
          <div className="steel-section-copy">
            <h3>Get Started with Your Favorite Surface</h3>
            <span>
              Use the Go SDK when you need full control, or declarative YAML
              when the pipeline shape should live in configuration.
            </span>
            <Link href="/docs" className="steel-doc-link">
              Docs
            </Link>
          </div>

          <div className="steel-stack-card">
            <div className="steel-tabs">
              <span>Go</span>
              <span>YAML</span>
              <span>CLI</span>
              <span>Kafka</span>
              <span>Prometheus</span>
              <span className="muted">More Soon</span>
            </div>
            <CodeBlock code={snippets.YAML} />
            <Link href="/docs/workflows/overview" className="steel-sdk-link">
              view Workflow docs
            </Link>
          </div>
        </section>

        <section id="examples" className="steel-section steel-examples">
          <div className="steel-section-copy">
            <h3>Cookbook Examples</h3>
            <span>Try Weibo with focused examples that map to real stream jobs.</span>
            <Link href="/docs/examples" className="steel-doc-link">
              View All Examples
            </Link>
          </div>
          <div className="steel-example-grid">
            {examples.map(([title, body, href]) => (
              <Link href={href} key={title} className="steel-example-card">
                <Braces size={20} />
                <h4>{title}</h4>
                <p>{body}</p>
                <span>View</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="steel-section steel-pricing">
          <div className="steel-section-copy">
            <h3>Delivery Guarantees</h3>
            <span>
              Pick the semantics your pipeline needs, then wire the matching
              source, checkpoint, and sink behavior.
            </span>
          </div>
          <div className="steel-price-grid">
            {guarantees.map(([name, price, body, items]) => (
              <div key={name} className="steel-price-card">
                <div>
                  <p>{name}</p>
                  <h3>{price}</h3>
                  <span>{body}</span>
                </div>
                <ul>
                  {items.map((item) => (
                    <li key={item}>
                      <Check size={15} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/docs/operations/delivery-guarantees">Get Started</Link>
              </div>
            ))}
          </div>
        </section>

        <section className="steel-repo">
          <div>
            <p>GitHub Repository</p>
            <span>
              Weibo is built for developers who want stream processing without a
              separate cluster to operate.
            </span>
          </div>
          <Link href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo">
            <GitBranch size={18} />
            weibo
          </Link>
        </section>

        <section className="steel-research">
          <div>
            <h2>Runtime</h2>
            <h2>Docs</h2>
          </div>
          <p>
            Read the internals when you need to reason about barriers, worker
            routing, state backends, checkpoint storage, and recovery behavior.
          </p>
        </section>

        <section className="steel-final">
          <div>
            <h1>Ready to</h1>
            <h1>Build with Weibo?</h1>
          </div>
          <div>
            <Link href="/docs/getting-started" className="steel-primary">
              Start Building
            </Link>
            <Link href="/docs" className="steel-secondary-link">
              Documentation
            </Link>
          </div>
        </section>

        <footer className="steel-footer">
          <div>
            <img src="/weibo-mark.png" alt="" />
            <p>A better way to run stateful streams in Go.</p>
            <span>Weibo docs.</span>
          </div>
          <div>
            <p>Platform</p>
            <Link href="/docs">Docs</Link>
            <Link href="/docs/examples">Examples</Link>
            <Link href="/docs/reference/roadmap">Roadmap</Link>
          </div>
          <div>
            <p>Project</p>
            <Link href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo">GitHub</Link>
            <Link href="/docs/internals/architecture">Architecture</Link>
            <Link href="/docs/operations/runtime">Operations</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
