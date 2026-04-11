import type { Metadata } from 'next';
import PensionCalculator from '@/components/tools/PensionCalculator';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Freelancer Pension Calculator — How Much Do You Need to Save?',
  description:
    'Calculate how much you need to save for retirement as a freelancer. See projected pot value, retirement income, and tax relief on contributions.',
  keywords: [
    'freelancer pension calculator',
    'self employed pension planning',
    'how much pension do I need',
    'contractor pension calculator UK',
    'SIPP calculator freelancer',
    'pension contribution calculator',
  ],
};

export default function PensionCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <WebAppSchema name="Freelancer Pension Calculator" description="Calculate how much to save for retirement when there's no employer pension contribution." url="https://freelancercalc.co.uk/tools/freelancer-pension-calculator" />
      <FAQSchema faqs={[
        { question: 'How much should a freelancer save for a pension?', answer: 'A common guideline is to save half your age as a percentage of income. So if you start at 30, save 15% of your profits. The exact amount depends on your target retirement income, existing savings, and when you want to retire. Use this calculator to find your specific number.' },
        { question: 'Do freelancers get tax relief on pension contributions?', answer: 'Yes. Personal pension contributions receive tax relief at your marginal rate. At basic rate (20%), every £80 you put in becomes £100 in your pension. Higher rate taxpayers can claim an extra 20% via self-assessment. Limited company directors can make employer contributions which are NI-free and corporation-tax deductible.' },
        { question: 'What is the 4% rule for retirement?', answer: 'The 4% rule suggests you can withdraw 4% of your pension pot each year in retirement without running out of money over a 30-year period. So a £500,000 pot could provide £20,000/year. This assumes a diversified investment portfolio and is a guideline, not a guarantee.' },
      ]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Freelancer Pension Calculator</h1>
        <p className="mt-3 text-lg text-gray-600">
          No employer pension? No problem — but you need to plan. See how much to save each month
          to hit your retirement target, and how much tax relief you&apos;ll get on contributions.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Projections based on compound growth &middot; Adjusted for inflation
        </p>
      </div>

      <PensionCalculator />

      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">Pension planning for freelancers</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <h3 className="pt-2 text-base font-semibold text-gray-900">Why freelancers need to take pensions seriously</h3>
          <p>
            Employed workers get auto-enrolled into a workplace pension with employer contributions
            of at least 3%. Freelancers get none of this — every penny of retirement savings comes
            from you. The longer you wait, the more you need to save to catch up.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Best pension options for freelancers</h3>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>SIPP (Self-Invested Personal Pension):</strong> Most flexible option. Choose your own investments. Low-cost providers include Vanguard, AJ Bell, and PensionBee.</li>
            <li><strong>Stakeholder pension:</strong> Simpler, with capped charges. Good if you want a hands-off approach.</li>
            <li><strong>Ltd company employer contributions:</strong> If you run a limited company, employer pension contributions are NI-free and corporation-tax deductible — the most tax-efficient extraction method.</li>
          </ul>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Don&apos;t forget the state pension</h3>
          <p>
            The full new state pension is currently about £11,500/year. You need 35 qualifying years
            of NI contributions to get the full amount. As a sole trader paying Class 2 NICs, or a
            director paying yourself a salary above the lower earnings limit, you build up qualifying
            years automatically.
          </p>

          <p className="pt-4 text-xs text-gray-400">
            Pension values are projections based on assumed growth rates and are not guaranteed.
            Investment values can go down as well as up. Always seek independent financial advice
            for pension decisions.
          </p>
        </div>
      </section>
    </div>
  );
}
