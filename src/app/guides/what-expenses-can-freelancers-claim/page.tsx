import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQSchema } from '@/components/seo/StructuredData';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'What Expenses Can Freelancers Claim? The Complete UK List',
  description:
    `Every allowable business expense for UK freelancers and sole traders in ${TAX_YEAR}. HMRC rules, common mistakes, and how to claim properly.`,
  keywords: [
    'freelancer expenses UK',
    'self employed expenses list',
    'allowable business expenses HMRC',
    'what can I claim as a sole trader',
    'freelance tax deductions UK',
    'self employed what can I claim',
    'business expenses self employed',
    'HMRC allowable expenses',
  ],
};

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="mt-12 text-2xl font-bold text-gray-900">{title}</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600">
        {children}
      </div>
    </section>
  );
}

function ExpenseTable({ rows }: { rows: { expense: string; claimable: string; notes: string }[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="py-3 pr-4 font-semibold text-gray-900">Expense</th>
            <th className="py-3 pr-4 font-semibold text-gray-900">Claimable?</th>
            <th className="py-3 font-semibold text-gray-900">Notes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.expense}>
              <td className="py-3 pr-4 font-medium text-gray-900">{row.expense}</td>
              <td className="py-3 pr-4">
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                  row.claimable === 'Yes' ? 'bg-green-100 text-green-800' :
                  row.claimable === 'Partial' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>{row.claimable}</span>
              </td>
              <td className="py-3 text-gray-600">{row.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalloutBox({ type, children }: { type: 'tip' | 'warning' | 'info'; children: React.ReactNode }) {
  const styles = {
    tip: 'border-green-200 bg-green-50 text-green-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    info: 'border-blue-200 bg-blue-50 text-blue-800',
  };
  return (
    <div className={`my-4 rounded-lg border p-4 text-sm ${styles[type]}`}>
      {children}
    </div>
  );
}

export default function ExpensesGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <FAQSchema faqs={[
        {
          question: 'What expenses can a freelancer claim in the UK?',
          answer: 'UK freelancers can claim business expenses that are incurred "wholly and exclusively" for business purposes. Common claims include office supplies, software subscriptions, professional insurance, travel, accounting fees, marketing, training, and a proportion of home office costs.',
        },
        {
          question: 'Can freelancers claim for food and drink?',
          answer: 'Generally no. Your daily lunch is not a business expense, even if you eat at your desk. However, you can claim meals when travelling overnight for business, entertaining clients (limited company only, not tax-deductible for corporation tax), or subsistence during business travel significantly beyond your normal commute.',
        },
        {
          question: 'Can I claim clothing as a business expense?',
          answer: 'Only if it is a uniform, protective clothing, or costume required for your specific work. Everyday clothing (even if you only wear it for business meetings) is not claimable. A suit is not an allowable expense.',
        },
        {
          question: 'How long should I keep receipts for business expenses?',
          answer: 'HMRC requires you to keep records for at least 5 years after the 31 January submission deadline of the relevant tax year. For example, for the 2025/26 tax year (filed by 31 January 2027), keep records until at least 31 January 2032.',
        },
        {
          question: 'Do I need receipts for every business expense?',
          answer: 'Yes, ideally. HMRC expects you to have evidence for every expense claimed. Bank or credit card statements can support a claim but are not sufficient alone — you should also have the actual receipt or invoice showing what was purchased.',
        },
      ]} />

      {/* Table of contents */}
      <nav className="mb-8 rounded-lg bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-900">In this guide</p>
        <ul className="mt-2 columns-2 space-y-1 text-sm text-brand-600">
          <li><a href="#golden-rule" className="hover:underline">The golden rule</a></li>
          <li><a href="#office-equipment" className="hover:underline">Office &amp; equipment</a></li>
          <li><a href="#software-subscriptions" className="hover:underline">Software &amp; subscriptions</a></li>
          <li><a href="#travel" className="hover:underline">Travel expenses</a></li>
          <li><a href="#home-office" className="hover:underline">Working from home</a></li>
          <li><a href="#professional-services" className="hover:underline">Professional services</a></li>
          <li><a href="#marketing" className="hover:underline">Marketing &amp; advertising</a></li>
          <li><a href="#training" className="hover:underline">Training &amp; development</a></li>
          <li><a href="#cannot-claim" className="hover:underline">What you can&apos;t claim</a></li>
          <li><a href="#record-keeping" className="hover:underline">Record keeping</a></li>
        </ul>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        What Expenses Can Freelancers Claim? The Complete UK List
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Every pound of legitimate business expense reduces your tax bill. Yet most freelancers
        either miss claims they&apos;re entitled to or claim things they shouldn&apos;t. Here&apos;s
        the definitive guide to getting it right.
      </p>
      <p className="mt-2 text-sm text-gray-400">
        Updated for the {TAX_YEAR} tax year &middot; 12 min read
      </p>

      <CalloutBox type="info">
        <strong>Interactive version:</strong> Use our{' '}
        <Link href="/tools/expense-checker" className="underline">Business Expense Checker</Link>{' '}
        tool to instantly look up whether a specific expense is claimable.
      </CalloutBox>

      <Section id="golden-rule" title="The Golden Rule: &ldquo;Wholly and Exclusively&rdquo;">
        <p>
          HMRC&apos;s fundamental test for any business expense is whether it was incurred
          &ldquo;wholly and exclusively&rdquo; for business purposes. If an expense has any
          personal element, you generally can&apos;t claim the full amount — though you may be
          able to claim the business proportion.
        </p>
        <p>
          For example, your mobile phone bill might be 70% business calls. You can claim 70%.
          Your broadband is used for both Netflix and client work — claim the business proportion.
          But your gym membership, even if it &ldquo;helps you work better,&rdquo; is personal.
        </p>
        <CalloutBox type="tip">
          <strong>Rule of thumb:</strong> Ask yourself — would I have this expense if I didn&apos;t
          have a business? If yes, it&apos;s probably personal and not claimable. If the expense
          only exists because of your business, it&apos;s likely allowable.
        </CalloutBox>
      </Section>

      <Section id="office-equipment" title="Office &amp; Equipment">
        <ExpenseTable rows={[
          { expense: 'Computer / laptop', claimable: 'Yes', notes: 'Full cost if used solely for business. Claim business % if mixed use.' },
          { expense: 'Monitor, keyboard, mouse', claimable: 'Yes', notes: 'Peripherals for your work setup.' },
          { expense: 'Desk and office chair', claimable: 'Yes', notes: 'For your home office or co-working space.' },
          { expense: 'Printer and ink', claimable: 'Yes', notes: 'Business proportion if also used personally.' },
          { expense: 'Stationery', claimable: 'Yes', notes: 'Pens, paper, notebooks, envelopes, etc.' },
          { expense: 'Phone (handset)', claimable: 'Partial', notes: 'If used for both personal and business, claim the business proportion.' },
          { expense: 'Phone (contract/calls)', claimable: 'Partial', notes: 'Claim business call costs. If you have a dedicated business phone, claim 100%.' },
        ]} />
        <CalloutBox type="tip">
          <strong>Capital allowances:</strong> Equipment costing over £1,000 may need to be claimed
          via capital allowances rather than as a simple expense. However, the Annual Investment
          Allowance (AIA) of £1,000,000 means most freelancers can claim the full cost in the year
          of purchase.
        </CalloutBox>
      </Section>

      <Section id="software-subscriptions" title="Software &amp; Subscriptions">
        <ExpenseTable rows={[
          { expense: 'Accounting software', claimable: 'Yes', notes: 'FreeAgent, Xero, QuickBooks, etc. Fully claimable.' },
          { expense: 'Microsoft 365 / Google Workspace', claimable: 'Yes', notes: 'If used for business. Claim business proportion if mixed use.' },
          { expense: 'Adobe Creative Cloud', claimable: 'Yes', notes: 'If needed for your work (design, photography, video).' },
          { expense: 'Project management tools', claimable: 'Yes', notes: 'Trello, Asana, Monday, Notion, etc.' },
          { expense: 'Cloud hosting / domains', claimable: 'Yes', notes: 'AWS, Vercel, domain names for business sites.' },
          { expense: 'Professional memberships', claimable: 'Yes', notes: 'IPSE, ICB, CIMA, etc. Must be relevant to your trade.' },
          { expense: 'Stock photos / fonts', claimable: 'Yes', notes: 'If used for client or business work.' },
          { expense: 'Netflix / Spotify', claimable: 'No', notes: 'Personal entertainment, even if you listen while working.' },
        ]} />
      </Section>

      <Section id="travel" title="Travel Expenses">
        <p>
          Travel for business purposes is claimable, but commuting to a regular workplace is not.
          The key distinction: travel <em>between</em> business locations is claimable; travel
          <em> to</em> your usual place of work is commuting.
        </p>
        <ExpenseTable rows={[
          { expense: 'Travel to client sites', claimable: 'Yes', notes: 'Train, bus, taxi, or mileage. Must be a temporary workplace.' },
          { expense: 'Mileage (own car)', claimable: 'Yes', notes: '45p/mile first 10,000, then 25p. Or claim actual costs.' },
          { expense: 'Parking at client site', claimable: 'Yes', notes: 'Business parking only, not commuting.' },
          { expense: 'Hotels for business travel', claimable: 'Yes', notes: 'Reasonable cost for overnight stays required by business.' },
          { expense: 'Meals while travelling', claimable: 'Partial', notes: 'Only when travelling away from your normal base, not daily lunch.' },
          { expense: 'Congestion charge / tolls', claimable: 'Yes', notes: 'For business journeys only.' },
          { expense: 'Commuting to a co-working space', claimable: 'No', notes: 'If it\'s your regular workplace, it\'s commuting.' },
          { expense: 'Flights for business', claimable: 'Yes', notes: 'Economy class. Business class only if justified and reasonable.' },
        ]} />
        <CalloutBox type="info">
          <strong>Mileage calculator:</strong> Use our{' '}
          <Link href="/tools/mileage-allowance-calculator" className="underline">Mileage Allowance Calculator</Link>{' '}
          to work out your annual mileage claim and compare it with actual vehicle costs.
        </CalloutBox>
      </Section>

      <Section id="home-office" title="Working From Home Costs">
        <p>
          If you work from home (as most freelancers do at least some of the time), you can
          claim a proportion of your household costs. There are two methods:
        </p>
        <ExpenseTable rows={[
          { expense: 'Simplified flat rate', claimable: 'Yes', notes: '£10-26/month based on hours. No receipts needed.' },
          { expense: 'Proportion of rent/mortgage', claimable: 'Yes', notes: 'Actual costs method: rooms used ÷ total rooms.' },
          { expense: 'Proportion of utilities', claimable: 'Yes', notes: 'Electricity, gas, water — business proportion.' },
          { expense: 'Council tax (proportion)', claimable: 'Yes', notes: 'Actual costs method only.' },
          { expense: 'Broadband', claimable: 'Partial', notes: 'Business proportion. Can claim alongside either method.' },
          { expense: 'Home insurance (proportion)', claimable: 'Yes', notes: 'Actual costs method only.' },
        ]} />
        <CalloutBox type="info">
          <strong>Home office calculator:</strong> Use our{' '}
          <Link href="/tools/working-from-home-allowance" className="underline">Working From Home Allowance Calculator</Link>{' '}
          to compare the simplified and actual cost methods with your real numbers.
        </CalloutBox>
      </Section>

      <Section id="professional-services" title="Professional Services">
        <ExpenseTable rows={[
          { expense: 'Accountant fees', claimable: 'Yes', notes: 'Tax return preparation, bookkeeping, advisory. Your biggest legitimate expense.' },
          { expense: 'Legal fees (business)', claimable: 'Yes', notes: 'Contract review, IP registration, business disputes.' },
          { expense: 'Insurance', claimable: 'Yes', notes: 'Professional indemnity, public liability, business equipment cover.' },
          { expense: 'Bank charges', claimable: 'Yes', notes: 'Business account fees. Claim business proportion of personal account if mixed.' },
          { expense: 'Payment processing fees', claimable: 'Yes', notes: 'Stripe, PayPal, GoCardless transaction fees.' },
          { expense: 'Debt collection costs', claimable: 'Yes', notes: 'Costs of chasing unpaid invoices.' },
        ]} />
      </Section>

      <Section id="marketing" title="Marketing &amp; Advertising">
        <ExpenseTable rows={[
          { expense: 'Website hosting and domain', claimable: 'Yes', notes: 'Your business website costs.' },
          { expense: 'Google/Facebook ads', claimable: 'Yes', notes: 'Advertising spend for your business.' },
          { expense: 'Business cards', claimable: 'Yes', notes: 'Printing and design costs.' },
          { expense: 'Networking events', claimable: 'Yes', notes: 'Entry fees and related travel. Food/drink may be limited.' },
          { expense: 'Portfolio website tools', claimable: 'Yes', notes: 'Squarespace, Wix, etc. for business presence.' },
          { expense: 'Email marketing tools', claimable: 'Yes', notes: 'Mailchimp, ConvertKit, etc.' },
          { expense: 'Client entertainment', claimable: 'Partial', notes: 'Sole traders: not tax-deductible. Ltd companies: can claim but not deductible for corporation tax.' },
        ]} />
      </Section>

      <Section id="training" title="Training &amp; Development">
        <p>
          Training is claimable if it maintains or updates skills you already use in your business.
          Training to acquire new skills for a different trade is generally not claimable.
        </p>
        <ExpenseTable rows={[
          { expense: 'Courses in your field', claimable: 'Yes', notes: 'Must relate to your existing trade. A web developer doing a React course: yes.' },
          { expense: 'Professional books', claimable: 'Yes', notes: 'Technical books relevant to your work.' },
          { expense: 'Conference tickets', claimable: 'Yes', notes: 'Industry conferences, plus related travel and accommodation.' },
          { expense: 'Career change courses', claimable: 'No', notes: 'Training to enter a completely new profession is not an expense of your current trade.' },
          { expense: 'General interest courses', claimable: 'No', notes: 'Yoga teacher training when you\'re a developer: no.' },
        ]} />
        <CalloutBox type="warning">
          <strong>The tricky line:</strong> A developer learning Python when they already know
          JavaScript? Probably claimable — it&apos;s updating existing skills. A developer doing
          an MBA? Probably not claimable — it&apos;s acquiring new skills for a different purpose.
          When in doubt, ask your accountant.
        </CalloutBox>
      </Section>

      <Section id="cannot-claim" title="What You Definitely Can&apos;t Claim">
        <ExpenseTable rows={[
          { expense: 'Everyday clothing', claimable: 'No', notes: 'Even suits for client meetings. Only uniforms/protective clothing qualify.' },
          { expense: 'Daily commute', claimable: 'No', notes: 'Travel to your regular workplace is never claimable.' },
          { expense: 'Gym membership', claimable: 'No', notes: 'Personal health, even if it "helps you work better."' },
          { expense: 'Childcare', claimable: 'No', notes: 'Personal expense. Some schemes (vouchers) have separate tax relief.' },
          { expense: 'Fines and penalties', claimable: 'No', notes: 'Parking tickets, HMRC penalties, speeding fines.' },
          { expense: 'Daily lunch', claimable: 'No', notes: 'You\'d eat lunch regardless of having a business.' },
          { expense: 'Donations to charity', claimable: 'No', notes: 'Not a business expense. Claim via Gift Aid on your tax return instead.' },
          { expense: 'Personal phone/broadband (full)', claimable: 'No', notes: 'Only the business proportion is claimable.' },
        ]} />
      </Section>

      <Section id="record-keeping" title="Record Keeping: How to Stay HMRC-Ready">
        <p>
          HMRC can investigate your tax affairs going back up to 6 years (or 20 years in cases of
          fraud). Good record keeping isn&apos;t just about claiming correctly — it&apos;s your
          defence if you&apos;re ever investigated.
        </p>
        <p><strong>Keep records for at least 5 years</strong> after the 31 January submission deadline.</p>
        <p><strong>What counts as a record:</strong></p>
        <ul className="list-inside list-disc space-y-1">
          <li>Receipts and invoices (digital photos are fine)</li>
          <li>Bank and credit card statements</li>
          <li>Mileage log with dates, destinations, and business purpose</li>
          <li>Working-from-home hours log (if using simplified expenses)</li>
          <li>Contracts and agreements</li>
        </ul>
        <CalloutBox type="tip">
          <strong>Go digital:</strong> Use your phone to photograph receipts on the day you get them.
          Apps like Dext (formerly Receipt Bank) or FreeAgent&apos;s mobile app can capture and
          categorise automatically. Paper receipts fade — digital copies don&apos;t.
        </CalloutBox>
      </Section>

      <Section id="next-steps" title="Next Steps">
        <p>
          Now you know what you can claim, make sure you&apos;re actually claiming everything. Many
          freelancers leave money on the table simply because they forget to track expenses or
          aren&apos;t sure what&apos;s allowable.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link href="/tools/expense-checker" className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-300 hover:shadow-sm">
            <p className="font-semibold text-gray-900">Expense Checker Tool</p>
            <p className="mt-1 text-sm text-gray-500">Look up any specific expense to check if it&apos;s claimable.</p>
          </Link>
          <Link href="/tools/take-home-pay-calculator" className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-300 hover:shadow-sm">
            <p className="font-semibold text-gray-900">Take-Home Pay Calculator</p>
            <p className="mt-1 text-sm text-gray-500">See how expenses affect your take-home pay under each structure.</p>
          </Link>
          <Link href="/tools/working-from-home-allowance" className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-300 hover:shadow-sm">
            <p className="font-semibold text-gray-900">WFH Allowance Calculator</p>
            <p className="mt-1 text-sm text-gray-500">Calculate your working from home claim with both methods.</p>
          </Link>
          <Link href="/tools/mileage-allowance-calculator" className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-300 hover:shadow-sm">
            <p className="font-semibold text-gray-900">Mileage Calculator</p>
            <p className="mt-1 text-sm text-gray-500">Work out your annual mileage claim.</p>
          </Link>
        </div>
      </Section>

      {/* Disclaimer */}
      <div className="mt-12 rounded-lg bg-gray-50 p-4 text-xs text-gray-400">
        <p>
          This guide is for informational purposes only and does not constitute tax advice.
          HMRC rules can be complex and are subject to change. Always consult a qualified
          accountant for advice specific to your situation. Last updated for the {TAX_YEAR} tax year.
        </p>
      </div>
    </div>
  );
}
