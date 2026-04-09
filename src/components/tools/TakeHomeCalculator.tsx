'use client';

import { useState, useMemo } from 'react';
import { compareTakeHome, type ComparisonResult } from '@/lib/calculations';
import { formatGBP, TAX_YEAR, type StudentLoanPlan } from '@/lib/tax';

function InputField({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max,
  step = 1,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
      <div className="relative mt-1.5">
        {prefix && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          min={min}
          max={max}
          step={step}
          className={`block w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none ${
            prefix ? 'pl-7' : 'pl-3'
          } ${suffix ? 'pr-12' : 'pr-3'}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
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
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function BreakdownRow({
  label,
  amount,
  isTotal,
  isPositive,
  indent,
}: {
  label: string;
  amount: number;
  isTotal?: boolean;
  isPositive?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2 ${
        isTotal ? 'border-t-2 border-gray-900 font-semibold text-gray-900' : ''
      } ${indent ? 'pl-4' : ''}`}
    >
      <span className={isTotal ? 'text-sm' : 'text-sm text-gray-600'}>{label}</span>
      <span
        className={`text-sm tabular-nums ${
          isTotal
            ? isPositive
              ? 'text-green-700'
              : 'text-gray-900'
            : amount < 0
              ? 'text-red-600'
              : 'text-gray-900'
        }`}
      >
        {amount < 0 ? `−${formatGBP(Math.abs(amount))}` : formatGBP(amount)}
      </span>
    </div>
  );
}

function ResultCard({
  title,
  children,
  highlight,
  badge,
}: {
  title: string;
  children: React.ReactNode;
  highlight?: boolean;
  badge?: string;
}) {
  return (
    <div
      className={`rounded-xl border p-6 ${
        highlight ? 'border-green-300 bg-green-50/50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {badge && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-4 divide-y divide-gray-100">{children}</div>
    </div>
  );
}

export default function TakeHomeCalculator() {
  const [revenue, setRevenue] = useState(50_000);
  const [expenses, setExpenses] = useState(5_000);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>('none');
  const [pensionPercent, setPensionPercent] = useState(0);

  const result: ComparisonResult = useMemo(
    () =>
      compareTakeHome({
        annualRevenue: revenue,
        annualExpenses: expenses,
        studentLoan,
        pensionPercent,
      }),
    [revenue, expenses, studentLoan, pensionPercent]
  );

  const { soleTrader: st, ltdCompany: ltd, difference } = result;
  const ltdBetter = difference > 0;

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Enter your expected annual figures. Results update instantly.
        </p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <InputField
            label="Annual revenue"
            hint="Total income before any deductions"
            value={revenue}
            onChange={setRevenue}
            prefix="£"
          />
          <InputField
            label="Business expenses"
            hint="Allowable costs (software, equipment, travel, etc.)"
            value={expenses}
            onChange={setExpenses}
            prefix="£"
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
          <InputField
            label="Pension contribution"
            hint="% of profit contributed to pension"
            value={pensionPercent}
            onChange={setPensionPercent}
            suffix="%"
            max={100}
          />
        </div>
      </div>

      {/* Summary comparison */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div
          className={`rounded-xl border p-6 text-center ${
            !ltdBetter ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
          }`}
        >
          <p className="text-sm font-medium text-gray-500">Sole Trader</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatGBP(st.takeHome)}</p>
          <p className="mt-1 text-sm text-gray-500">{st.effectiveTaxRate}% effective tax rate</p>
          <p className="mt-1 text-xs text-gray-400">{formatGBP(Math.round(st.takeHome / 12))}/month</p>
        </div>
        <div
          className={`rounded-xl border p-6 text-center ${
            ltdBetter ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
          }`}
        >
          <p className="text-sm font-medium text-gray-500">Limited Company</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatGBP(ltd.takeHome)}</p>
          <p className="mt-1 text-sm text-gray-500">{ltd.effectiveTaxRate}% effective tax rate</p>
          <p className="mt-1 text-xs text-gray-400">{formatGBP(Math.round(ltd.takeHome / 12))}/month</p>
        </div>
      </div>

      {/* Difference callout */}
      <div
        className={`mt-4 rounded-lg p-4 text-center text-sm font-medium ${
          Math.abs(difference) < 100
            ? 'bg-gray-100 text-gray-700'
            : ltdBetter
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800'
        }`}
      >
        {Math.abs(difference) < 100 ? (
          'The difference is negligible at this income level.'
        ) : ltdBetter ? (
          <>
            A limited company saves you <strong>{formatGBP(difference)}/year</strong> (
            {formatGBP(Math.round(difference / 12))}/month) at this income level.
          </>
        ) : (
          <>
            A sole trader structure saves you <strong>{formatGBP(Math.abs(difference))}/year</strong> (
            {formatGBP(Math.round(Math.abs(difference) / 12))}/month) at this income level.
          </>
        )}
      </div>

      {/* Detailed breakdowns */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ResultCard title="Sole Trader Breakdown" highlight={!ltdBetter} badge={!ltdBetter ? 'Better option' : undefined}>
          <BreakdownRow label="Annual revenue" amount={st.revenue} />
          <BreakdownRow label="Business expenses" amount={-st.expenses} />
          <BreakdownRow label="Taxable profit" amount={st.taxableProfit} isTotal />
          {st.pensionContribution > 0 && (
            <BreakdownRow label="Pension contribution" amount={-st.pensionContribution} indent />
          )}
          <BreakdownRow label="Income tax" amount={-st.incomeTax} indent />
          <BreakdownRow label="Class 4 NICs" amount={-st.class4NICs} indent />
          <BreakdownRow label="Class 2 NICs" amount={-st.class2NICs} indent />
          {st.studentLoan > 0 && (
            <BreakdownRow label="Student loan repayment" amount={-st.studentLoan} indent />
          )}
          <BreakdownRow label="Take-home pay" amount={st.takeHome} isTotal isPositive />
        </ResultCard>

        <ResultCard title="Limited Company Breakdown" highlight={ltdBetter} badge={ltdBetter ? 'Better option' : undefined}>
          <BreakdownRow label="Annual revenue" amount={ltd.revenue} />
          <BreakdownRow label="Business expenses" amount={-ltd.expenses} />
          <BreakdownRow label="Gross profit" amount={ltd.grossProfit} isTotal />
          <BreakdownRow label="Director salary" amount={-ltd.optimalSalary} indent />
          <BreakdownRow label="Employer NICs" amount={-ltd.employerNICs} indent />
          {ltd.pensionContribution > 0 && (
            <BreakdownRow label="Pension (company contribution)" amount={-ltd.pensionContribution} indent />
          )}
          <BreakdownRow label="Corporation tax" amount={-ltd.corporationTax} indent />
          <BreakdownRow label="Dividends available" amount={ltd.dividends} isTotal />
          <BreakdownRow label="Dividend tax" amount={-ltd.dividendTax} indent />
          <BreakdownRow label="Income tax on salary" amount={-ltd.salaryIncomeTax} indent />
          <BreakdownRow label="Employee NICs on salary" amount={-ltd.salaryEmployeeNICs} indent />
          {ltd.studentLoan > 0 && (
            <BreakdownRow label="Student loan repayment" amount={-ltd.studentLoan} indent />
          )}
          <BreakdownRow label="Take-home pay" amount={ltd.takeHome} isTotal isPositive />
        </ResultCard>
      </div>

      {/* Methodology note */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Based on HMRC {TAX_YEAR} tax rates, NIC thresholds, and corporation tax rates.</li>
          <li>Sole trader: income tax + Class 2 &amp; 4 NICs on taxable profits.</li>
          <li>
            Limited company: optimal salary at £12,570 (personal allowance), remainder as dividends.
            No employment allowance (single-director company).
          </li>
          <li>Does not account for: flat rate VAT scheme benefits, R&D tax credits, multiple income sources, or Scottish income tax rates.</li>
          <li>Always consult a qualified accountant for advice specific to your situation.</li>
        </ul>
      </div>
    </div>
  );
}
