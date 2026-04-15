import type { Metadata } from 'next';
import WfhCalculator from '@/components/tools/WfhCalculator';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'Working From Home Allowance Calculator — Claim Your Tax Relief',
  description: `Calculate your working from home tax relief for ${TAX_YEAR}. Compare HMRC simplified rates vs actual costs. For sole traders, limited company directors, and employees.`,
  keywords: [
    'working from home allowance',
    'WFH tax relief UK',
    'HMRC working from home',
    'home office expenses UK',
    'self employed working from home',
    'simplified expenses working from home',
    'working from home tax deduction',
  ],
};

export default function WfhAllowancePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <WebAppSchema
        name="Working From Home Allowance Calculator"
        description="Calculate your working from home tax relief. Compare HMRC simplified rates vs actual costs method."
        url="https://freelancercalc.co.uk/tools/working-from-home-allowance"
      />
      <FAQSchema faqs={[
        {
          question: 'How much can I claim for working from home as a sole trader?',
          answer: 'HMRC offers simplified expenses: £10/month (25-50 hours), £18/month (51-100 hours), or £26/month (101+ hours). Alternatively, claim a proportion of actual household costs based on rooms used for work. The actual cost method often gives a higher claim but requires keeping records of household bills.',
        },
        {
          question: 'Can employees claim working from home tax relief?',
          answer: 'Yes. Employees can claim £6/week (£312/year) flat rate tax relief for working from home. Apply via HMRC online — you\'ll get a tax code adjustment that reduces your PAYE tax automatically. You don\'t need your employer\'s permission.',
        },
        {
          question: 'What household costs can I claim when working from home?',
          answer: 'You can claim a proportion of: mortgage interest or rent, council tax, electricity, gas, water, and home insurance. Broadband can be claimed separately based on business use. You cannot claim for food or clothing.',
        },
        {
          question: 'Will claiming working from home expenses affect capital gains tax on my house?',
          answer: 'If a room is used exclusively for business, it could affect your principal private residence CGT exemption when you sell. Most advisors recommend sharing the room (e.g., a desk in a spare bedroom) rather than having a dedicated office to avoid this.',
        },
      ]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Working From Home Allowance Calculator</h1>
        <p className="mt-3 text-lg text-gray-600">
          Calculate how much you can claim for working from home. Compare HMRC&apos;s simplified
          flat rate with the actual costs method to see which saves you more.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Tax year {TAX_YEAR} &middot; Updated with current HMRC rates
        </p>
      </div>

      <WfhCalculator />

      {/* SEO content */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Working From Home Tax Relief: A Complete Guide
        </h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <p>
            If you work from home — whether as a sole trader, limited company director, or
            employee — you can claim tax relief on a proportion of your household costs. Many
            freelancers miss out on hundreds of pounds per year simply because they don&apos;t
            realise they&apos;re eligible.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Method 1: Simplified expenses (recommended for most)</h3>
          <p>
            HMRC&apos;s simplified expenses method lets you claim a flat monthly rate based on the
            number of hours you work from home. No need to calculate actual costs or keep utility
            bills — just track your working hours.
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>25-50 hours/month: £10/month</li>
            <li>51-100 hours/month: £18/month</li>
            <li>101+ hours/month: £26/month</li>
          </ul>
          <p>
            For a freelancer working full-time from home (35+ hours/week), that&apos;s £312/year —
            a tax saving of £62 (basic rate) to £125 (higher rate).
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Method 2: Actual costs</h3>
          <p>
            If your household costs are high or you use a significant portion of your home for work,
            the actual costs method may give you a larger claim. You calculate the business proportion
            of your household bills based on the number of rooms used for work.
          </p>
          <p>
            For example, if you use 1 room out of 5 for business, you can claim 20% of eligible
            household costs. With typical UK household bills, this often works out to £3,000-4,000/year
            in claims — significantly more than the simplified method.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">For employees</h3>
          <p>
            Employees who work from home can claim £6/week (£312/year) flat rate tax relief via HMRC&apos;s
            online portal. You&apos;ll receive a tax code adjustment and the saving comes through your
            PAYE automatically. You don&apos;t need to keep receipts or calculate actual costs.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Which method should you choose?</h3>
          <p>
            Use the calculator above to compare both methods with your actual numbers. In general,
            the simplified method is better for people with lower household costs or who only work from
            home part-time. The actual costs method is better if your mortgage/rent is high or you
            dedicate a large proportion of your home to work.
          </p>
        </div>
      </section>
    </div>
  );
}
