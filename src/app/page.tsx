import Link from 'next/link';
import { TOOLS, CATEGORY_LABELS, type Tool } from '@/lib/tools';
import { TAX_YEAR } from '@/lib/tax';

function ToolCard({ tool }: { tool: Tool }) {
  const inner = (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-md">
      <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
        {CATEGORY_LABELS[tool.category]}
      </span>
      <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-brand-600">
        {tool.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{tool.description}</p>
      {!tool.available && (
        <span className="mt-3 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
          Coming soon
        </span>
      )}
    </div>
  );

  if (tool.available) {
    return <Link href={`/tools/${tool.slug}`}>{inner}</Link>;
  }
  return inner;
}

export default function HomePage() {
  const available = TOOLS.filter((t) => t.available);
  const coming = TOOLS.filter((t) => !t.available).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-brand-600">
              Tax year {TAX_YEAR} — updated for current HMRC rates
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Free tools for
              <br />
              <span className="text-brand-600">UK freelancers</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              Accurate tax calculators, business tools, and financial planning — built specifically
              for sole traders, contractors, and limited company directors.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/tools/take-home-pay-calculator"
                className="inline-flex items-center rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                Calculate your take-home pay →
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Browse all tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Available tools */}
      {available.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">Popular tools</h2>
          <p className="mt-2 text-gray-500">No signup required. Instant results.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Coming soon */}
      {coming.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <h2 className="text-2xl font-bold text-gray-900">Coming soon</h2>
          <p className="mt-2 text-gray-500">New tools added every week.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coming.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {/* Trust / accuracy bar */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-brand-600">{TAX_YEAR}</p>
              <p className="mt-1 text-sm text-gray-500">Current HMRC rates</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-600">100%</p>
              <p className="mt-1 text-sm text-gray-500">Free, no signup</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-brand-600">4M+</p>
              <p className="mt-1 text-sm text-gray-500">UK self-employed people</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
