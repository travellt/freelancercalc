'use client';

import { useState, useMemo } from 'react';
import { calculateQuarterlyTax, type QuarterlyTaxResult } from '@/lib/quarterly-tax';
import { formatGBP, TAX_YEAR, type StudentLoanPlan, type TaxRegion } from '@/lib/tax';

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
        <input type="number" value={value || ''} onChange={(e) => onChange(Number(e.target.value) || 0)}
          min={min} max={max} step={step}
          className={`block w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'}`}
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none">
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

function Row({ label, value, bold, indent, hint }: {
  label: string; value: string; bold?: boolean; indent?: boolean; hint?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-2 ${bold ? 'border-t-2 border-gray-900 font-semibold' : ''} ${indent ? 'pl-4' : ''}`}>
      <span className={bold ? 'text-sm text-gray-900' : 'text-sm text-gray-600'}>
        {label}{hint && <span className="ml-1 text-xs text-gray-400">({hint})</span>}
      </span>
      <span className="text-sm tabular-nums text-gray-900">{value}</span>
    </div>
  );
}

export default function QuarterlyTaxEstimator() {
  const [annualProfit, setAnnualProfit] = useState(45_000);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>('none');
  const [region, setRegion] = useState<TaxRegion>('england');
  const [otherIncome, setOtherIncome] = useState(0);
  const [isFirstYear, setIsFirstYear] = useState(false);
  const [previousYearTax, setPreviousYearTax] = useState(7_000);

  const result: QuarterlyTaxResult = useMemo(
    () => calculateQuarterlyTax({ annualProfit, studentLoan, region, otherIncome, isFirstYear, previousYearTax }),
    [annualProfit, studentLoan, region, otherIncome, isFirstYear, previousYearTax]
  );

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your details</h2>
        <p className="mt-1 text-sm text-gray-500">Enter your expected profit for the current tax year.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <InputField label="Expected annual profit" hint="Revenue minus allowable expenses" value={annualProfit} onChange={setAnnualProfit} prefix="£" />
          <InputField label="Other income" hint="Employment, rental, etc." value={otherIncome} onChange={setOtherIncome} prefix="£" />
          <SelectField label="Tax region" value={region} onChange={(v) => setRegion(v as TaxRegion)}
            options={[{ value: 'england', label: 'England/Wales/NI' }, { value: 'scotland', label: 'Scotland' }]} />
          <SelectField label="Student loan" value={studentLoan} onChange={(v) => setStudentLoan(v as StudentLoanPlan)}
            options={[
              { value: 'none', label: 'None' }, { value: 'plan1', label: 'Plan 1' },
              { value: 'plan2', label: 'Plan 2' }, { value: 'plan4', label: 'Plan 4' },
              { value: 'plan5', label: 'Plan 5' }, { value: 'postgrad', label: 'Postgraduate' },
            ]} />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Is this your first year of self-employment?</label>
            <div className="mt-1.5 flex gap-2">
              {[false, true].map((v) => (
                <button key={String(v)} onClick={() => setIsFirstYear(v)}
                  className={`flex-1 rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                    isFirstYear === v ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {v ? 'Yes — first year' : 'No — been trading before'}
                </button>
              ))}
            </div>
          </div>
          {!isFirstYear && (
            <InputField label="Last year's total tax bill" hint="Used to calculate payments on account" value={previousYearTax} onChange={setPreviousYearTax} prefix="£" />
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border-2 border-brand-300 bg-brand-50 p-5 text-center">
          <p className="text-sm font-medium text-brand-700">Total tax this year</p>
          <p className="text-3xl font-bold text-brand-900">{formatGBP(result.totalAnnualTax)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm font-medium text-gray-500">Save monthly</p>
          <p className="text-2xl font-bold text-gray-900">{formatGBP(result.monthlyReserve)}</p>
          <p className="text-xs text-gray-400">{formatGBP(result.weeklyReserve)}/week</p>
        </div>
        <div className={`rounded-xl border p-5 text-center ${
          result.taxChange > 0 ? 'border-red-200 bg-red-50' : result.taxChange < 0 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'
        }`}>
          <p className="text-sm font-medium text-gray-500">vs last year</p>
          <p className={`text-2xl font-bold ${result.taxChange > 0 ? 'text-red-700' : result.taxChange < 0 ? 'text-green-700' : 'text-gray-900'}`}>
            {result.taxChange > 0 ? '+' : ''}{formatGBP(result.taxChange)}
          </p>
          {result.taxChangePercent !== 0 && (
            <p className="text-xs text-gray-400">{result.taxChangePercent > 0 ? '+' : ''}{result.taxChangePercent}%</p>
          )}
        </div>
      </div>

      {/* Tax breakdown */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Tax breakdown</h3>
        <div className="mt-4 divide-y divide-gray-100">
          <Row label="Income tax" value={formatGBP(result.incomeTax)} hint={region === 'scotland' ? 'Scottish rates' : undefined} />
          <Row label="Class 4 NICs" value={formatGBP(result.class4NICs)} hint="6% / 2%" />
          <Row label="Class 2 NICs" value={formatGBP(result.class2NICs)} hint="£3.65/week" />
          {result.studentLoan > 0 && <Row label="Student loan repayment" value={formatGBP(result.studentLoan)} />}
          <Row label="Total tax bill" value={formatGBP(result.totalAnnualTax)} bold />
        </div>
      </div>

      {/* Payment schedule */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Payment schedule</h3>
        <p className="mt-1 text-sm text-gray-500">
          {result.paymentsOnAccount
            ? 'You\'ll make payments on account (advance payments based on last year\'s bill) plus a balancing payment.'
            : 'No payments on account — your full tax bill is due in one payment.'}
        </p>
        <div className="mt-4 space-y-4">
          {result.schedule.map((event, i) => (
            <div key={i} className="flex items-start gap-4 rounded-lg border border-gray-100 bg-gray-50 p-4">
              <div className="shrink-0">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                  event.amount > 0 ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {i + 1}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{event.label}</p>
                    <p className="text-xs text-gray-500">{event.date}</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{formatGBP(event.amount)}</p>
                </div>
                <p className="mt-1 text-xs text-gray-500">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reserve advice */}
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h3 className="text-base font-semibold text-amber-900">Set aside money every month</h3>
        <p className="mt-2 text-sm text-amber-800">
          Put <strong>{formatGBP(result.monthlyReserve)}/month</strong> ({formatGBP(result.weeklyReserve)}/week) into a separate
          savings account. This covers your entire tax bill including payments on account.
          A high-interest easy-access savings account means you earn interest on HMRC&apos;s money before it&apos;s due.
        </p>
        <p className="mt-2 text-xs text-amber-700">
          Tip: Set up an automatic standing order on the day you invoice so you never forget.
        </p>
      </div>

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Based on HMRC {TAX_YEAR} tax rates{region === 'scotland' ? ' (Scottish income tax bands)' : ''}.</li>
          <li>Payments on account are each 50% of the previous year&apos;s tax bill. Not required if last year&apos;s bill was under £1,000 or if &gt;80% was collected at source.</li>
          <li>The balancing payment is the difference between your actual tax and the POAs already paid.</li>
          <li>January 31st is a double hit: you pay the balancing payment for the old year AND the first POA for the new year.</li>
          <li>You can apply to reduce POAs if you expect your income to be significantly lower than last year.</li>
        </ul>
      </div>
    </div>
  );
}
