'use client';

import { useState } from 'react';

const tabs = {
  Go: {
    file: 'pipeline.go',
    code: `env := weibo.NewEnv().
    WithCheckpointing(30*time.Second, storage).
    WithStateBackend(state.Pebble("./state"))

env.FromSource(orders).
    Filter(isCompleted, "completed").
    KeyBy(byCustomer).WithPartitions(4).
    WindowReduce(window.NewTumbling(5*time.Minute), sum).
    ToSink(kafka.NewTransactionalSink(totals))

env.Execute(ctx)`,
  },
  YAML: {
    file: 'order-totals.yaml',
    code: `source:
  type: kafka
  kafka: { brokers: [localhost:9092], topic: orders }
pipeline:
  - id: completed
    type: filter
    filter: { field: status, operator: equals, value: completed }
  - id: by-customer
    type: keyBy
    keyBy: { field: customer.id, partitions: 4 }
  - id: totals
    type: reduce
    reduce: { function: sum, field: amount }
sink:
  type: txnKafka
  txnKafka: { topic: totals, transactionalID: order-totals }`,
  },
} as const;

type Tab = keyof typeof tabs;

export function CodeTabs() {
  const [active, setActive] = useState<Tab>('Go');
  const current = tabs[active];

  return (
    <div className="vx-code">
      <div className="vx-code-bar">
        <div className="vx-tabs" role="tablist">
          {(Object.keys(tabs) as Tab[]).map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={active === name}
              className={active === name ? 'active' : undefined}
              onClick={() => setActive(name)}
            >
              {name}
            </button>
          ))}
        </div>
        <span>{current.file}</span>
      </div>
      <pre>
        <code>{current.code}</code>
      </pre>
    </div>
  );
}
