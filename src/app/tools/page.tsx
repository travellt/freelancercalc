import type { Metadata } from 'next';
import Link from 'next/link';
import { TOOLS, CATEGORY_LABELS, type Tool } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Free Tools for UK Freelancers',
  description:
    'Browse all free tax calculators and business tools for UK freelancers, contractors, and sole traders.',
};

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
      {tool.available ? (
        <span className="mt-4 inline-flex items-center text-sm font-medium text-brand-600">
          Use this tool →
        </span>
      ) : (
        <span className="mt-4 inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
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

export default function ToolsPage() {
  const available = TOOLS.filter((t) => t.available);
  const coming = TOOLS.filter((t) => !t.available);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">All Tools</h1>
      <p className="mt-2 text-gray-500">
        Free tax calculators and business tools for UK freelancers. No signup required.
      </p>

      {available.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-gray-900">Available now</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}

      {coming.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold text-gray-900">Coming soon</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {coming.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
