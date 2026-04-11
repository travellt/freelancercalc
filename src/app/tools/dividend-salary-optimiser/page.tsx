import type { Metadata } from 'next';
import DividendOptimiser from '@/components/tools/DividendOptimiser';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'Dividend vs Salary Optimiser — Best Split for Ltd Company Directors',
  description: `Find the optimal salary and dividend split for your limited company. Minimise tax across income tax, NICs, corporation tax, and dividend tax. ${TAX_YEAR} rates.`,
  keywords: [
    'dividend vs salary calculator',
    'optimal salary dividend split',
    'limited company director salary',
    'how much salary should director take',
    'dividend tax calculator UK',
    'salary sacrifice limited company',
  ],
};

export default function DividendOptimiserPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <WebAppSchema
        name="Dividend vs Salary Optimiser"
        description="Find the optimal salary/dividend split for limited company directors to minimise total tax."
        url="https://freelancercalc.co.uk/tools/dividend-salary-optimiser"
      />
      <FAQSchema faqs={[
        { question: 'What is the optimal salary for a limited company director in 2025/26?', answer: 'For most single-director companies, the optimal salary is £12,570 (the personal allowance). This uses the full tax-free allowance without triggering income tax, while employer NICs at 13.8% above £5,000 are relatively low. The remaining profit is extracted as dividends at lower tax rates (8.75% basic, 33.75% higher).' },
        { question: 'Is it better to take salary or dividends from my limited company?', answer: 'A mix is almost always optimal. A small salary uses your personal allowance and counts toward your state pension record. Dividends are taxed at lower rates than salary (8.75% vs 20% basic rate) and don\'t attract National Insurance. The optimal split depends on your total profit level.' },
        { question: 'Do I have to pay myself a salary from my limited company?', answer: 'No, you can take £0 salary and extract everything as dividends. However, paying at least a small salary (around £6,396-£12,570) qualifies you for state pension credits and uses your personal allowance. The tax cost of a small salary is usually minimal or zero.' },
      ]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dividend vs Salary Optimiser</h1>
        <p className="mt-3 text-lg text-gray-600">
          How much salary should you take from your limited company? This tool tests hundreds of
          salary levels and finds the split that minimises your total tax bill.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Tax year {TAX_YEAR} &middot; Updated with current HMRC rates
        </p>
      </div>

      <DividendOptimiser />

      {/* SEO content */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">Understanding the salary/dividend split</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <p>
            As a limited company director, you have flexibility in how you extract profits. The main
            options are salary (subject to income tax and NICs) and dividends (subject to corporation
            tax and dividend tax, but no NICs). The optimal mix depends on your profit level.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Why £12,570 is usually optimal</h3>
          <p>
            At £12,570, your salary exactly matches the personal allowance — meaning zero income tax
            on salary. Employer NICs apply above £5,000, but the cost (around £1,045/year) is offset
            by the tax-free allowance. Everything above £12,570 is better extracted as dividends
            because dividend tax rates (8.75% basic) are lower than the combined income tax + NICs
            on additional salary.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">When the optimal salary differs</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>If you have other income (e.g., part-time employment), your personal allowance may already be used — reducing the benefit of salary</li>
            <li>At very high profits (above £100,000), the personal allowance taper complicates things</li>
            <li>If you&apos;re on a student loan, salary vs dividend affects repayment calculations</li>
            <li>If you want to maximise state pension credits, you need salary above the NI lower earnings limit</li>
          </ul>

          <p className="pt-4 text-xs text-gray-400">
            Tax planning is individual. This tool provides a starting point — always discuss your
            specific situation with a qualified accountant before making changes to your salary/dividend strategy.
          </p>
        </div>
      </section>
    </div>
  );
}
