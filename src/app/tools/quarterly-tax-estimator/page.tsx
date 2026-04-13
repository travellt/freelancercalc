import type { Metadata } from 'next';
import QuarterlyTaxEstimator from '@/components/tools/QuarterlyTaxEstimator';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'Quarterly Tax Estimator — How Much Tax to Set Aside',
  description: `Estimate your quarterly tax payments as a UK sole trader. See your full payment schedule, payments on account, and how much to save each month. ${TAX_YEAR} rates.`,
  keywords: [
    'quarterly tax calculator UK',
    'self assessment tax estimator',
    'payments on account calculator',
    'how much tax to set aside freelancer',
    'sole trader tax calculator quarterly',
    'self employed tax bill estimator',
  ],
};

export default function QuarterlyTaxEstimatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <WebAppSchema name="Quarterly Tax Estimator" description="Estimate your self-assessment tax bill and see when payments are due." url="https://freelancercalc.co.uk/tools/quarterly-tax-estimator" />
      <FAQSchema faqs={[
        { question: 'How do payments on account work for self-assessment?', answer: 'Payments on account are advance payments toward your next tax bill, each equal to 50% of your previous year\'s tax. The first is due 31 January during the tax year, and the second 31 July after it ends. A balancing payment covers any remaining tax due on 31 January the following year.' },
        { question: 'When is the self-assessment tax deadline?', answer: 'For the 2026/27 tax year: the tax return must be filed online by 31 January 2028. The balancing payment (and first payment on account for the following year) is also due on 31 January 2028. Paper returns have an earlier deadline of 31 October 2027.' },
        { question: 'How much should I save for tax each month as a freelancer?', answer: 'A common rule of thumb is 25-30% of profit, but the exact amount depends on your income level and tax band. Use this calculator to get a precise monthly figure based on your expected profit.' },
      ]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quarterly Tax Estimator</h1>
        <p className="mt-3 text-lg text-gray-600">
          Never be caught short by a tax bill. See exactly how much you owe, when it&apos;s due, and how
          much to set aside each month — including payments on account.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Tax year {TAX_YEAR} &middot; Updated with current HMRC rates
        </p>
      </div>

      <QuarterlyTaxEstimator />

      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">Understanding self-assessment payments</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <h3 className="pt-2 text-base font-semibold text-gray-900">The January 31st double hit</h3>
          <p>
            January 31st is the most expensive day of the year for many freelancers. On this date
            you pay both the balancing payment for the previous tax year AND the first payment on
            account for the current year. If your income has been growing, this can be a
            significant amount.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Can you reduce payments on account?</h3>
          <p>
            If you expect your income to be significantly lower than last year, you can apply to
            HMRC to reduce your payments on account. Be careful though — if you reduce them too
            much and your actual bill is higher, you&apos;ll pay interest on the shortfall.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Setting money aside</h3>
          <p>
            The best approach is to transfer a fixed percentage of every invoice into a separate
            tax savings account the day you receive payment. A high-interest easy-access account
            means you earn interest on the money before it&apos;s due. Automatic standing orders
            on invoice day make this effortless.
          </p>

          <p className="pt-4 text-xs text-gray-400">
            This tool provides estimates based on current HMRC rates. Your actual tax bill may
            differ based on reliefs, allowances, and other factors. Always check with a qualified
            accountant.
          </p>
        </div>
      </section>
    </div>
  );
}
