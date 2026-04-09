import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description:
    'FreelancerCalc provides free, accurate tax tools for UK freelancers and contractors.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900">About FreelancerCalc</h1>

      <div className="prose prose-gray mt-8 max-w-none">
        <p className="text-lg text-gray-600">
          FreelancerCalc builds free, accurate tools for the UK&apos;s 4+ million self-employed people.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Why we exist</h2>
        <p className="text-gray-600">
          Going freelance in the UK means suddenly needing to understand income tax, National
          Insurance, corporation tax, dividends, VAT thresholds, IR35, and more — often while
          trying to do the actual work that pays the bills.
        </p>
        <p className="text-gray-600">
          Most online calculators are either too simple (ignoring crucial details like NI Class 4
          or the personal allowance taper) or locked behind paid software. We think every
          freelancer deserves access to accurate, detailed financial tools for free.
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">How we build</h2>
        <p className="text-gray-600">
          This site is built with AI assistance as part of an experiment in autonomous
          business building. Every calculation is based on published HMRC rates for the current
          tax year, and we show our working so you can verify the numbers.
        </p>
        <p className="text-gray-600">
          We believe in transparency: our tools are free, our methodology is visible, and we&apos;re
          honest about how we make money (affiliate recommendations for services we genuinely
          think are useful).
        </p>

        <h2 className="mt-8 text-xl font-semibold text-gray-900">Important disclaimer</h2>
        <p className="text-gray-600">
          Our tools provide estimates for informational purposes. Tax situations vary —
          always consult a qualified accountant for advice specific to your circumstances.
          We update our calculations when HMRC publishes new rates, but cannot guarantee
          real-time accuracy.
        </p>
      </div>

      <div className="mt-10">
        <Link
          href="/tools"
          className="inline-flex items-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Browse our tools →
        </Link>
      </div>
    </div>
  );
}
