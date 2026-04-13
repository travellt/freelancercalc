'use client';

import { useState, useMemo } from 'react';
import { compareTakeHome, type ComparisonResult } from '@/lib/calculations';
import { formatGBP, TAX_YEAR, PERSONAL_ALLOWANCE, NI1_PRIMARY_THRESHOLD, type StudentLoanPlan, type TaxRegion } from '@/lib/tax';

function InputField({
  label, hint, value, onChange, prefix, suffix, min = 0, max, step = 1,
}: {
  label: string; hint?: string; value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; min?: number; max?: number; step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
      <div className="relative mt-1.5">
        {prefix && <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{prefix}</span>}
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          min={min} max={max} step={step}
          className={`block w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'}`}
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
      >
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

function BreakdownRow({ label, amount, isTotal, isPositive, indent, hint }: {
  label: string; amount: number; isTotal?: boolean; isPositive?: boolean; indent?: boolean; hint?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-2 ${isTotal ? 'border-t-2 border-gray-900 font-semibold text-gray-900' : ''} ${indent ? 'pl-4' : ''}`}>
      <span className={isTotal ? 'text-sm' : 'text-sm text-gray-600'}>
        {label}
        {hint && <span className="ml-1 text-xs text-gray-400">({hint})</span>}
      </span>
      <span className={`text-sm tabular-nums ${isTotal ? (isPositive ? 'text-green-700' : 'text-gray-900') : amount < 0 ? 'text-red-600' : 'text-gray-900'}`}>
        {amount < 0 ? `−${formatGBP(Math.abs(amount))}` : formatGBP(amount)}
      </span>
    </div>
  );
}

function ResultCard({ title, children, highlight, badge }: {
  title: string; children: React.ReactNode; highlight?: boolean; badge?: string;
}) {
  return (
    <div className={`rounded-xl border p-6 ${highlight ? 'border-green-300 bg-green-50/50' : 'border-gray-200 bg-white'}`}>
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {badge && <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">{badge}</span>}
      </div>
      <div className="mt-4 divide-y divide-gray-100">{children}</div>
    </div>
  );
}

/** Simple bar chart showing where the money goes */
function TaxBreakdownChart({ items }: { items: { label: string; amount: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.amount, 0);
  if (total <= 0) return null;

  return (
    <div className="mt-4">
      <div className="flex h-6 w-full overflow-hidden rounded-full">
        {items.filter(i => i.amount > 0).map((item) => (
          <div
            key={item.label}
            className={`${item.color} transition-all duration-500`}
            style={{ width: `${(item.amount / total) * 100}%` }}
            title={`${item.label}: ${formatGBP(item.amount)}`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {items.filter(i => i.amount > 0).map((item) => (
          <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-500">
            <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            {item.label}: {formatGBP(item.amount)} ({Math.round((item.amount / total) * 100)}%)
          </div>
        ))}
      </div>
    </div>
  );
}

const SALARY_PRESETS = [
  { value: 0, label: 'None (£0)' },
  { value: 12_570, label: 'Optimal — Personal allowance (£12,570)' },
  { value: 9_100, label: 'NI threshold (£9,100)' },
];

export default function TakeHomeCalculator() {
  const [revenue, setRevenue] = useState(50_000);
  const [expenses, setExpenses] = useState(5_000);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>('none');
  const [pensionPercent, setPensionPercent] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [region, setRegion] = useState<TaxRegion>('england');
  const [ltdSalary, setLtdSalary] = useState(12_570);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result: ComparisonResult = useMemo(
    () => compareTakeHome({
      annualRevenue: revenue,
      annualExpenses: expenses,
      studentLoan,
      pensionPercent,
      otherIncome,
      region,
      ltdSalary,
    }),
    [revenue, expenses, studentLoan, pensionPercent, otherIncome, region, ltdSalary]
  );

  const { soleTrader: st, ltdCompany: ltd, difference } = result;
  const ltdBetter = difference > 0;

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your details</h2>
        <p className="mt-1 text-sm text-gray-500">Enter your expected annual figures. Results update instantly.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <InputField label="Annual revenue" hint="Total income before any deductions" value={revenue} onChange={setRevenue} prefix="£" />
          <InputField label="Business expenses" hint="Allowable costs (software, equipment, travel, etc.)" value={expenses} onChange={setExpenses} prefix="£" />
          <SelectField
            label="Tax region"
            value={region}
            onChange={(v) => setRegion(v as TaxRegion)}
            options={[
              { value: 'england', label: 'England, Wales or Northern Ireland' },
              { value: 'scotland', label: 'Scotland' },
            ]}
          />
          <SelectField
            label="Student loan"
            value={studentLoan}
            onChange={(v) => setStudentLoan(v as StudentLoanPlan)}
            options={[
              { value: 'none', label: 'None' },
              { value: 'plan1', label: 'Plan 1 (pre-2012)' },
              { value: 'plan2', label: 'Plan 2 (post-2012 England/Wales)' },
              { value: 'plan4', label: 'Plan 4 (Scotland)' },
              { value: 'plan5', label: 'Plan 5 (post-2023)' },
              { value: 'postgrad', label: 'Postgraduate loan' },
            ]}
          />
        </div>

        {/* Advanced options toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-6 text-sm font-medium text-brand-600 hover:text-brand-700"
        >
          {showAdvanced ? '− Hide' : '+ Show'} advanced options
        </button>

        {showAdvanced && (
          <div className="mt-4 grid gap-6 rounded-lg bg-gray-50 p-4 sm:grid-cols-2">
            <InputField
              label="Other income"
              hint="Employment, rental, interest — pushes freelance income into higher bands"
              value={otherIncome} onChange={setOtherIncome} prefix="£"
            />
            <InputField
              label="Pension contribution"
              hint="% of profit contributed to pension (tax relief applies)"
              value={pensionPercent} onChange={setPensionPercent} suffix="%" max={100}
            />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Ltd company director salary
              </label>
              <p className="mt-0.5 text-xs text-gray-400">
                Most directors pay £12,570 (personal allowance) to avoid income tax on salary while using the full allowance. Some pay less to reduce employer NICs.
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SALARY_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setLtdSalary(preset.value)}
                    className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                      ltdSalary === preset.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min={0} max={50270} step={100}
                value={ltdSalary}
                onChange={(e) => setLtdSalary(Number(e.target.value))}
                className="mt-2 w-full accent-brand-600"
              />
              <p className="text-right text-xs text-gray-500">{formatGBP(ltdSalary)}/year</p>
            </div>
          </div>
        )}
      </div>

      {/* Summary comparison */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className={`rounded-xl border p-6 text-center ${!ltdBetter ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
          <p className="text-sm font-medium text-gray-500">Sole Trader</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatGBP(st.takeHome)}</p>
          <p className="mt-1 text-sm text-gray-500">{st.effectiveTaxRate}% effective tax rate</p>
          <p className="mt-1 text-xs text-gray-400">{formatGBP(st.monthlyTakeHome)}/month · {formatGBP(st.weeklyTakeHome)}/week</p>
        </div>
        <div className={`rounded-xl border p-6 text-center ${ltdBetter ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
          <p className="text-sm font-medium text-gray-500">Limited Company</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatGBP(ltd.takeHome)}</p>
          <p className="mt-1 text-sm text-gray-500">{ltd.effectiveTaxRate}% effective tax rate</p>
          <p className="mt-1 text-xs text-gray-400">{formatGBP(ltd.monthlyTakeHome)}/month · {formatGBP(ltd.weeklyTakeHome)}/week</p>
        </div>
      </div>

      {/* Difference callout */}
      <div className={`mt-4 rounded-lg p-4 text-center text-sm font-medium ${
        Math.abs(difference) < 100
          ? 'bg-gray-100 text-gray-700'
          : ltdBetter ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
      }`}>
        {Math.abs(difference) < 100 ? (
          'The difference is negligible at this income level. Sole trader is simpler to run.'
        ) : ltdBetter ? (
          <>A limited company saves you <strong>{formatGBP(difference)}/year</strong> ({formatGBP(Math.round(difference / 12))}/month). However, accountant fees (typically £1,000-2,000/year) will reduce this saving.</>
        ) : (
          <>A sole trader structure saves you <strong>{formatGBP(Math.abs(difference))}/year</strong> ({formatGBP(Math.round(Math.abs(difference) / 12))}/month) and is simpler to run.</>
        )}
      </div>

      {/* Where does the money go — visual chart */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Where your revenue goes</h3>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-gray-600">Sole Trader</p>
            <TaxBreakdownChart items={[
              { label: 'Take-home', amount: st.takeHome, color: 'bg-green-500' },
              { label: 'Income tax', amount: st.incomeTax, color: 'bg-red-400' },
              { label: 'NICs', amount: st.class4NICs + st.class2NICs, color: 'bg-orange-400' },
              { label: 'Pension', amount: st.pensionContribution, color: 'bg-blue-400' },
              { label: 'Expenses', amount: st.expenses, color: 'bg-gray-300' },
              ...(st.studentLoan > 0 ? [{ label: 'Student loan', amount: st.studentLoan, color: 'bg-purple-400' }] : []),
            ]} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Limited Company</p>
            <TaxBreakdownChart items={[
              { label: 'Take-home', amount: ltd.takeHome, color: 'bg-green-500' },
              { label: 'Corporation tax', amount: ltd.corporationTax, color: 'bg-red-400' },
              { label: 'Dividend tax', amount: ltd.dividendTax, color: 'bg-red-300' },
              { label: 'Employer NICs', amount: ltd.employerNICs, color: 'bg-orange-400' },
              { label: 'Pension', amount: ltd.pensionContribution, color: 'bg-blue-400' },
              { label: 'Expenses', amount: ltd.expenses, color: 'bg-gray-300' },
              ...(ltd.studentLoan > 0 ? [{ label: 'Student loan', amount: ltd.studentLoan, color: 'bg-purple-400' }] : []),
            ]} />
          </div>
        </div>
      </div>

      {/* Detailed breakdowns */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ResultCard title="Sole Trader Breakdown" highlight={!ltdBetter} badge={!ltdBetter ? 'Better option' : undefined}>
          <BreakdownRow label="Annual revenue" amount={st.revenue} />
          <BreakdownRow label="Business expenses" amount={-st.expenses} />
          <BreakdownRow label="Taxable profit" amount={st.taxableProfit} isTotal />
          {st.pensionContribution > 0 && <BreakdownRow label="Pension contribution" amount={-st.pensionContribution} indent hint="tax relief at your marginal rate" />}
          {otherIncome > 0 && <BreakdownRow label="Other income" amount={otherIncome} indent hint="pushes freelance income into higher bands" />}
          <BreakdownRow label="Income tax" amount={-st.incomeTax} indent hint={region === 'scotland' ? 'Scottish rates' : undefined} />
          <BreakdownRow label="Class 4 NICs" amount={-st.class4NICs} indent hint="6% / 2%" />
          <BreakdownRow label="Class 2 NICs" amount={-st.class2NICs} indent hint={`£${(3.65).toFixed(2)}/week`} />
          {st.studentLoan > 0 && <BreakdownRow label="Student loan repayment" amount={-st.studentLoan} indent />}
          <BreakdownRow label="Take-home pay" amount={st.takeHome} isTotal isPositive />
        </ResultCard>

        <ResultCard title="Limited Company Breakdown" highlight={ltdBetter} badge={ltdBetter ? 'Better option' : undefined}>
          <BreakdownRow label="Annual revenue" amount={ltd.revenue} />
          <BreakdownRow label="Business expenses" amount={-ltd.expenses} />
          <BreakdownRow label="Gross profit" amount={ltd.grossProfit} isTotal />
          <BreakdownRow label="Director salary" amount={-ltd.optimalSalary} indent hint={ltd.optimalSalary === PERSONAL_ALLOWANCE ? 'at personal allowance' : ltd.optimalSalary <= NI1_PRIMARY_THRESHOLD ? 'below NI threshold' : undefined} />
          <BreakdownRow label="Employer NICs" amount={-ltd.employerNICs} indent hint="15% above £5,000" />
          {ltd.pensionContribution > 0 && <BreakdownRow label="Company pension contribution" amount={-ltd.pensionContribution} indent hint="pre-corporation-tax" />}
          <BreakdownRow label="Corporation tax" amount={-ltd.corporationTax} indent hint={ltd.corporationTaxableProfit <= 50000 ? '19%' : '19-25%'} />
          <BreakdownRow label="Dividends available" amount={ltd.dividends} isTotal />
          <BreakdownRow label="Dividend tax" amount={-ltd.dividendTax} indent hint="10.75% / 35.75%" />
          {ltd.salaryIncomeTax > 0 && <BreakdownRow label="Income tax on salary" amount={-ltd.salaryIncomeTax} indent />}
          {ltd.salaryEmployeeNICs > 0 && <BreakdownRow label="Employee NICs on salary" amount={-ltd.salaryEmployeeNICs} indent />}
          {ltd.studentLoan > 0 && <BreakdownRow label="Student loan repayment" amount={-ltd.studentLoan} indent />}
          <BreakdownRow label="Take-home pay" amount={ltd.takeHome} isTotal isPositive />
        </ResultCard>
      </div>

      {/* Practical considerations */}
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h3 className="text-base font-semibold text-amber-900">Don&apos;t forget these costs</h3>
        <p className="mt-1 text-sm text-amber-800">
          The comparison above shows raw tax differences. In practice, a limited company also means:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-amber-700">
          <li>• <strong>Accountant fees:</strong> £1,000-2,000/year for a ltd company vs £200-500 as sole trader</li>
          <li>• <strong>Companies House filing:</strong> Annual confirmation statement (£13/year) + annual accounts</li>
          <li>• <strong>Admin time:</strong> Payroll, VAT returns, board minutes, dividend vouchers</li>
          <li>• <strong>Professional indemnity insurance</strong> may cost more through a ltd company</li>
          {Math.abs(difference) < 2000 && (
            <li>• At your income level, the accountant fees alone could wipe out the tax saving of a limited company</li>
          )}
        </ul>
      </div>

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Based on HMRC {TAX_YEAR} tax rates, NIC thresholds, and corporation tax rates{region === 'scotland' ? '. Using Scottish income tax bands.' : '.'}</li>
          <li>Sole trader: income tax + Class 2 &amp; 4 NICs on taxable profits.</li>
          <li>Limited company: director salary of {formatGBP(ltdSalary)}, remainder as dividends. No employment allowance (single-director company).</li>
          <li>Corporation tax marginal relief applied for profits between £50,000-£250,000.</li>
          {otherIncome > 0 && <li>Other income of {formatGBP(otherIncome)} is included to calculate correct marginal tax rates on freelance income.</li>}
          <li>Does not account for: accountant fees, flat rate VAT scheme, R&D tax credits, or multiple shareholders.</li>
          <li>Always consult a qualified accountant for advice specific to your situation.</li>
        </ul>
      </div>
    </div>
  );
}
