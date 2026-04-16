import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQSchema } from '@/components/seo/StructuredData';
import { TAX_YEAR } from '@/lib/tax';

export const metadata: Metadata = {
  title: 'IR35 Explained: What Every UK Contractor Needs to Know',
  description:
    `A plain-English guide to IR35 for UK contractors and freelancers in ${TAX_YEAR}. Understand the tests, off-payroll rules, CEST tool, and how to protect yourself.`,
  keywords: [
    'IR35 explained',
    'IR35 for contractors',
    'IR35 UK',
    'off payroll working rules',
    'inside IR35',
    'outside IR35',
    'IR35 tests',
    'CEST tool',
    'IR35 contractor guide',
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

function FactorTable({ rows }: { rows: { factor: string; outside: string; inside: string }[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-left">
            <th className="py-3 pr-4 font-semibold text-gray-900">Factor</th>
            <th className="py-3 pr-4 font-semibold text-green-700">Points to OUTSIDE IR35</th>
            <th className="py-3 font-semibold text-red-700">Points to INSIDE IR35</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map((row) => (
            <tr key={row.factor}>
              <td className="py-3 pr-4 font-medium text-gray-900">{row.factor}</td>
              <td className="py-3 pr-4 text-gray-600">{row.outside}</td>
              <td className="py-3 text-gray-600">{row.inside}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function IR35GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <FAQSchema faqs={[
        {
          question: 'What is IR35 in simple terms?',
          answer: 'IR35 is UK tax legislation that targets "disguised employment" — contractors who work through a limited company but are effectively employees of their client. If your working arrangement looks like employment (set hours, line management, no right to substitute), HMRC treats you as employed for tax purposes, even though you invoice through your own company.',
        },
        {
          question: 'What\'s the difference between inside IR35 and outside IR35?',
          answer: 'Outside IR35: you\'re genuinely self-employed, pay corporation tax on profits and dividend tax on extraction — typically keep 75-80% of your invoice value. Inside IR35: your income is taxed like employment (income tax + both employee and sometimes employer NICs), typically keeping 55-65% of your invoice value.',
        },
        {
          question: 'Who decides IR35 status?',
          answer: 'Since April 2021, medium and large private-sector clients are responsible for determining your IR35 status for off-payroll working. Small clients (under £10.2m turnover) leave the determination to you. Public sector clients have been responsible since April 2017.',
        },
        {
          question: 'What are the three main IR35 tests?',
          answer: 'Control (does the client tell you how, when, and where to work?), Substitution (can you send someone else to do the work?), and Mutuality of Obligation (is the client obliged to offer work and are you obliged to accept it?). These tests come from employment case law and are the foundation of any IR35 assessment.',
        },
        {
          question: 'Should I get IR35 insurance?',
          answer: 'For outside-IR35 contractors, yes — it\'s worth it. Policies typically cost £200-500/year and cover legal defence costs and potential tax liabilities if HMRC investigates. Providers like Qdos and Markel offer specialist contractor policies.',
        },
      ]} />

      {/* Table of contents */}
      <nav className="mb-8 rounded-lg bg-gray-50 p-4">
        <p className="text-sm font-semibold text-gray-900">In this guide</p>
        <ul className="mt-2 columns-2 space-y-1 text-sm text-brand-600">
          <li><a href="#what-is-ir35" className="hover:underline">What is IR35?</a></li>
          <li><a href="#inside-vs-outside" className="hover:underline">Inside vs outside</a></li>
          <li><a href="#who-decides" className="hover:underline">Who decides your status</a></li>
          <li><a href="#three-tests" className="hover:underline">The three main tests</a></li>
          <li><a href="#other-factors" className="hover:underline">Other factors</a></li>
          <li><a href="#cest-tool" className="hover:underline">The CEST tool</a></li>
          <li><a href="#contract-vs-reality" className="hover:underline">Contract vs reality</a></li>
          <li><a href="#protect-yourself" className="hover:underline">How to protect yourself</a></li>
          <li><a href="#what-if-investigated" className="hover:underline">If you&apos;re investigated</a></li>
        </ul>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        IR35 Explained: What Every UK Contractor Needs to Know
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        IR35 is the UK tax rule that decides whether you&apos;re genuinely self-employed or
        &ldquo;disguised employment.&rdquo; Get it wrong and HMRC can claim years of back tax
        plus interest and penalties. Get it right and you keep significantly more of what
        you earn. Here&apos;s what you actually need to know.
      </p>
      <p className="mt-2 text-sm text-gray-400">
        Updated for the {TAX_YEAR} tax year &middot; 14 min read
      </p>

      <CalloutBox type="info">
        <strong>Check your status:</strong> Use our{' '}
        <Link href="/tools/ir35-status-checker" className="underline">IR35 Status Checker</Link>{' '}
        to assess your own position against the key tests — free, no signup, and gives you an
        indicative result with tips to strengthen your position.
      </CalloutBox>

      <Section id="what-is-ir35" title="What is IR35, really?">
        <p>
          IR35 — officially the &ldquo;Intermediaries Legislation&rdquo; — was introduced in
          2000 to target what HMRC called &ldquo;disguised employment.&rdquo; The concern:
          someone would leave a permanent job on Friday, set up a limited company over the
          weekend, and return on Monday to do exactly the same job for the same employer,
          but now saving thousands in tax by taking dividends instead of salary.
        </p>
        <p>
          IR35 says: if your working arrangement is effectively employment — same control,
          same hours, same ongoing commitment — you should be taxed like an employee,
          regardless of how the contract is structured.
        </p>
        <p>
          The legislation has been tightened repeatedly. Since April 2017 for public sector
          contracts, and April 2021 for medium and large private sector contracts, the
          <em> client</em> has been responsible for determining your status (not you). This
          shifted significant risk onto hirers and changed the contracting landscape.
        </p>
      </Section>

      <Section id="inside-vs-outside" title="Inside vs outside IR35: the money difference">
        <p>
          The difference between inside and outside IR35 is dramatic. Assume a contractor
          invoicing £100,000/year through their own limited company:
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li><strong>Outside IR35:</strong> Pay corporation tax on profits, extract as salary + dividends, keep approximately <strong>£75,000-80,000</strong> after tax.</li>
          <li><strong>Inside IR35:</strong> Income taxed like employment — employer NICs, employee NICs, and income tax. Keep approximately <strong>£55,000-65,000</strong>.</li>
        </ul>
        <p>
          That&apos;s a difference of £15,000-25,000 per year. And if HMRC retroactively
          decides you were inside IR35 for the last 6 years, you could owe that difference
          multiple times over, plus interest and penalties.
        </p>
        <CalloutBox type="info">
          <strong>See the numbers for yourself:</strong> Use our{' '}
          <Link href="/tools/take-home-pay-calculator" className="underline">Take-Home Pay Calculator</Link>{' '}
          to compare your take-home under different structures at your actual income level.
        </CalloutBox>
      </Section>

      <Section id="who-decides" title="Who decides your IR35 status?">
        <p>
          This is the most misunderstood part of IR35. It depends on your client:
        </p>
        <ul className="list-inside list-disc space-y-2">
          <li>
            <strong>Public sector clients:</strong> Since April 2017, the client determines
            your status. If they say inside, you&apos;re taxed via PAYE through the client
            (or their agency).
          </li>
          <li>
            <strong>Medium/large private sector clients</strong> (turnover &gt; £10.2m OR
            balance sheet &gt; £5.1m OR &gt;50 employees): Since April 2021, the client
            determines your status using a Status Determination Statement (SDS).
          </li>
          <li>
            <strong>Small private sector clients:</strong> You&apos;re still responsible for
            your own IR35 determination. This is increasingly rare for professional
            contracting work.
          </li>
        </ul>
        <p>
          When the client determines your status, they must issue you a written Status
          Determination Statement explaining why. If you disagree, you have the right to
          challenge it through the client&apos;s dispute process.
        </p>
      </Section>

      <Section id="three-tests" title="The three main IR35 tests">
        <p>
          IR35 status comes down to a picture built from many factors, but three tests
          dominate the assessment. These come from decades of employment status case law.
        </p>

        <h3 className="pt-2 text-base font-semibold text-gray-900">1. Control</h3>
        <p>
          Who decides <em>how</em>, <em>when</em>, and <em>where</em> the work is done?
          Employees are controlled by their employer. Genuine contractors have autonomy over
          how they deliver the agreed outcome.
        </p>
        <p>
          Strong outside-IR35 indicators: you set your own hours, choose your own tools and
          methods, work where you want, and are judged on deliverables rather than hours
          worked. Strong inside-IR35 indicators: you must attend at set hours, use client
          equipment, follow client procedures, and report to a line manager.
        </p>

        <h3 className="pt-2 text-base font-semibold text-gray-900">2. Substitution</h3>
        <p>
          If you can&apos;t make it, can you send someone else — at your cost, with your
          qualifications — to do the work in your place? A genuine contractor can. An
          employee cannot. This is the test courts weight most heavily.
        </p>
        <p>
          Your contract should contain an unfettered right of substitution — the client
          cannot unreasonably refuse a qualified substitute. In practice, most contracts
          include substitution clauses that have never been tested, which weakens the
          protection. You don&apos;t need to actually have sent a substitute — just a
          genuine, unfettered right to do so.
        </p>

        <h3 className="pt-2 text-base font-semibold text-gray-900">3. Mutuality of Obligation (MOO)</h3>
        <p>
          Is the client obliged to offer you work, and are you obliged to accept it? For an
          employee, yes — there&apos;s an ongoing obligation on both sides. For a contractor,
          no — you&apos;re engaged for a specific project or deliverable. Once it&apos;s
          done, the engagement ends.
        </p>
        <p>
          Rolling contracts with no fixed end date, guaranteed hours, or expectation of
          &ldquo;whatever work needs doing&rdquo; all point to mutuality of obligation.
        </p>

        <FactorTable rows={[
          { factor: 'Control', outside: 'You set hours, methods, location', inside: 'Client sets hours and methods, directs work' },
          { factor: 'Substitution', outside: 'Unfettered right to send a substitute', inside: 'Personal service required, no substitute allowed' },
          { factor: 'Mutuality', outside: 'Project-based, no ongoing obligation', inside: 'Rolling work, expected to accept what\'s offered' },
        ]} />
      </Section>

      <Section id="other-factors" title="Other factors that matter">
        <p>
          Beyond the three main tests, HMRC and the courts look at the whole picture. These
          additional factors can tip a borderline case:
        </p>
        <ul className="list-inside list-disc space-y-1">
          <li><strong>Financial risk:</strong> Do you bear genuine business risk (unpaid invoices, fixing errors at your own cost)? Employees don&apos;t.</li>
          <li><strong>Equipment:</strong> Do you provide your own laptop and tools, or use the client&apos;s?</li>
          <li><strong>Multiple clients:</strong> Working for several clients simultaneously strongly indicates outside IR35.</li>
          <li><strong>Integration:</strong> Are you &ldquo;part and parcel&rdquo; of the client&apos;s organisation — on the intranet, in team meetings, with a company email? Employee-like.</li>
          <li><strong>Benefits:</strong> Do you get holiday pay, sick pay, pension contributions, or training budget? All point to employment.</li>
          <li><strong>Business identity:</strong> Do you have your own website, business cards, professional indemnity insurance, and multiple clients? These support outside-IR35 status.</li>
        </ul>
      </Section>

      <Section id="cest-tool" title="HMRC&apos;s CEST tool: use it, but don&apos;t trust it">
        <p>
          HMRC&apos;s Check Employment Status for Tax (CEST) tool is the official online
          assessment. Clients often use CEST to produce their Status Determination Statement.
        </p>
        <p>
          CEST has well-documented flaws. It has no question on Mutuality of Obligation (which
          HMRC controversially argues is always present in contracts for services — a position
          not supported by case law). The tool has produced different results for contractors
          in materially identical situations. And HMRC themselves have lost multiple tribunal
          cases where they&apos;d previously accepted the contractor was outside IR35 via CEST.
        </p>
        <CalloutBox type="warning">
          <strong>Use CEST as a starting point, not gospel.</strong> If CEST says outside, good
          — HMRC has publicly committed to stand by outside determinations that were input
          honestly. If it says inside or borderline, get a specialist IR35 contract review
          (typically £200-400) before accepting the determination.
        </CalloutBox>
      </Section>

      <Section id="contract-vs-reality" title="The contract vs the working reality">
        <p>
          A crucial point many contractors miss: <strong>the contract doesn&apos;t determine
          your IR35 status. The actual working arrangement does.</strong>
        </p>
        <p>
          You can have a perfectly-drafted outside-IR35 contract with strong substitution
          clauses and clear project scope — but if in practice you&apos;re turning up at 9am,
          attending the daily standup, reporting to a manager, and doing whatever work comes
          in, HMRC will find you inside IR35 regardless of what the contract says. Courts
          look at the reality of the engagement.
        </p>
        <p>
          This is why many contractors get caught out: their contracts are fine, but their
          behaviour looks like employment. The advice is simple but hard to follow: act like
          a business, not an employee.
        </p>
      </Section>

      <Section id="protect-yourself" title="How to protect yourself">
        <p>Whether you&apos;re starting a new contract or already in one, these steps reduce your IR35 risk:</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>
            <strong>Get your contract reviewed</strong> — specialist reviewers (Qdos, Bauer &amp;
            Cottrell, Markel) charge £200-400 and identify clauses that weaken your position.
            Cheap insurance.
          </li>
          <li>
            <strong>Review your working reality</strong> — is your day-to-day actually
            different from the employees around you? If no, that&apos;s a red flag regardless of
            contract wording.
          </li>
          <li>
            <strong>Get IR35 insurance</strong> — Qdos TLC35, Markel&apos;s cover, or similar.
            £200-500/year to cover legal defence costs and potential tax liability if investigated.
          </li>
          <li>
            <strong>Keep evidence</strong> — save emails showing you refused additional work,
            set your own hours, used your own equipment, worked for other clients. Documented
            evidence is invaluable if HMRC investigate.
          </li>
          <li>
            <strong>Have multiple clients</strong> — where possible, maintain ongoing
            relationships with several clients. Single-client contracts are the highest risk.
          </li>
          <li>
            <strong>Run your business like a business</strong> — website, business cards,
            professional insurance, your own equipment, invoices issued from your company,
            separate business bank account. Not just a tax structure — a genuine business.
          </li>
        </ol>
      </Section>

      <Section id="what-if-investigated" title="What happens if HMRC investigate">
        <p>
          HMRC can open an IR35 enquiry going back 4 years (or 6 if they allege carelessness,
          or 20 if they allege deliberate behaviour). The process typically looks like:
        </p>
        <ol className="list-inside list-decimal space-y-1">
          <li>HMRC writes to your company requesting contract and working practice details</li>
          <li>You (with your accountant or IR35 specialist) respond with evidence</li>
          <li>HMRC issues an opinion on status</li>
          <li>If you disagree, the case may go to First-tier Tribunal</li>
          <li>From there, potentially to the Upper Tribunal or Court of Appeal</li>
        </ol>
        <p>
          The financial stakes are real. Recent high-profile cases: Gary Lineker fought HMRC
          over £4.9m (and won); Adrian Chiles won his £1.7m case; Lorraine Kelly won her £1.2m
          case. Many lower-profile contractors have lost and faced life-changing tax bills.
        </p>
        <p>
          This is why IR35 insurance matters — the policy covers your legal defence costs,
          which can easily run into tens of thousands of pounds even for a clearly defensible
          case.
        </p>
      </Section>

      <Section id="next-steps" title="Next steps">
        <p>
          IR35 is genuinely complex and the stakes are high. But for most contractors, the
          principles are straightforward: act like a business, document the reality of your
          working arrangement, get your contract professionally reviewed, and carry insurance.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link href="/tools/ir35-status-checker" className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-300 hover:shadow-sm">
            <p className="font-semibold text-gray-900">IR35 Status Checker</p>
            <p className="mt-1 text-sm text-gray-500">Assess your current position against the key tests. Free, no signup.</p>
          </Link>
          <Link href="/tools/take-home-pay-calculator" className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-300 hover:shadow-sm">
            <p className="font-semibold text-gray-900">Take-Home Pay Calculator</p>
            <p className="mt-1 text-sm text-gray-500">See the income difference between inside and outside IR35.</p>
          </Link>
          <Link href="/tools/day-rate-calculator" className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-300 hover:shadow-sm">
            <p className="font-semibold text-gray-900">Day Rate Calculator</p>
            <p className="mt-1 text-sm text-gray-500">Work out what day rate you need to charge.</p>
          </Link>
          <Link href="/guides/sole-trader-vs-limited-company" className="block rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-300 hover:shadow-sm">
            <p className="font-semibold text-gray-900">Sole Trader vs Limited Company</p>
            <p className="mt-1 text-sm text-gray-500">The structure you choose affects how IR35 applies.</p>
          </Link>
        </div>
      </Section>

      {/* Disclaimer */}
      <div className="mt-12 rounded-lg bg-gray-50 p-4 text-xs text-gray-400">
        <p>
          This guide is for informational purposes only and does not constitute legal or tax
          advice. IR35 is a complex area with constantly evolving case law. Always consult a
          qualified IR35 specialist or tax advisor for advice specific to your situation.
          Last updated for the {TAX_YEAR} tax year.
        </p>
      </div>
    </div>
  );
}
