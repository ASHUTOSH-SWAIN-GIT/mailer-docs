import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  Cube,
  GithubLogo,
  Lightning,
  ShieldCheck,
  Stack,
  Waveform,
} from '@phosphor-icons/react/dist/ssr';

const features = [
  {
    Icon: Cube,
    title: 'No cluster to run',
    body: 'Weibo compiles into your Go binary. State, checkpoints, and recovery live inside the process that owns them.',
  },
  {
    Icon: Waveform,
    title: 'Stateful by default',
    body: 'Keyed state, event-time windows, and durable Pebble storage — recovered deterministically after a crash.',
  },
  {
    Icon: ShieldCheck,
    title: 'Exactly-once to Kafka',
    body: 'Barrier checkpointing aligns source offsets, operator state, and sink transactions into one durable commit.',
  },
  {
    Icon: Lightning,
    title: 'Backpressure you can see',
    body: 'Bounded edges expose capacity, throughput, and lag as metrics — nothing silently falls behind.',
  },
] as const;

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
    <main className="wm">
      <nav className="wm-nav">
        <Link href="#top" className="wm-brand">
          <img src="/weibo-mark.png" alt="" />
          <span>Weibo</span>
        </Link>
        <div className="wm-nav-links">
          <Link href="/docs">Documentation</Link>
          <Link href="/docs/getting-started">Quickstart</Link>
        </div>
        <Link className="wm-nav-github" href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo">
          <GithubLogo size={18} weight="regular" />
          GitHub
        </Link>
      </nav>

      <section id="top" className="wm-hero">
        <p className="wm-eyebrow">Open source · Go</p>
        <h1>
          Stream processing that <span>lives in your code.</span>
        </h1>
        <p className="wm-lede">
          Weibo is an embeddable stream processing engine for Go — stateful
          pipelines, event-time windows, and exactly-once Kafka delivery,
          with no cluster to operate.
        </p>
        <div className="wm-actions">
          <Link href="/docs/getting-started" className="wm-btn-primary">
            Get started <ArrowRight size={16} weight="bold" />
          </Link>
          <Link href="/docs" className="wm-btn-secondary">
            Read the docs
          </Link>
        </div>
        <code className="wm-install">go get github.com/ASHUTOSH-SWAIN-GIT/weibo</code>
      </section>

      <section className="wm-code">
        <div className="wm-code-window">
          <div className="wm-code-bar">
            <span className="wm-dots"><i /><i /><i /></span>
            <span>pipeline.go</span>
          </div>
          <pre><code>{code}</code></pre>
        </div>
      </section>

      <section className="wm-features">
        {features.map(({ Icon, title, body }) => (
          <article key={title}>
            <Icon size={22} weight="light" />
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section className="wm-entry">
        <div className="wm-entry-head">
          <h2>Start building</h2>
          <Link href="/docs">
            Browse all docs <ArrowUpRight size={15} weight="bold" />
          </Link>
        </div>
        <div className="wm-entry-list">
          {entryPoints.map(([title, desc, href]) => (
            <Link href={href} key={title} className="wm-entry-item">
              <div>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
              <ArrowUpRight size={16} weight="regular" />
            </Link>
          ))}
        </div>
      </section>

      <footer className="wm-footer">
        <div className="wm-brand">
          <img src="/weibo-mark.png" alt="" />
          <span>Weibo</span>
        </div>
        <div className="wm-footer-links">
          <Link href="/docs">Documentation</Link>
          <Link href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo">
            <Stack size={14} weight="regular" /> GitHub
          </Link>
        </div>
      </footer>
    </main>
  );
}
