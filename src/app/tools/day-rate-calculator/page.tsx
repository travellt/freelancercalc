import type { Metadata } from 'next';
import DayRateCalculator from '@/components/tools/DayRateCalculator';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'Day Rate Calculator — What Should You Charge as a Freelancer?',
  description: `Calculate the freelancer day rate you need to match a permanent salary. Accounts for holidays, sick days, pension, tax, NICs, insurance, and gaps between contracts. ${TAX_YEAR} rates.`,
  keywords: [
    'freelancer day rate calculator',
    'contractor day rate calculator UK',
    'day rate to salary calculator',
    'what day rate should I charge',
    'freelancer rate calculator UK',
    'contractor rate comparison permanent salary',
  ],
};

export default function DayRateCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <WebAppSchema name="Day Rate Calculator" description="Calculate the freelancer day rate you need to match a permanent salary, or see what a day rate is worth after tax." url="https://freelancercalc.co.uk/tools/day-rate-calculator" />
      <FAQSchema faqs={[
        { question: 'What day rate should I charge as a freelancer in the UK?', answer: 'To match a £50,000 permanent salary, you typically need a day rate of £300-350/day as a sole trader, accounting for holidays, sick days, pension, tax, NICs, and gaps between contracts. The exact rate depends on your billable days, business costs, and business structure.' },
        { question: 'How many billable days does a freelancer work per year?', answer: 'A typical UK freelancer works around 195-220 billable days per year, from a total of 260 weekdays minus 33 days holiday (25 + 8 bank holidays), 5 sick days, training days, admin time, and 2-6 weeks of gaps between contracts.' },
        { question: 'How do I convert a day rate to an annual salary equivalent?', answer: 'Multiply your day rate by your billable days (typically 200-220), then subtract business costs, tax, NICs, pension contributions, and insurance. The result is your take-home pay, which you can compare to a permanent salary after deducting employee tax and NICs from that salary.' },
      ]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Day Rate Calculator</h1>
        <p className="mt-3 text-lg text-gray-600">
          What day rate do you need to charge to match a permanent salary? Or what&apos;s a given day rate
          actually worth after tax, holidays, pension, and business costs?
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Tax year {TAX_YEAR} &middot; Updated with current HMRC rates
        </p>
      </div>

      <DayRateCalculator />

      {/* SEO content */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">
          How to calculate your freelancer day rate
        </h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <p>
            Setting your day rate is one of the most important decisions as a UK freelancer.
            Charge too little and you&apos;ll earn less than a permanent employee doing the same
            work. Charge too much and you won&apos;t win contracts.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Why freelancers need to charge more than you think</h3>
          <p>
            A common mistake is dividing a target salary by 260 working days. This ignores that
            permanent employees receive paid holidays (28 days minimum), sick pay, employer pension
            contributions, and continuity of income. As a freelancer you get none of these —
            every non-billable day is a day without income.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">The real costs of freelancing</h3>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Holidays:</strong> 25 days + 8 bank holidays = 33 unpaid days</li>
            <li><strong>Sick days:</strong> Budget for 3-5 days per year</li>
            <li><strong>Contract gaps:</strong> Most freelancers have 2-6 weeks between contracts</li>
            <li><strong>Pension:</strong> No employer contributions — you fund it yourself</li>
            <li><strong>Insurance:</strong> Professional indemnity is typically £300-800/year</li>
            <li><strong>Accountant:</strong> £800-2,000/year depending on structure</li>
            <li><strong>Equipment:</strong> Laptop, software, phone — you buy your own</li>
          </ul>

          <h3 className="pt-2 text-base font-semibold text-gray-900">A typical example</h3>
          <p>
            To match a £50,000 permanent salary as a sole trader, you typically need a day rate of
            around £300-350/day. That might sound like £78,000+ per year, but once you subtract
            holidays, gaps, tax, NICs, pension, and business costs, you end up with roughly the same
            take-home as your permanently employed counterpart.
          </p>

          <p className="pt-4 text-xs text-gray-400">
            This calculator provides estimates based on current HMRC rates. Individual circumstances vary —
            always consult a qualified accountant for personalised advice.
          </p>
        </div>
      </section>
    </div>
  );
}
