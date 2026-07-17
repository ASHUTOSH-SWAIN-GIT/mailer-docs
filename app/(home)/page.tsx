import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-fd-background">
      <section className="relative flex min-h-screen items-center overflow-hidden border-b px-6 py-24">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-fd-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-fd-border)_1px,transparent_1px)] bg-[size:44px_44px] opacity-35" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-fd-primary/15 to-transparent" />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1fr_440px] lg:items-center">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-medium uppercase tracking-widest text-fd-muted-foreground">
              Stream processing for Go
            </p>
            <h1 className="text-5xl font-semibold tracking-tight text-fd-foreground md:text-7xl">
              Mailer
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-fd-muted-foreground">
              Build streaming pipelines with the Go SDK or declarative YAML.
              Run local generator examples, compile workflows through the CLI,
              and move to Kafka, Postgres, checkpointing, and exactly-once
              delivery when the pipeline is ready.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/docs"
                className="inline-flex h-11 items-center rounded-md bg-fd-primary px-5 text-sm font-medium text-fd-primary-foreground transition hover:opacity-90"
              >
                Read the docs
              </Link>
              <Link
                href="/docs/sdk/overview"
                className="inline-flex h-11 items-center rounded-md border px-5 text-sm font-medium transition hover:bg-fd-accent"
              >
                Explore the SDK
              </Link>
            </div>
          </div>
          <div className="rounded-lg border bg-fd-card p-5 shadow-sm">
            <div className="mb-4 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <pre className="overflow-x-auto text-sm leading-7 text-fd-muted-foreground">
              <code>{`pipeline:
  - id: completed
    type: filter
    filter:
      field: status
      operator: equals
      value: completed
  - id: by-customer
    type: keyBy
    keyBy:
      field: customer.id
  - id: totals
    type: reduce
    reduce:
      function: sum
      field: amount`}</code>
            </pre>
          </div>
        </div>
      </section>
    </main>
  );
}
