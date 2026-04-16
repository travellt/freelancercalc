import type { Metadata } from 'next';
import InvoiceGenerator from '@/components/tools/InvoiceGenerator';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'Free UK Invoice Generator — PDF Download, No Signup',
  description:
    'Create UK-compliant invoices in seconds. Free, instant PDF download. Sole trader, limited company, or VAT-registered. Your details are saved locally — never uploaded.',
  keywords: [
    'invoice generator UK',
    'free invoice template UK',
    'freelancer invoice generator',
    'UK invoice PDF',
    'VAT invoice template',
    'sole trader invoice',
    'limited company invoice',
    'self employed invoice template',
  ],
};

export default function InvoiceGeneratorPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <WebAppSchema
        name="UK Invoice Generator"
        description="Create UK-compliant invoices with instant PDF download. Free, no signup, works in browser."
        url="https://freelancercalc.co.uk/tools/invoice-generator"
      />
      <FAQSchema faqs={[
        {
          question: 'What needs to be on a UK invoice?',
          answer: 'By law, a UK invoice must contain: a unique sequential invoice number, the issue date, your business name and address, the customer\'s name and address, a description of the goods or services, and the total amount. VAT-registered businesses must also show their VAT number, the VAT rate, and the VAT amount.',
        },
        {
          question: 'Do sole traders need to issue invoices?',
          answer: 'Yes. Sole traders must issue invoices for business-to-business transactions and for any transaction requested by the customer. The invoice must include all standard information: invoice number, date, your name and address, the client\'s details, and a description of the work.',
        },
        {
          question: 'How long do I have to keep invoices in the UK?',
          answer: 'HMRC requires you to keep invoices (both issued and received) for at least 5 years after the 31 January submission deadline of the relevant tax year. For VAT-registered businesses, invoices must be kept for 6 years.',
        },
        {
          question: 'Can I charge interest on late invoice payments?',
          answer: 'Yes. Under the Late Payment of Commercial Debts (Interest) Act 1998, you can charge statutory interest at 8% above the Bank of England base rate on overdue B2B invoices, plus a fixed compensation fee (£40 for debts under £1,000, £70 for £1,000-£10,000, £100 for over £10,000).',
        },
        {
          question: 'Is my invoice data uploaded anywhere?',
          answer: 'No. This invoice generator runs entirely in your browser. Your business details are saved in your browser\'s local storage so you don\'t need to re-enter them. PDF generation happens locally on your device. Nothing is sent to our servers unless you click "Email me a copy".',
        },
      ]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">UK Invoice Generator</h1>
        <p className="mt-3 text-lg text-gray-600">
          Create professional, legally-compliant UK invoices in seconds. Free PDF download.
          No signup. Your business details are saved in your browser for next time.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Tax year {TAX_YEAR} &middot; Works for sole traders, limited companies, and VAT-registered businesses
        </p>
      </div>

      <InvoiceGenerator />

      {/* SEO content */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">
          How to Create a Proper UK Invoice
        </h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <p>
            A UK invoice isn&apos;t just a request for payment — it&apos;s a legal document
            that needs specific information. Getting it wrong can cause disputes, delay payment,
            and create problems at tax time. This guide covers exactly what your invoice must
            contain and the rules that apply.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">What every UK invoice must include</h3>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Unique invoice number</strong> — sequential, never repeated</li>
            <li><strong>Issue date</strong> — the date the invoice is created</li>
            <li><strong>Supplier details</strong> — your name and address</li>
            <li><strong>Customer details</strong> — client name and address</li>
            <li><strong>Description</strong> — clear description of the goods or services</li>
            <li><strong>Amount</strong> — the total due</li>
          </ul>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Extra requirements for limited companies</h3>
          <p>
            Limited companies must also include their <strong>company registration number</strong> and
            <strong> registered office address</strong>. These should appear on all business
            correspondence, including invoices. Failure to do so is a breach of the Companies Act 2006.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Extra requirements for VAT-registered businesses</h3>
          <p>
            If you&apos;re registered for VAT, your invoice becomes a VAT invoice and must include
            additional details:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li>Your VAT registration number</li>
            <li>The VAT rate applied (usually 20% standard rate)</li>
            <li>The VAT amount in pounds sterling</li>
            <li>The subtotal before VAT, plus the total including VAT</li>
            <li>Time of supply (tax point) if different from the invoice date</li>
          </ul>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Payment terms and late payment</h3>
          <p>
            Your invoice should state when payment is due. The UK default is 30 days unless otherwise
            agreed. If a client pays late on a business-to-business invoice, you have the right to
            charge statutory interest at 8% above the Bank of England base rate, plus a fixed
            compensation fee — this is set out in the Late Payment of Commercial Debts (Interest)
            Act 1998.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">How long to keep invoices</h3>
          <p>
            HMRC requires you to keep copies of all invoices you issue and receive for at least
            5 years after the 31 January tax return submission deadline. VAT-registered businesses
            must keep invoices for 6 years. Digital copies are fine — you don&apos;t need to keep
            paper originals.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Privacy: your data stays on your device</h3>
          <p>
            Unlike most online invoice tools, this generator runs entirely in your browser. Your
            business details are saved in your browser&apos;s local storage — not on our servers —
            so you don&apos;t need to re-enter them next time. The PDF is generated locally on your
            device. Nothing is uploaded unless you explicitly click &ldquo;email me a copy&rdquo;.
          </p>
        </div>
      </section>
    </div>
  );
}
