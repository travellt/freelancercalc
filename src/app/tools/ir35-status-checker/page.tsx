import type { Metadata } from 'next';
import IR35Checker from '@/components/tools/IR35Checker';

export const metadata: Metadata = {
  title: 'IR35 Status Checker — Are You Inside or Outside IR35?',
  description:
    'Assess your IR35 status with a clear, guided questionnaire based on the key tests HMRC uses. Find out if your contract is likely inside or outside IR35.',
  keywords: [
    'IR35 checker',
    'IR35 status tool',
    'am I inside IR35',
    'IR35 assessment',
    'contractor IR35 check',
    'off payroll working rules',
    'IR35 questionnaire',
  ],
};

export default function IR35CheckerPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">IR35 Status Checker</h1>
        <p className="mt-3 text-lg text-gray-600">
          Answer 12 questions about your working arrangement to get an indicative IR35 assessment.
          Based on the three key tests HMRC uses: control, substitution, and mutuality of obligation.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Indicative assessment only &middot; Not a substitute for professional advice
        </p>
      </div>

      <IR35Checker />

      {/* SEO content */}
      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">Understanding IR35</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <p>
            IR35 is tax legislation designed to combat &ldquo;disguised employment&rdquo; — where someone
            works like an employee but operates through a limited company or other intermediary
            to pay less tax. If your contract is caught by IR35, you&apos;re taxed as if you were an employee.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">The three key tests</h3>
          <p>
            Courts and HMRC look at three main factors when determining employment status:
          </p>
          <ul className="list-inside list-disc space-y-1">
            <li><strong>Control:</strong> Does the client control how, when, and where you work? More control = more likely inside IR35.</li>
            <li><strong>Substitution:</strong> Can you send someone else to do the work? A genuine right of substitution is a strong indicator of being outside IR35.</li>
            <li><strong>Mutuality of obligation:</strong> Is the client obliged to offer work, and are you obliged to accept it? Ongoing mutual obligations point towards employment.</li>
          </ul>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Off-payroll working rules (April 2021)</h3>
          <p>
            Since April 2021, medium and large private sector clients (and all public sector clients
            since 2017) are responsible for determining your IR35 status. They must provide a Status
            Determination Statement (SDS). Small private sector clients still leave the determination
            to the contractor.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">What happens if you&apos;re inside IR35?</h3>
          <p>
            If inside IR35, the fee-payer (usually your agency or client) deducts income tax and
            employee NICs from your payments. You lose the tax efficiency of taking dividends.
            The tax difference can be significant — often several thousand pounds per year.
          </p>

          <p className="pt-4 text-xs text-gray-400">
            This assessment is for guidance only. IR35 determinations depend on the full facts of
            your engagement and can only be definitively decided by a court or tribunal. Always
            seek professional advice if unsure.
          </p>
        </div>
      </section>
    </div>
  );
}
