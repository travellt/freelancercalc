import type { Metadata } from 'next';
import TakeHomeCalculator from '@/components/tools/TakeHomeCalculator';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'Take-Home Pay Calculator — Sole Trader vs Limited Company',
  description: `Compare your take-home pay as a sole trader vs limited company for the ${TAX_YEAR} tax year. See exactly what you keep after income tax, NICs, corporation tax, and dividends.`,
  keywords: [
    'sole trader vs limited company calculator',
    'take home pay calculator UK',
    'freelancer tax calculator',
    'contractor tax comparison',
    'limited company vs sole trader',
    'self employed tax calculator UK',
  ],
};

export default function TakeHomePayCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <WebAppSchema
        name="Take-Home Pay Calculator — Sole Trader vs Limited Company"
        description="Compare your take-home pay as a sole trader vs limited company. Full tax breakdown for the current UK tax year."
        url="https://freelancercalc.co.uk/tools/take-home-pay-calculator"
      />
      <FAQSchema faqs={[
        { question: 'Is it better to be a sole trader or limited company?', answer: 'It depends on your profit level. Below roughly £35,000 profit, sole trader is simpler and often better. Above £35,000-40,000, a limited company typically saves tax through the combination of corporation tax and dividend extraction, though accountant fees (£1,000-2,000/year) reduce the saving.' },
        { question: 'How much tax does a sole trader pay in the UK?', answer: 'Sole traders pay income tax (20-45%) on profits above the £12,570 personal allowance, plus Class 4 National Insurance (6% on profits between £12,570-£50,270, then 2% above) and Class 2 NICs (£3.65/week). The effective tax rate on £50,000 profit is approximately 19%.' },
        { question: 'What salary should a limited company director pay themselves?', answer: 'Most single-director companies pay a salary of £12,570 (the personal allowance threshold) to use the full tax-free allowance without triggering income tax, then extract remaining profits as dividends. Some pay less to reduce employer NICs.' },
        { question: 'Does a Scottish taxpayer pay more tax as a freelancer?', answer: 'Scottish income tax has six bands (19% to 48%) compared to three for the rest of the UK (20% to 45%). At most income levels, Scottish taxpayers pay slightly more income tax, though National Insurance rates are the same across the UK.' },
      ]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Take-Home Pay Calculator</h1>
        <p className="mt-3 text-lg text-gray-600">
          Should you operate as a sole trader or set up a limited company? Enter your expected
          revenue and expenses to see exactly how much you&apos;ll take home under each structure —
          with a full tax breakdown.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Tax year {TAX_YEAR} &middot; Updated with current HMRC rates
        </p>
      </div>

      <TakeHomeCalculator />

      {/* SEO content */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Sole Trader vs Limited Company: Which is better?
        </h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <p>
            One of the most common questions for UK freelancers is whether to operate as a sole
            trader or incorporate as a limited company. The answer depends primarily on your income
            level, but there are other factors to consider.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">When sole trader makes sense</h3>
          <p>
            If your taxable profits are below around £30,000-35,000, the administrative overhead of
            a limited company (annual accounts, Corporation Tax returns, Companies House filings)
            usually outweighs the tax savings. Sole trader is simpler: you just file a
            Self Assessment tax return each year.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">When a limited company saves money</h3>
          <p>
            With the 2026/27 dividend tax increases (basic rate now 10.75%), the crossover
            point has shifted upward. Below £50,000 profit, the tax saving from a limited company
            is minimal and often wiped out by higher accountant fees. Above £60,000-80,000, a
            limited company typically saves several thousand pounds per year.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Other factors to consider</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>Limited companies offer personal liability protection</li>
            <li>Some clients (especially in contracting) require you to have a limited company</li>
            <li>Accounting fees are higher for limited companies (typically £100-200/month vs £20-50)</li>
            <li>IR35 rules may mean you&apos;re taxed as an employee regardless of structure</li>
            <li>Limited companies can retain profits in the business for future use</li>
          </ul>

          <p className="pt-4 text-xs text-gray-400">
            This information is for guidance only. Tax rules change regularly and individual
            circumstances vary. Always consult a qualified accountant before making decisions about
            your business structure.
          </p>
        </div>
      </section>
    </div>
  );
}
