import type { Metadata } from 'next';
import MortgageCalculator from '@/components/tools/MortgageCalculator';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Mortgage Calculator for Self-Employed — How Much Can You Borrow?',
  description:
    'Find out how much you can borrow as a self-employed person. See borrowing capacity, monthly payments, stress test results, and tips specific to freelancers and contractors.',
  keywords: [
    'self employed mortgage calculator',
    'freelancer mortgage affordability',
    'how much can I borrow self employed',
    'contractor mortgage calculator UK',
    'sole trader mortgage calculator',
    'limited company director mortgage',
  ],
};

export default function MortgageCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <WebAppSchema name="Mortgage Calculator for Self-Employed" description="Find out how much you can borrow as a freelancer or contractor." url="https://freelancercalc.co.uk/tools/mortgage-affordability-calculator" />
      <FAQSchema faqs={[
        { question: 'Can I get a mortgage if I\'m self-employed?', answer: 'Yes. Most high street lenders accept self-employed applicants with at least 2 years of trading history and filed accounts. You will need SA302 tax calculations, tax year overviews, and possibly certified accounts. A specialist mortgage broker experienced with self-employed clients can significantly improve your options.' },
        { question: 'How do lenders calculate income for self-employed mortgages?', answer: 'For sole traders, lenders typically average the last 2-3 years of net profit from SA302 forms. For limited company directors, most use salary plus dividends drawn, though some specialist lenders will use company net profit or retained earnings. Income that fluctuates year-to-year can be averaged.' },
        { question: 'How much deposit do I need as a self-employed borrower?', answer: 'While 5-10% deposits are possible, self-employed borrowers generally get better rates and more lender options with 15-20%+ deposit. A larger deposit reduces the lender\'s risk and can offset concerns about income variability.' },
      ]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mortgage Calculator for Self-Employed</h1>
        <p className="mt-3 text-lg text-gray-600">
          Getting a mortgage as a freelancer or contractor is harder than it should be. See how much
          you could borrow, whether you&apos;d pass the stress test, and get specific tips for
          self-employed applicants.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Illustrative rates &middot; Not a mortgage offer
        </p>
      </div>

      <MortgageCalculator />

      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">Getting a mortgage when you&apos;re self-employed</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <h3 className="pt-2 text-base font-semibold text-gray-900">What lenders want to see</h3>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>SA302 tax calculations</strong> — for the last 2-3 years (download from your HMRC online account)</li>
            <li><strong>Tax year overviews</strong> — confirming your tax position with HMRC</li>
            <li><strong>Certified accounts</strong> — prepared by a qualified accountant (for ltd companies)</li>
            <li><strong>Bank statements</strong> — typically 3-6 months of business and personal accounts</li>
            <li><strong>Proof of upcoming work</strong> — contracts, client pipeline (some lenders ask for this)</li>
          </ul>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Common reasons for rejection</h3>
          <p>
            The most frequent reasons self-employed applicants are declined: insufficient trading
            history (under 2 years), income that dropped significantly year-on-year, high loan-to-value
            with variable income, and applying to the wrong lender. A broker who specialises in
            self-employed mortgages can steer you to lenders most likely to accept your profile.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">The tax efficiency trap</h3>
          <p>
            Here&apos;s the catch-22 of being self-employed: the more tax-efficient you are (claiming
            expenses, keeping profits in the company), the lower your declared income — and the less
            you can borrow. If you&apos;re planning to apply for a mortgage in the next 1-2 years, discuss
            the trade-off between tax efficiency and borrowing power with your accountant.
          </p>

          <p className="pt-4 text-xs text-gray-400">
            This calculator uses illustrative rates and income multipliers. Actual mortgage offers depend on
            the lender&apos;s criteria, your credit score, and current market conditions. Always speak to a
            qualified mortgage advisor for personalised advice.
          </p>
        </div>
      </section>
    </div>
  );
}
