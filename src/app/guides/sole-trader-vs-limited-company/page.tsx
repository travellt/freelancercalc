import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQSchema } from '@/components/seo/StructuredData';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'Sole Trader vs Limited Company: The Complete 2026 Comparison',
  description:
    'Should you be a sole trader or set up a limited company? A comprehensive guide covering tax differences, NICs, liability, admin, costs, and when to switch. Updated for 2025/26.',
  keywords: [
    'sole trader vs limited company',
    'sole trader or limited company',
    'should I set up a limited company',
    'sole trader vs ltd company tax',
    'when to become a limited company',
    'sole trader vs limited company 2026',
    'freelancer sole trader or limited company',
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

function ComparisonTable({ rows }: { rows: { label: string; soleTrader: string; ltdCompany: string }[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="py-3 pr-4 font-semibold text-gray-900"></th>
            <th className="py-3 pr-4 font-semibold text-gray-900">Sole Trader</th>
            <th className="py-3 font-semibold text-gray-900">Limited Company</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.label}>
              <td className="py-3 pr-4 font-medium text-gray-900">{row.label}</td>
              <td className="py-3 pr-4 text-gray-600">{row.soleTrader}</td>
              <td className="py-3 text-gray-600">{row.ltdCompany}</td>
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
  const labels = { tip: 'Tip', warning: 'Important', info: 'Note' };
  return (
    <div className={`my-4 rounded-lg border p-4 text-sm ${styles[type]}`}>
      <p className="font-semibold">{labels[type]}</p>
      <div className="mt-1">{children}</div>
    </div>
  );
}

export default function SoleTraderVsLtdGuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <FAQSchema faqs={[
        { question: 'What is the difference between a sole trader and a limited company?', answer: 'A sole trader is a self-employed individual who is personally liable for all business debts. A limited company is a separate legal entity that provides limited liability protection. The key practical differences are in tax treatment, administrative requirements, and personal liability.' },
        { question: 'At what income should I switch from sole trader to limited company?', answer: 'The crossover point is typically around £30,000-40,000 in annual profit. Below this, the administrative costs of a limited company (accountant fees of £1,000-2,000/year, Companies House filings) outweigh the tax savings. Above £40,000+, the tax savings from the salary/dividend extraction strategy usually make a limited company worthwhile.' },
        { question: 'How much tax does a sole trader pay compared to a limited company?', answer: 'Sole traders pay income tax (20-45%) and Class 4 NICs (6%/2%) on profits. Limited company directors pay corporation tax (19-25%) on company profits, then dividend tax (8.75-39.35%) on extractions. At £50,000 profit, the difference is typically £500-1,500/year in favour of a limited company.' },
        { question: 'Can I switch from sole trader to limited company?', answer: 'Yes, you can incorporate at any time. You register a company at Companies House (£12 online), transfer your business, and notify HMRC. Most accountants charge £200-500 to handle the transition. You can continue trading without interruption.' },
        { question: 'What are the disadvantages of a limited company?', answer: 'Higher accountant fees (£1,000-2,000/year vs £200-500), more admin (annual accounts, confirmation statements, payroll, dividend paperwork), public filing of accounts at Companies House, and less flexibility in extracting money. IR35 rules can also negate tax advantages for some contractors.' },
      ]} />

      {/* Article header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-brand-600">Guide</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Sole Trader vs Limited Company: The Complete 2026 Comparison
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          The most important decision for any UK freelancer: should you operate as a sole trader or
          set up a limited company? This guide covers everything — tax, liability, admin, costs, and
          when to make the switch.
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
          <span>Tax year {TAX_YEAR}</span>
          <span>·</span>
          <span>15 min read</span>
          <span>·</span>
          <span>Last updated April 2026</span>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl border border-brand-200 bg-brand-50 p-5">
        <p className="text-sm font-medium text-brand-800">
          Want the numbers for your situation?
        </p>
        <p className="mt-1 text-sm text-brand-700">
          Use our free calculator to see exactly how much you&apos;d take home under each structure.
        </p>
        <Link
          href="/tools/take-home-pay-calculator"
          className="mt-3 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          Calculate your take-home pay →
        </Link>
      </div>

      {/* Table of contents */}
      <nav className="mt-8 rounded-lg bg-gray-50 p-5">
        <p className="text-sm font-semibold text-gray-900">In this guide</p>
        <ol className="mt-3 space-y-1.5 text-sm text-brand-600">
          {[
            { id: 'quick-comparison', label: 'Quick comparison table' },
            { id: 'tax-differences', label: 'Tax differences explained' },
            { id: 'national-insurance', label: 'National Insurance' },
            { id: 'liability', label: 'Personal liability' },
            { id: 'admin', label: 'Admin and compliance' },
            { id: 'costs', label: 'Running costs' },
            { id: 'when-to-switch', label: 'When to switch to a limited company' },
            { id: 'ir35', label: 'IR35 considerations' },
            { id: 'how-to-incorporate', label: 'How to set up a limited company' },
            { id: 'summary', label: 'Summary: which is right for you?' },
          ].map((item, i) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="hover:text-brand-800">{i + 1}. {item.label}</a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Article content */}
      <article className="prose-custom">
        <Section id="quick-comparison" title="1. Quick comparison table">
          <p>Here&apos;s the headline comparison. We&apos;ll dig into each point below.</p>
          <ComparisonTable rows={[
            { label: 'Tax on profits', soleTrader: 'Income tax (20-45%)', ltdCompany: 'Corporation tax (19-25%) + dividend tax (8.75-39.35%)' },
            { label: 'National Insurance', soleTrader: 'Class 2 (£3.45/week) + Class 4 (6%/2%)', ltdCompany: 'Employer NI (13.8%) + Employee NI (only if salary above threshold)' },
            { label: 'Personal liability', soleTrader: 'Unlimited — you\'re personally liable', ltdCompany: 'Limited to your investment in the company' },
            { label: 'Setup cost', soleTrader: 'Free — just register with HMRC', ltdCompany: '£12 online at Companies House' },
            { label: 'Annual accounts', soleTrader: 'Self-assessment tax return', ltdCompany: 'Company accounts + Corporation Tax return + personal self-assessment' },
            { label: 'Accountant fees', soleTrader: '£200-500/year', ltdCompany: '£1,000-2,000/year' },
            { label: 'Public information', soleTrader: 'None', ltdCompany: 'Directors, registered address, and accounts on public record' },
            { label: 'Profit extraction', soleTrader: 'All profit is yours automatically', ltdCompany: 'Via salary, dividends, pension, or expenses' },
            { label: 'Best for', soleTrader: 'Under ~£35k profit, simple businesses', ltdCompany: 'Over ~£35k profit, higher-risk work, multiple clients' },
          ]} />
        </Section>

        <Section id="tax-differences" title="2. Tax differences explained">
          <h3 className="pt-2 text-base font-semibold text-gray-900">Sole trader taxation</h3>
          <p>
            As a sole trader, your business profit is taxed as personal income. After deducting
            allowable expenses, you pay income tax on everything above the £12,570 personal
            allowance:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Basic rate (20%):</strong> £12,571 – £50,270</li>
            <li><strong>Higher rate (40%):</strong> £50,271 – £125,140</li>
            <li><strong>Additional rate (45%):</strong> Over £125,140</li>
          </ul>
          <p>
            Scottish taxpayers have six bands from 19% to 48% — generally paying slightly more at
            most income levels.
          </p>

          <h3 className="pt-4 text-base font-semibold text-gray-900">Limited company taxation</h3>
          <p>
            A limited company is a separate legal entity. The company pays corporation tax on its
            profits, then you personally pay tax when you extract money:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Corporation tax:</strong> 19% on profits up to £50,000, rising to 25% above £250,000</li>
            <li><strong>Director salary:</strong> Taxed as employment income (income tax + NICs)</li>
            <li><strong>Dividends:</strong> 8.75% (basic), 33.75% (higher), 39.35% (additional) — after a £500 tax-free allowance</li>
          </ul>

          <CalloutBox type="tip">
            <p>
              The most common strategy: pay yourself a salary of £12,570 (using the personal allowance
              with no income tax) and extract remaining profits as dividends. This minimises the
              combined tax burden. Use our{' '}
              <Link href="/tools/dividend-salary-optimiser" className="font-medium underline">
                Dividend vs Salary Optimiser
              </Link>{' '}
              to find your optimal split.
            </p>
          </CalloutBox>

          <h3 className="pt-4 text-base font-semibold text-gray-900">Example: £60,000 profit</h3>
          <p>Let&apos;s compare the tax on £60,000 profit (after expenses) under each structure:</p>
          <ComparisonTable rows={[
            { label: 'Profit', soleTrader: '£60,000', ltdCompany: '£60,000' },
            { label: 'Income/corp tax', soleTrader: '£11,432', ltdCompany: '£7,775 (corp tax + div tax)' },
            { label: 'NICs', soleTrader: '£3,986', ltdCompany: '£1,045 (employer NI on salary)' },
            { label: 'Total tax', soleTrader: '~£15,418', ltdCompany: '~£8,820' },
            { label: 'Take-home', soleTrader: '~£44,582', ltdCompany: '~£51,180' },
            { label: 'Annual saving', soleTrader: '—', ltdCompany: '~£6,598/year' },
          ]} />

          <CalloutBox type="info">
            <p>
              These are illustrative figures. Your actual numbers depend on expenses, pension
              contributions, other income, and whether you&apos;re in Scotland. Use our{' '}
              <Link href="/tools/take-home-pay-calculator" className="font-medium underline">
                Take-Home Pay Calculator
              </Link>{' '}
              for your exact figures.
            </p>
          </CalloutBox>
        </Section>

        <Section id="national-insurance" title="3. National Insurance">
          <h3 className="pt-2 text-base font-semibold text-gray-900">Sole trader NICs</h3>
          <p>Sole traders pay two types of National Insurance:</p>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Class 2:</strong> £3.45/week (£179/year) — flat rate, builds state pension entitlement</li>
            <li><strong>Class 4:</strong> 6% on profits between £12,570–£50,270, then 2% above that</li>
          </ul>
          <p>
            On £50,000 profit, that&apos;s roughly £2,125 in NICs. It&apos;s not huge, but combined with
            income tax it adds up.
          </p>

          <h3 className="pt-4 text-base font-semibold text-gray-900">Limited company NICs</h3>
          <p>
            As a director paying yourself a salary of £12,570, you pay:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Employee NICs:</strong> £0 (salary is at the threshold)</li>
            <li><strong>Employer NICs:</strong> 13.8% on salary above £5,000 = ~£1,045/year</li>
          </ul>
          <p>
            Crucially, <strong>dividends don&apos;t attract any National Insurance</strong>. This is the
            primary reason limited companies are more tax-efficient at higher income levels — you
            avoid the 6% Class 4 NICs on the dividend portion entirely.
          </p>

          <CalloutBox type="warning">
            <p>
              Single-director companies are <strong>not eligible</strong> for the Employment Allowance
              (£10,500 NI relief) since April 2023. You only get this if you have other employees.
            </p>
          </CalloutBox>
        </Section>

        <Section id="liability" title="4. Personal liability">
          <h3 className="pt-2 text-base font-semibold text-gray-900">Sole trader: unlimited liability</h3>
          <p>
            As a sole trader, there is no legal separation between you and your business. If your
            business incurs debts, gets sued, or faces a claim — your personal assets (savings,
            house, car) are at risk.
          </p>

          <h3 className="pt-4 text-base font-semibold text-gray-900">Limited company: limited liability</h3>
          <p>
            A limited company is a separate legal entity. Your personal liability is limited to
            your shareholding (typically £1). If the company fails, creditors can only claim
            against company assets, not your personal ones.
          </p>

          <CalloutBox type="warning">
            <p>
              Limited liability has exceptions. Directors can be held personally liable for
              fraudulent trading, wrongful trading (continuing when insolvency is inevitable),
              or personal guarantees given to banks or landlords.
            </p>
          </CalloutBox>

          <p>
            For freelancers doing professional work (consulting, development, design),
            professional indemnity insurance provides similar protection regardless of
            structure — typically £300-800/year. Use our{' '}
            <Link href="/tools/expense-checker" className="font-medium text-brand-600 underline">
              Expense Checker
            </Link>{' '}
            to see what insurance costs are allowable.
          </p>
        </Section>

        <Section id="admin" title="5. Admin and compliance">
          <h3 className="pt-2 text-base font-semibold text-gray-900">Sole trader admin</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>Register with HMRC as self-employed (free, online)</li>
            <li>File one self-assessment tax return per year (deadline: 31 January)</li>
            <li>Keep records of income and expenses for 5 years</li>
            <li>Register for VAT if turnover exceeds £90,000</li>
          </ul>
          <p>That&apos;s it. Many sole traders do their own tax return with software like GoSimpleTax.</p>

          <h3 className="pt-4 text-base font-semibold text-gray-900">Limited company admin</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>File annual accounts with Companies House (deadline: 9 months after year-end)</li>
            <li>File a Corporation Tax return with HMRC (deadline: 12 months after year-end)</li>
            <li>File a confirmation statement with Companies House annually (£13)</li>
            <li>Run payroll for director salary (monthly RTI submissions to HMRC)</li>
            <li>Issue dividend vouchers each time you take dividends</li>
            <li>File your personal self-assessment (still required for dividends)</li>
            <li>Maintain statutory registers (directors, shareholders, PSC)</li>
            <li>Keep company records for 6 years</li>
          </ul>
          <p>
            Most limited company directors hire an accountant for £80-170/month. Doing it yourself
            is possible but time-consuming and risks errors.
          </p>
        </Section>

        <Section id="costs" title="6. Running costs">
          <ComparisonTable rows={[
            { label: 'Formation', soleTrader: 'Free', ltdCompany: '£12 (Companies House)' },
            { label: 'Accountant', soleTrader: '£200-500/year', ltdCompany: '£1,000-2,000/year' },
            { label: 'Companies House', soleTrader: 'N/A', ltdCompany: '£13/year (confirmation statement)' },
            { label: 'Payroll software', soleTrader: 'N/A', ltdCompany: '£0-20/month (often included in accountant fee)' },
            { label: 'Bank account', soleTrader: '£0-10/month', ltdCompany: '£0-10/month' },
            { label: 'Time spent on admin', soleTrader: '~2 hours/month', ltdCompany: '~5 hours/month (or delegate to accountant)' },
          ]} />

          <CalloutBox type="tip">
            <p>
              The accountant fee difference (£800-1,500/year) is the real cost of running a limited
              company. If your tax saving is less than this, a limited company isn&apos;t worth it purely
              on financial grounds.
            </p>
          </CalloutBox>
        </Section>

        <Section id="when-to-switch" title="7. When to switch to a limited company">
          <p>
            There&apos;s no single answer, but here are the guidelines most accountants use:
          </p>

          <h3 className="pt-4 text-base font-semibold text-gray-900">Stay as a sole trader if:</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>Your annual profit is consistently <strong>under £30,000-35,000</strong></li>
            <li>You value simplicity and minimal admin</li>
            <li>Your business is low-risk (unlikely to be sued)</li>
            <li>You&apos;re just starting out and want to test the waters</li>
            <li>You expect your income to vary significantly year to year</li>
          </ul>

          <h3 className="pt-4 text-base font-semibold text-gray-900">Consider a limited company if:</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>Your annual profit is consistently <strong>above £35,000-40,000</strong></li>
            <li>You want to keep profits in the business for future investment</li>
            <li>Your clients require or prefer to work with limited companies</li>
            <li>You want limited liability protection</li>
            <li>You want to make tax-efficient employer pension contributions</li>
            <li>You&apos;re a contractor and need a limited company for compliance</li>
          </ul>

          <CalloutBox type="info">
            <p>
              The crossover point depends on your expenses, pension plans, and whether you&apos;re in
              Scotland. At £40,000 profit, you might save £1,000-2,000/year with a limited company —
              but after accountant fees, the net saving could be only a few hundred pounds. At £60,000+
              profit, the saving is typically £3,000-5,000/year even after higher accountant fees.
            </p>
          </CalloutBox>
        </Section>

        <Section id="ir35" title="8. IR35 considerations">
          <p>
            If you&apos;re a contractor working through a limited company, IR35 is a critical factor.
            If HMRC determines that your working arrangement is really employment (you&apos;d be an
            employee if the intermediary company didn&apos;t exist), you&apos;re taxed as an employee — losing
            all the tax advantages of the limited company structure.
          </p>
          <p>
            Since April 2021, medium and large private sector clients are responsible for
            determining your IR35 status. If they determine you&apos;re inside IR35, they (or your
            agency) deduct tax and NICs before paying you.
          </p>

          <CalloutBox type="warning">
            <p>
              If all or most of your work is caught by IR35, a limited company offers no tax advantage
              over employment — and costs more to run. In this scenario, an umbrella company or
              remaining as a sole trader may be more practical.
            </p>
          </CalloutBox>

          <p>
            Use our{' '}
            <Link href="/tools/ir35-status-checker" className="font-medium text-brand-600 underline">
              IR35 Status Checker
            </Link>{' '}
            to assess your current arrangement and get actionable tips to strengthen your position.
          </p>
        </Section>

        <Section id="how-to-incorporate" title="9. How to set up a limited company">
          <p>Incorporating is straightforward:</p>
          <ol className="list-inside list-decimal space-y-2">
            <li><strong>Choose a company name</strong> — check availability at Companies House</li>
            <li><strong>Register online</strong> at Companies House (£12, usually approved within 24 hours)</li>
            <li><strong>Set up a business bank account</strong> — Tide, Starling, or a high street bank</li>
            <li><strong>Register for Corporation Tax</strong> with HMRC (within 3 months of starting to trade)</li>
            <li><strong>Set up payroll</strong> — register as an employer with HMRC for your director salary</li>
            <li><strong>Get accounting software</strong> — FreeAgent, Xero, or QuickBooks</li>
            <li><strong>Find an accountant</strong> — ideally one experienced with freelancers/contractors</li>
            <li><strong>Register for VAT</strong> if turnover exceeds £90,000 (or voluntarily if beneficial)</li>
          </ol>

          <CalloutBox type="tip">
            <p>
              You can incorporate at any time of year. Your company&apos;s financial year starts from
              the date of incorporation. Most accountants can handle the transition for £200-500
              and ensure nothing falls through the cracks with HMRC.
            </p>
          </CalloutBox>
        </Section>

        <Section id="summary" title="10. Summary: which is right for you?">
          <p>
            The decision comes down to three factors: <strong>profit level</strong>,{' '}
            <strong>risk tolerance</strong>, and <strong>admin tolerance</strong>.
          </p>
          <ul className="list-inside list-disc space-y-2">
            <li>
              <strong>Under £30,000 profit:</strong> Almost certainly stay as a sole trader. The
              admin and accountant costs of a limited company will eat any tax saving.
            </li>
            <li>
              <strong>£30,000-40,000 profit:</strong> The grey zone. Run the numbers with our
              calculator. If the saving after accountant fees is meaningful to you, and you don&apos;t
              mind the extra admin, consider incorporating.
            </li>
            <li>
              <strong>Over £40,000 profit:</strong> A limited company almost certainly saves you
              money. The question is only whether IR35 or your specific circumstances change the
              picture.
            </li>
          </ul>
        </Section>
      </article>

      {/* Bottom CTA */}
      <div className="mt-12 rounded-xl border border-brand-200 bg-brand-50 p-6 text-center">
        <h3 className="text-lg font-semibold text-brand-900">Calculate your exact take-home pay</h3>
        <p className="mt-2 text-sm text-brand-700">
          See the precise tax difference between sole trader and limited company for your income level.
        </p>
        <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link href="/tools/take-home-pay-calculator"
            className="inline-flex items-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700">
            Take-Home Pay Calculator →
          </Link>
          <Link href="/tools/dividend-salary-optimiser"
            className="inline-flex items-center rounded-lg border border-brand-300 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50">
            Dividend vs Salary Optimiser →
          </Link>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-8 text-xs text-gray-400">
        This guide is for informational purposes only and does not constitute tax or legal advice.
        Tax rules change regularly. Always consult a qualified accountant before making decisions
        about your business structure. Based on HMRC {TAX_YEAR} rates and thresholds.
      </p>
    </div>
  );
}
