import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { CopyCommand } from '@/components/landing/copy-command';
import { PipelineShowcase } from '@/components/landing/pipeline-showcase';

const REPO = 'https://github.com/ASHUTOSH-SWAIN-GIT/weibo';

// Figures from docs/benchmarks.md in the engine repository (run 3: 10,000
// events/s on one 2 vCPU machine, job killed with SIGKILL mid-run).
const proof = [
  { value: '4,414,010', label: 'orders processed' },
  { value: '7,000 of 7,000', label: 'window totals exact' },
  { value: '6.4 s', label: 'from kill to running again' },
] as const;

const features = [
  {
    title: 'Keyed state on disk',
    body: 'Per-key state lives in Pebble, so it is bounded by disk instead of memory.',
    handle: 'WithStateBackend(state.Pebble(dir))',
  },
  {
    title: 'Event-time windows',
    body: 'Tumbling, sliding and session windows, with watermarks and allowed lateness.',
    handle: 'Window(window.NewTumbling(d))',
  },
  {
    title: 'Checkpoints and recovery',
    body: 'Barrier-based snapshots restore operator state and source offsets after a crash.',
    handle: 'WithCheckpointing(interval, storage)',
  },
  {
    title: 'Exactly-once Kafka',
    body: 'Kafka to Kafka delivery through a transactional sink that commits with each checkpoint.',
    handle: 'sink.NewTxnKafkaSink(...)',
  },
  {
    title: 'Backpressure',
    body: 'Bounded edges between stages slow a fast source down instead of dropping records.',
    handle: 'WithBufferSize(n)',
  },
  {
    title: 'YAML and a dashboard',
    body: 'Describe common pipelines in YAML and watch every job in the built-in web dashboard.',
    handle: 'weibo dashboard',
  },
] as const;

const entryPoints = [
  { title: 'Go SDK', body: 'Build pipelines from sources, operators, state and sinks.', href: '/docs/sdk/overview' },
  { title: 'Declarative workflows', body: 'Describe common pipelines in YAML and run them with the workflow CLI.', href: '/docs/workflows/overview' },
  { title: 'Internals', body: 'How stages, keyed workers, Pebble state and checkpoints work.', href: '/docs/internals/architecture' },
  { title: 'Operations', body: 'Run with Kafka and Postgres, read the metrics, know the delivery guarantees.', href: '/docs/operations/runtime' },
] as const;

export default function HomePage() {
  return (
    <div className="lp">
      <section className="lp-hero">
        <Link href={`${REPO}/releases/tag/v1.0.3`} className="lp-pill">
          Weibo v1.0.3 is out
          <ChevronRight size={14} aria-hidden="true" />
        </Link>
        <h1>Stream processing that runs inside your Go service</h1>
        <p>
          Weibo is an embeddable engine for stateful pipelines, event-time windows and
          exactly-once Kafka delivery. It runs in your process. No cluster, no JVM.
        </p>
        <div className="lp-actions">
          <Link href="/docs/getting-started" className="lp-btn lp-btn-solid">
            Get started
          </Link>
          <CopyCommand command="go get github.com/ASHUTOSH-SWAIN-GIT/weibo" />
        </div>
      </section>

      <section className="lp-wrap lp-showcase" aria-label="A pipeline and its code">
        <PipelineShowcase />
      </section>

      <section className="lp-wrap lp-proof">
        <div className="lp-proof-copy">
          <h2>We killed it mid-run and checked every answer</h2>
          <p>
            A Kafka to keyed window to S3 pipeline ran at 10,000 events per second on one
            two-core machine. We stopped the job with SIGKILL, then compared each window
            total with the value computed independently from the input.
          </p>
        </div>
        <dl className="lp-stats">
          {proof.map((p) => (
            <div key={p.label}>
              <dt>{p.label}</dt>
              <dd>{p.value}</dd>
            </div>
          ))}
        </dl>
        <p className="lp-note">
          One machine, one Kafka broker, one kill per run. The{' '}
          <Link href={`${REPO}/blob/main/docs/benchmarks.md`}>benchmarks page</Link>{' '}
          lists what was not measured.
        </p>
      </section>

      <section className="lp-wrap lp-features">
        <h2>Everything a stateful pipeline needs, in one process</h2>
        <div className="lp-grid">
          {features.map((f) => (
            <article key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
              <code>{f.handle}</code>
            </article>
          ))}
        </div>
      </section>

      <section className="lp-wrap lp-docs">
        <h2>Start where it fits</h2>
        <ul>
          {entryPoints.map((e) => (
            <li key={e.title}>
              <Link href={e.href}>
                <strong>{e.title}</strong>
                <span>{e.body}</span>
                <ChevronRight size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <footer className="lp-wrap lp-footer">
        <span>Weibo is open source under the MIT license.</span>
        <nav aria-label="Footer">
          <Link href="/docs">Documentation</Link>
          <Link href={REPO}>GitHub</Link>
          <Link href={`${REPO}/releases`}>Releases</Link>
        </nav>
      </footer>
    </div>
  );
}
