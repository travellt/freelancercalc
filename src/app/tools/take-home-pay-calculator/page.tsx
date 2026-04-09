import type { Metadata } from 'next';
import TakeHomeCalculator from '@/components/tools/TakeHomeCalculator';
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
            Above roughly £35,000-40,000 in profit, the combination of corporation tax (19-25%)
            plus dividend tax is typically less than income tax plus Class 4 NICs. The savings
            increase significantly above £50,000. At £80,000 profit, you could save several
            thousand pounds per year with a limited company.
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
