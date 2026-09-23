import Link from 'next/link';
import {
  ArrowUpRight,
  Clock,
  Cube,
  Database,
  Gauge,
  ShieldCheck,
  SquaresFour,
} from '@phosphor-icons/react/dist/ssr';
import { CopyCommand } from '@/components/home/copy-command';
import './home.css';

const features = [
  { Icon: Cube, title: 'Embedded', body: 'A Go library, not a cluster. Import it and run it inside your service.' },
  { Icon: Database, title: 'Keyed state', body: 'Per-key state in memory, or on disk with Pebble for millions of keys.' },
  { Icon: Clock, title: 'Event time', body: 'Tumbling, sliding, and session windows driven by watermarks.' },
  { Icon: ShieldCheck, title: 'Exactly-once', body: 'Offsets, state, and Kafka output commit as one checkpoint.' },
  { Icon: Gauge, title: 'Backpressure', body: 'Bounded edges. A slow sink slows the source, not your memory.' },
  { Icon: SquaresFour, title: 'Control plane', body: 'Optional dashboard, CLI, and REST API to run jobs as containers.' },
];

const entryPoints = [
  ['Go SDK', 'Build a pipeline in code', '/docs/sdk/overview'],
  ['Workflows', 'Declare a pipeline in YAML', '/docs/workflows/format'],
  ['Internals', 'How checkpointing works', '/docs/internals/checkpointing'],
  ['Deployment', 'Self-host the control plane', '/docs/operations/deployment'],
] as const;

const code = `env := weibo.NewEnv().
    WithCheckpointing(30*time.Second, storage).
    WithStateBackend(state.Pebble("./state"))

env.FromSource(orders).
    KeyBy(byCustomer).WithPartitions(4).
    Reduce(sumAmounts).
    ToSink(kafka.NewTransactionalSink(output))

env.Execute(ctx)`;

export default function HomePage() {
  return (
    <main className="vx">
      <nav className="vx-nav">
        <div className="vx-nav-inner">
          <Link href="/" className="vx-brand">
            <img src="/weibo-mark.png" alt="" />
            Weibo
          </Link>
          <div className="vx-nav-links">
            <Link href="/docs">Docs</Link>
            <Link href="/docs/examples">Examples</Link>
            <Link href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo">GitHub</Link>
          </div>
          <Link href="/docs/installation" className="vx-btn vx-btn-light vx-btn-sm">
            Get started
          </Link>
        </div>
      </nav>

      <section className="vx-hero">
        <p className="vx-eyebrow">Open source · Go</p>
        <h1>Stream processing that lives in your code.</h1>
        <p className="vx-lede">
          Weibo is an embeddable stream processing engine for Go — keyed
          state, event-time windows, and exactly-once Kafka delivery, with no
          cluster to operate.
        </p>
        <div className="vx-actions">
          <Link href="/docs/getting-started" className="vx-btn vx-btn-light">
            Get started
          </Link>
          <Link href="/docs" className="vx-btn vx-btn-ghost">
            Read the docs
          </Link>
        </div>
        <CopyCommand command="go get github.com/ASHUTOSH-SWAIN-GIT/weibo" />
      </section>

      <section className="vx-section">
        <div className="vx-code">
          <div className="vx-code-bar">pipeline.go</div>
          <pre>
            <code>{code}</code>
          </pre>
        </div>
      </section>

      <section className="vx-section">
        <div className="vx-grid">
          {features.map(({ Icon, title, body }) => (
            <article key={title}>
              <Icon size={20} weight="light" />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="vx-section vx-entry">
        <div className="vx-entry-head">
          <h2>Start building</h2>
          <Link href="/docs">
            Browse all docs <ArrowUpRight size={15} weight="bold" />
          </Link>
        </div>
        <div className="vx-entry-list">
          {entryPoints.map(([title, desc, href]) => (
            <Link href={href} key={title} className="vx-entry-item">
              <div>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
              <ArrowUpRight size={16} weight="regular" />
            </Link>
          ))}
        </div>
      </section>

      <footer className="vx-footer">
        <div className="vx-brand">
          <img src="/weibo-mark.png" alt="" />
          Weibo
        </div>
        <div className="vx-footer-links">
          <Link href="/docs">Docs</Link>
          <Link href="/docs/installation">Install</Link>
          <Link href="/docs/troubleshooting">FAQ</Link>
          <Link href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo">GitHub</Link>
        </div>
        <span>MIT License</span>
      </footer>
    </main>
  );
}
