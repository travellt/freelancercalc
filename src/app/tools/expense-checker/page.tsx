import type { Metadata } from 'next';
import ExpenseChecker from '@/components/tools/ExpenseChecker';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Business Expense Checker — Can I Claim This?',
  description:
    'Find out which business expenses you can claim as a UK freelancer. Search 20+ expense categories with HMRC-compliant guidance for sole traders and limited companies.',
  keywords: [
    'freelancer expenses UK',
    'can I claim this expense',
    'self employed expenses list',
    'allowable business expenses UK',
    'sole trader expenses guide',
    'limited company expenses',
    'HMRC allowable expenses',
  ],
};

export default function ExpenseCheckerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <WebAppSchema name="Business Expense Checker" description="Find out which expenses you can claim as a UK freelancer. Searchable guide for sole traders and limited companies." url="https://freelancercalc.co.uk/tools/expense-checker" />
      <FAQSchema faqs={[
        { question: 'What expenses can a freelancer claim in the UK?', answer: 'UK freelancers can claim expenses incurred "wholly and exclusively" for business purposes. Common allowable expenses include: office supplies, computer equipment, software subscriptions, business travel, professional insurance, accountant fees, marketing costs, and a proportion of home office costs.' },
        { question: 'Can I claim for working from home as a freelancer?', answer: 'Yes. Sole traders can claim £6/week (£312/year) flat rate with no receipts, or calculate the actual business proportion of household costs (heating, electricity, broadband, council tax). Limited company directors can be reimbursed £6/week tax-free by their company.' },
        { question: 'Can freelancers claim food and meals?', answer: 'Only subsistence meals during business travel away from your normal workplace are allowable. Regular lunch at your desk, coffee while working, and client entertaining are NOT tax-deductible.' },
        { question: 'Can I claim clothing as a business expense?', answer: 'Everyday clothing is not allowable even if you only wear it for work. Only specialist protective clothing (safety boots, hard hats, hi-vis) or uniforms with a permanent company logo are claimable.' },
      ]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Expense Checker</h1>
        <p className="mt-3 text-lg text-gray-600">
          Can you claim that expense? Search or browse 20+ categories of common freelancer expenses
          with clear guidance on what HMRC allows — for both sole traders and limited companies.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Based on current HMRC guidance &middot; Updated for 2025/26
        </p>
      </div>

      <ExpenseChecker />
    </div>
  );
}
