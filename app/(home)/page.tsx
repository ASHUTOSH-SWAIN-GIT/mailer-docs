import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Cube,
  Database,
  Gauge,
  GithubLogo,
  ShieldCheck,
  SquaresFour,
} from '@phosphor-icons/react/dist/ssr';
import { CopyCommand } from '@/components/home/copy-command';
import { CodeTabs } from '@/components/home/code-tabs';
import './home.css';

const nodes = [
  { name: 'source', detail: 'kafka · orders' },
  { name: 'keyBy', detail: 'customer_id' },
  { name: 'window', detail: 'tumbling 5m' },
  { name: 'sink', detail: 'txn kafka' },
];

const features = [
  { Icon: Cube, title: 'Embedded', body: 'A Go library, not a cluster. Import it and run it inside your service.' },
  { Icon: Database, title: 'Keyed state', body: 'Per-key state in memory, or on disk with Pebble for millions of keys.' },
  { Icon: Clock, title: 'Event time', body: 'Tumbling, sliding, and session windows driven by watermarks.' },
  { Icon: ShieldCheck, title: 'Exactly-once', body: 'Offsets, state, and Kafka output commit as one checkpoint.' },
  { Icon: Gauge, title: 'Backpressure', body: 'Bounded edges. A slow sink slows the source, not your memory.' },
  { Icon: SquaresFour, title: 'Control plane', body: 'Optional dashboard, CLI, and REST API to run jobs as containers.' },
];

const stats = [
  ['0', 'clusters to operate'],
  ['75 ms', 'checkpoint at 5M keys'],
  ['100%', 'Go, no CGO'],
  ['MIT', 'open source'],
];

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
            <Link href="/docs/concepts">Concepts</Link>
            <Link href="/docs/examples">Examples</Link>
            <Link href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo">GitHub</Link>
          </div>
          <Link href="/docs/installation" className="vx-btn vx-btn-light vx-btn-sm">
            Get started
          </Link>
        </div>
      </nav>

      <section className="vx-hero">
        <div className="vx-hero-grid" aria-hidden />
        <Link href="/docs/operations/dashboard" className="vx-badge">
          <span>New</span> Control plane dashboard <ArrowRight size={12} weight="bold" />
        </Link>
        <h1>
          Stateful streams,
          <br />
          embedded in Go.
        </h1>
        <p className="vx-lede">
          Weibo is a stream processing engine you import, not a cluster you run.
          Keyed state, event-time windows, and exactly-once Kafka in a single process.
        </p>
        <div className="vx-actions">
          <Link href="/docs/getting-started" className="vx-btn vx-btn-light">
            Start building
          </Link>
          <CopyCommand command="go get github.com/ASHUTOSH-SWAIN-GIT/weibo" />
        </div>

        <div className="vx-flow" aria-label="Records flowing through a Weibo pipeline while a checkpoint barrier passes">
          <div className="vx-flow-track" />
          {Array.from({ length: 8 }).map((_, i) => (
            <i key={i} className="vx-flow-dot" style={{ animationDelay: `${i * 0.55}s` }} />
          ))}
          <div className="vx-flow-barrier">
            <span>barrier · ckpt 184</span>
          </div>
          {nodes.map((node, i) => (
            <div key={node.name} className="vx-flow-node" style={{ left: `${12 + i * 25.3}%` }}>
              <strong>{node.name}</strong>
              <small>{node.detail}</small>
            </div>
          ))}
          <div className="vx-flow-commit">committed</div>
        </div>
      </section>

      <section className="vx-section">
        <div className="vx-grid">
          <span className="vx-plus tl" />
          <span className="vx-plus tr" />
          <span className="vx-plus bl" />
          <span className="vx-plus br" />
          {features.map(({ Icon, title, body }) => (
            <article key={title}>
              <Icon size={20} weight="light" />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="vx-section vx-split">
        <div>
          <p className="vx-kicker">Two ways in</p>
          <h2>Write it in Go.<br />Or declare it in YAML.</h2>
          <p>
            Use the fluent SDK when you need custom logic. Use workflows for
            common pipelines, validated and deployable without a build.
          </p>
          <div className="vx-links">
            <Link href="/docs/sdk/overview">SDK overview <ArrowUpRight size={14} /></Link>
            <Link href="/docs/workflows/overview">Workflows <ArrowUpRight size={14} /></Link>
          </div>
        </div>
        <CodeTabs />
      </section>

      <section className="vx-section">
        <div className="vx-stats">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="vx-cta">
        <h2>Ship the pipeline with the product.</h2>
        <div className="vx-actions">
          <Link href="/docs/installation" className="vx-btn vx-btn-light">
            Install Weibo
          </Link>
          <Link href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo" className="vx-btn vx-btn-ghost">
            <GithubLogo size={16} /> Star on GitHub
          </Link>
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
