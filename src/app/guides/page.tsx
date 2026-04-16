import type { Metadata } from 'next';
import Link from 'next/link';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'Guides for UK Freelancers',
  description: 'In-depth guides on tax, business structure, and financial planning for UK freelancers.',
};

interface Guide {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
}

const GUIDES: Guide[] = [
  {
    slug: 'sole-trader-vs-limited-company',
    title: 'Sole Trader vs Limited Company: The Complete 2026 Comparison',
    description: 'Everything you need to know about choosing between sole trader and limited company — tax, liability, admin, costs, and when to switch.',
    readTime: '15 min',
    category: 'Business Structure',
  },
  {
    slug: 'what-expenses-can-freelancers-claim',
    title: 'What Expenses Can Freelancers Claim? The Complete UK List',
    description: 'Every allowable business expense for UK freelancers — office, travel, home office, software, professional services, and what you definitely can\'t claim.',
    readTime: '12 min',
    category: 'Tax & Expenses',
  },
  {
    slug: 'ir35-explained',
    title: 'IR35 Explained: What Every UK Contractor Needs to Know',
    description: 'Plain-English guide to IR35 — the tests, off-payroll rules, CEST tool, and how to protect yourself from a surprise HMRC tax bill.',
    readTime: '14 min',
    category: 'Tax & Compliance',
  },
];

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">Guides</h1>
      <p className="mt-2 text-gray-500">
        In-depth articles on tax, business structure, and financial planning for UK freelancers.
        Updated for the {TAX_YEAR} tax year.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES.map((guide) => (
          <Link key={guide.slug} href={`/guides/${guide.slug}`}>
            <div className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-brand-300 hover:shadow-md">
              <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                {guide.category}
              </span>
              <h2 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-brand-600">
                {guide.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{guide.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">{guide.readTime} read</span>
                <span className="text-sm font-medium text-brand-600">Read guide →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
