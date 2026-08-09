import Link from 'next/link';
import {
  ArrowRight,
  Check,
  ChevronRight,
  CircleDot,
  Clock3,
  Code2,
  Database,
  GitBranch,
  Layers3,
  Menu,
  Network,
  Play,
  RotateCcw,
  Terminal,
  Workflow,
  Zap,
} from 'lucide-react';

const stages = [
  { name: 'Kafka source', detail: 'orders.v1', Icon: CircleDot },
  { name: 'Key by', detail: 'customer_id', Icon: GitBranch },
  { name: 'Reduce', detail: 'running_total', Icon: Workflow },
  { name: 'Txn sink', detail: 'balances.v1', Icon: Database },
] as const;

const capabilities = [
  ['01', 'State lives with your code', 'Embed the runtime in a Go process. No control plane, JVM, or separate cluster to babysit.', Code2],
  ['02', 'Recovery is a protocol', 'Barriers align state, source offsets, and transactional output into one durable commit.', RotateCcw],
  ['03', 'Backpressure is visible', 'Bounded edges expose blocked sends, capacity, throughput, and lag through metrics.', Network],
] as const;

const docs = [
  ['Build a pipeline', 'Go SDK', '/docs/sdk/overview'],
  ['Declare a workflow', 'YAML', '/docs/workflows/format'],
  ['Reason about recovery', 'Internals', '/docs/internals/checkpointing'],
  ['Operate Kafka safely', 'Operations', '/docs/operations/kafka'],
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
    <main className="weibo-dev">
      <nav className="dev-nav" aria-label="Primary navigation">
        <Link href="#top" className="dev-brand" aria-label="Weibo home">
          <img src="/weibo-mark.png" alt="" />
          <span>weibo</span>
          <small>stream runtime</small>
        </Link>
        <div className="dev-nav-links">
          <Link href="#runtime">Runtime</Link>
          <Link href="#architecture">Architecture</Link>
          <Link href="#docs">Docs</Link>
        </div>
        <Link className="dev-github" href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo">
          <GitBranch size={17} />
          <span>View source</span>
        </Link>
        <button className="dev-menu" type="button" aria-label="Open navigation">
          <Menu size={20} />
        </button>
      </nav>

      <section id="top" className="dev-hero">
        <div className="dev-hero-copy">
          <div className="dev-kicker"><span /> Open source · built in Go</div>
          <h1>Streams that run<br />where your code runs.</h1>
          <p>
            Weibo is an embeddable stream processing engine for stateful pipelines,
            event-time windows, and exactly-once Kafka delivery.
          </p>
          <div className="dev-actions">
            <Link href="/docs/getting-started" className="dev-button dev-button-primary">
              Read the quickstart <ArrowRight size={17} />
            </Link>
            <code>go get github.com/ASHUTOSH-SWAIN-GIT/weibo</code>
          </div>
        </div>

        <div className="dev-trace" aria-label="Example stream pipeline">
          <div className="dev-trace-head">
            <span><i /> pipeline / order-totals</span>
            <span>RUNNING</span>
          </div>
          <div className="dev-stage-list">
            {stages.map(({ name, detail, Icon }, index) => (
              <div className="dev-stage" key={name}>
                <div className="dev-stage-index">0{index + 1}</div>
                <div className="dev-stage-icon"><Icon size={20} /></div>
                <div><strong>{name}</strong><span>{detail}</span></div>
                <div className="dev-pulse"><i /><i /><i /></div>
              </div>
            ))}
          </div>
          <div className="dev-trace-foot">
            <span><Clock3 size={14} /> checkpoint 184 committed</span>
            <span>8,421 rec/s</span>
          </div>
        </div>

        <div className="dev-hero-meta">
          <span>NO CLUSTER</span><span>PEBBLE STATE</span><span>BOUNDED EDGES</span><span>KAFKA TRANSACTIONS</span>
        </div>
      </section>

      <section id="runtime" className="dev-manifesto">
        <div className="dev-section-label">Runtime model <span>01</span></div>
        <div className="dev-manifesto-copy">
          <h2>Your application is the platform.</h2>
          <p>
            Keep stream logic, deployment, and observability in the same place as
            the service that owns them. Weibo gives Go applications durable state
            without introducing another distributed system.
          </p>
        </div>
        <div className="dev-capabilities">
          {capabilities.map(([number, title, body, Icon]) => (
            <article key={number}>
              <div className="dev-cap-top"><span>{number}</span><Icon size={22} /></div>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="architecture" className="dev-architecture">
        <div className="dev-section-label">Authoring model <span>02</span></div>
        <div className="dev-code-copy">
          <div>
            <span className="dev-eyebrow">One graph. One process.</span>
            <h2>Describe the flow.<br />Weibo handles the machinery.</h2>
          </div>
          <p>Sources, keyed operators, state, and sinks compile into a bounded execution graph with deterministic recovery.</p>
        </div>
        <div className="dev-code-window">
          <div className="dev-code-rail">
            <span className="active"><Code2 size={17} /> pipeline.go</span>
            <span><Terminal size={17} /> output</span>
            <span><Layers3 size={17} /> graph</span>
          </div>
          <div className="dev-code-main">
            <div className="dev-code-title"><span>pipeline.go</span><small>Go</small></div>
            <pre><code>{code}</code></pre>
          </div>
          <aside className="dev-runtime-log">
            <div><span>RUNTIME</span><i>LIVE</i></div>
            <p><b>14:32:08</b> graph compiled</p>
            <p><b>14:32:08</b> restored checkpoint 183</p>
            <p><b>14:32:09</b> partitions assigned [0..3]</p>
            <p className="ok"><b>14:32:39</b> checkpoint 184 committed</p>
            <div className="dev-log-metric"><small>records</small><strong>4.8M</strong></div>
            <div className="dev-log-metric"><small>p99 latency</small><strong>38ms</strong></div>
          </aside>
        </div>
      </section>

      <section className="dev-contract">
        <div className="dev-section-label">Delivery contract <span>03</span></div>
        <div className="dev-contract-grid">
          <div className="dev-contract-title">
            <Zap size={28} />
            <h2>Crash anywhere.<br />Resume precisely.</h2>
          </div>
          <div className="dev-checks">
            {['Source offsets captured', 'Operator state persisted', 'Sink transaction committed', 'Graph restored deterministically'].map((item) => (
              <div key={item}><Check size={16} /><span>{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section id="docs" className="dev-docs">
        <div className="dev-section-label">Start building <span>04</span></div>
        <div className="dev-docs-head">
          <h2>Pick your entry point.</h2>
          <Link href="/docs">Browse all documentation <ArrowRight size={16} /></Link>
        </div>
        <div className="dev-doc-list">
          {docs.map(([title, type, href], index) => (
            <Link href={href} key={title}>
              <span>0{index + 1}</span>
              <strong>{title}</strong>
              <small>{type}</small>
              <ChevronRight size={20} />
            </Link>
          ))}
        </div>
      </section>

      <section className="dev-final">
        <img src="/weibo-mark.png" alt="" />
        <div>
          <span>Stateful stream processing for Go</span>
          <h2>Ship the pipeline<br />with the product.</h2>
        </div>
        <Link href="/docs/getting-started" className="dev-final-link"><Play size={18} fill="currentColor" /> Start with Weibo</Link>
      </section>

      <footer className="dev-footer">
        <span>Weibo · open source stream runtime</span>
        <div><Link href="/docs">Documentation</Link><Link href="https://github.com/ASHUTOSH-SWAIN-GIT/weibo">GitHub</Link></div>
      </footer>
    </main>
  );
}
