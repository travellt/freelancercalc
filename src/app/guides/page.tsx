import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Guides for UK Freelancers',
  description: 'In-depth guides on tax, business structure, and financial planning for UK freelancers.',
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">Guides</h1>
      <p className="mt-2 text-gray-500">
        In-depth articles on tax, business structure, and financial planning for UK freelancers.
      </p>

      <div className="mt-10 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-gray-500">Guides are coming soon. In the meantime, try our free tools.</p>
        <Link
          href="/tools"
          className="mt-4 inline-flex items-center text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          Browse tools →
        </Link>
      </div>
    </div>
  );
}
