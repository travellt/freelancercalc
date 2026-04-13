import type { Metadata } from 'next';
import VatChecker from '@/components/tools/VatChecker';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'VAT Registration Checker — Do You Need to Register?',
  description: `Check if you need to register for VAT. Track your turnover against the £90,000 threshold, model the impact of registration, and compare Standard vs Flat Rate Scheme. ${TAX_YEAR} rates.`,
  keywords: [
    'VAT registration checker UK',
    'do I need to register for VAT',
    'VAT threshold 2025',
    'VAT flat rate scheme calculator',
    'freelancer VAT registration',
    'self employed VAT threshold',
    'voluntary VAT registration calculator',
  ],
};

export default function VatCheckerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <WebAppSchema name="VAT Registration Checker" description="Check if you need to register for VAT, compare Standard vs Flat Rate Scheme, and model the impact on your pricing." url="https://freelancercalc.co.uk/tools/vat-registration-checker" />
      <FAQSchema faqs={[
        { question: 'What is the VAT threshold in the UK for 2026/27?', answer: 'The VAT registration threshold is £90,000 for the 2026/27 tax year. This was increased from £85,000 in April 2024. You must register if your rolling 12-month taxable turnover exceeds this threshold.' },
        { question: 'Should I register for VAT voluntarily?', answer: 'Voluntary registration can benefit freelancers who mostly work with VAT-registered businesses (B2B), since those clients reclaim the VAT. You can also reclaim VAT on your own expenses. However, if you work mainly with consumers (B2C), registration effectively increases your prices by 20%.' },
        { question: 'What is the VAT Flat Rate Scheme?', answer: 'The Flat Rate Scheme lets you pay a fixed percentage of your gross turnover to HMRC instead of tracking VAT on every expense. The percentage varies by trade (e.g., 14.5% for IT consultancy). It is simpler but not always cheaper than the standard scheme.' },
      ]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">VAT Registration Checker</h1>
        <p className="mt-3 text-lg text-gray-600">
          Are you approaching the VAT threshold? See how close you are to mandatory registration,
          what it would cost you, and whether the Flat Rate Scheme could save you money.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Tax year {TAX_YEAR} &middot; Threshold: £90,000 (from April 2025)
        </p>
      </div>

      <VatChecker />

      {/* SEO content */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">VAT for freelancers: what you need to know</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <h3 className="pt-2 text-base font-semibold text-gray-900">When must you register?</h3>
          <p>
            You must register for VAT if your taxable turnover in the last 12 months exceeds
            £90,000, or if you expect it to exceed £90,000 in the next 30 days alone.
            The threshold increased from £85,000 in April 2025.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Should you register voluntarily?</h3>
          <p>
            Some freelancers register even below the threshold. This makes sense if most of your
            clients are VAT-registered businesses (they reclaim the VAT, so it costs them nothing)
            and you have significant VAT-able expenses to reclaim. It also signals to clients that
            your business is established.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Standard vs Flat Rate Scheme</h3>
          <p>
            The standard scheme means charging 20% VAT on invoices, reclaiming VAT on expenses,
            and paying the difference to HMRC quarterly. The Flat Rate Scheme simplifies this —
            you pay a fixed percentage of your gross turnover and don&apos;t reclaim VAT on expenses.
            It&apos;s simpler but whether it&apos;s cheaper depends on your trade category and expense level.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Key deadlines</h3>
          <ul className="list-inside list-disc space-y-1">
            <li>You must notify HMRC within 30 days of the end of the month you exceeded the threshold</li>
            <li>VAT returns are due quarterly, with payment due 1 month and 7 days after the period end</li>
            <li>Making Tax Digital (MTD) requires digital VAT records and online filing</li>
          </ul>

          <p className="pt-4 text-xs text-gray-400">
            This tool provides estimates for guidance only. VAT rules have specific nuances
            around the date of supply, cash vs accrual accounting, and exempt supplies.
            Always consult a qualified accountant for VAT advice.
          </p>
        </div>
      </section>
    </div>
  );
}
