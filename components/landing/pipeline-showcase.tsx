'use client';

import { Fragment, useState } from 'react';

// The code below is the real Weibo API (compiled against v1.0.3). Each line is
// tagged with the pipeline stage it configures, so hovering a stage highlights
// its code and hovering code highlights its stage.
type StageId = 'checkpoint' | 'source' | 'key' | 'reduce' | 'sink';

const LINES: { code: string; stage: StageId | null }[] = [
  { code: 'env := weibo.NewEnv().', stage: 'checkpoint' },
  { code: '    WithCheckpointing(5*time.Second, checkpoint.NewFileStorage("./checkpoints"))', stage: 'checkpoint' },
  { code: '', stage: null },
  { code: 'src := source.NewKafkaSource(', stage: 'source' },
  { code: '    source.KafkaBrokers("localhost:9092"),', stage: 'source' },
  { code: '    source.KafkaTopic("orders"),', stage: 'source' },
  { code: '    source.KafkaGroupID("order-totals"),', stage: 'source' },
  { code: '    source.KafkaExactlyOnce(),', stage: 'source' },
  { code: ')', stage: 'source' },
  { code: '', stage: null },
  { code: 'out := sink.NewTxnKafkaSink(', stage: 'sink' },
  { code: '    sink.TxnKafkaBrokers("localhost:9092"),', stage: 'sink' },
  { code: '    sink.TxnKafkaTopic("order-totals"),', stage: 'sink' },
  { code: '    sink.TxnKafkaTransactionalID("order-totals"),', stage: 'sink' },
  { code: ')', stage: 'sink' },
  { code: '', stage: null },
  { code: 'env.FromSource(src).', stage: 'source' },
  { code: '    KeyBy(byCustomer).WithPartitions(4).', stage: 'key' },
  { code: '    Reduce(sumAmounts).', stage: 'reduce' },
  { code: '    ToSink(out)', stage: 'sink' },
  { code: '', stage: null },
  { code: 'env.Execute(ctx)', stage: null },
];

const STAGES: { id: Exclude<StageId, 'checkpoint'>; name: string; detail: string }[] = [
  { id: 'source', name: 'Kafka source', detail: 'orders, read exactly once' },
  { id: 'key', name: 'Key by customer', detail: '4 parallel partitions' },
  { id: 'reduce', name: 'Reduce', detail: 'running total per key' },
  { id: 'sink', name: 'Transactional sink', detail: 'order-totals, commits with each checkpoint' },
];

type Token = { text: string; kind?: 'str' | 'num' | 'pkg' | 'fn' };

// A tiny highlighter for this one fixed snippet: strings, numbers, package
// qualifiers and called functions. Everything else stays plain.
function tokenize(line: string): Token[] {
  const re = /("(?:[^"\\]|\\.)*")|(\b\d+\b)|\b(weibo|source|sink|checkpoint|time)(?=\.)|([A-Za-z_][A-Za-z0-9_]*)(?=\()/g;
  const out: Token[] = [];
  let last = 0;
  for (const m of line.matchAll(re)) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: line.slice(last, at) });
    const kind = m[1] ? 'str' : m[2] ? 'num' : m[3] ? 'pkg' : 'fn';
    out.push({ text: m[0], kind });
    last = at + m[0].length;
  }
  if (last < line.length) out.push({ text: line.slice(last) });
  return out;
}

export function PipelineShowcase() {
  const [active, setActive] = useState<StageId | null>(null);

  return (
    <div
      className="lp-panel"
      data-focus={active ?? undefined}
      onMouseLeave={() => setActive(null)}
    >
      <div className="lp-panel-code">
        <div className="lp-tab">main.go</div>
        <pre className="lp-code" tabIndex={0} aria-label="A Weibo pipeline written in Go">
          <code>
            {LINES.map((line, i) => (
              <span
                key={i}
                className="lp-line"
                data-stage={line.stage ?? undefined}
                data-on={active !== null && line.stage === active ? 'true' : undefined}
                data-dim={active !== null && line.stage !== active ? 'true' : undefined}
                onMouseEnter={() => line.stage && setActive(line.stage)}
              >
                {tokenize(line.code).map((t, j) => (
                  <Fragment key={j}>
                    {t.kind ? <span className={`lp-tk-${t.kind}`}>{t.text}</span> : t.text}
                  </Fragment>
                ))}
                {'\n'}
              </span>
            ))}
          </code>
        </pre>
      </div>

      <div className="lp-panel-flow">
        <div className="lp-tab">Pipeline</div>
        <ol className="lp-stages">
          {STAGES.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className="lp-stage"
                data-on={active === s.id ? 'true' : undefined}
                aria-pressed={active === s.id}
                onMouseEnter={() => setActive(s.id)}
                onFocus={() => setActive(s.id)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === s.id ? null : s.id)}
              >
                <span className="lp-stage-mark" aria-hidden="true" />
                <span className="lp-stage-name">{s.name}</span>
                <span className="lp-stage-detail">{s.detail}</span>
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          className="lp-checkpoint"
          data-on={active === 'checkpoint' ? 'true' : undefined}
          aria-pressed={active === 'checkpoint'}
          onMouseEnter={() => setActive('checkpoint')}
          onFocus={() => setActive('checkpoint')}
          onBlur={() => setActive(null)}
          onClick={() => setActive(active === 'checkpoint' ? null : 'checkpoint')}
        >
          Checkpoint every 5 seconds to <code>./checkpoints</code>
        </button>
      </div>
    </div>
  );
}
