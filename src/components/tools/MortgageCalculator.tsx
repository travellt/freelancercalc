'use client';

import { useState, useMemo } from 'react';
import { calculateMortgage, type MortgageResult } from '@/lib/mortgage';
import { formatGBP } from '@/lib/tax';

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
          className={`block w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-14' : 'pr-3'}`}
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

const LTV_COLORS = {
  excellent: 'text-green-700 bg-green-100',
  good: 'text-green-700 bg-green-100',
  moderate: 'text-amber-700 bg-amber-100',
  high: 'text-orange-700 bg-orange-100',
  'very-high': 'text-red-700 bg-red-100',
};

export default function MortgageCalculator() {
  const [annualIncome, setAnnualIncome] = useState(50_000);
  const [previousYearIncome, setPreviousYearIncome] = useState(45_000);
  const [yearsTrading, setYearsTrading] = useState(3);
  const [propertyPrice, setPropertyPrice] = useState(300_000);
  const [deposit, setDeposit] = useState(30_000);
  const [termYears, setTermYears] = useState(25);
  const [existingCommitments, setExistingCommitments] = useState(0);
  const [structure, setStructure] = useState<'sole-trader' | 'limited-company'>('sole-trader');

  const result: MortgageResult = useMemo(
    () => calculateMortgage({
      annualIncome, previousYearIncome, yearsTrading, propertyPrice, deposit,
      termYears, existingCommitments, structure,
    }),
    [annualIncome, previousYearIncome, yearsTrading, propertyPrice, deposit, termYears, existingCommitments, structure]
  );

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your details</h2>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Business structure</label>
          <div className="mt-1.5 flex gap-2">
            {(['sole-trader', 'limited-company'] as const).map((s) => (
              <button key={s} onClick={() => setStructure(s)}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  structure === s ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>{s === 'sole-trader' ? 'Sole trader' : 'Limited company'}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <InputField label={structure === 'sole-trader' ? 'This year\'s net profit' : 'This year\'s salary + dividends'}
            hint={structure === 'sole-trader' ? 'From your self-assessment' : 'Total personal income from your company'}
            value={annualIncome} onChange={setAnnualIncome} prefix="£" />
          <InputField label="Previous year's income"
            hint="Lenders average 2-3 years. Leave 0 if first year"
            value={previousYearIncome} onChange={setPreviousYearIncome} prefix="£" />
          <InputField label="Years trading" hint="Full years of filed accounts" value={yearsTrading} onChange={setYearsTrading} suffix="years" min={0} max={50} />
          <InputField label="Monthly commitments" hint="Credit cards, loans, car finance, etc." value={existingCommitments} onChange={setExistingCommitments} prefix="£" suffix="/month" />
        </div>

        <h3 className="mt-8 text-sm font-semibold text-gray-900">Property details</h3>
        <div className="mt-3 grid gap-6 sm:grid-cols-3">
          <InputField label="Property price" value={propertyPrice} onChange={setPropertyPrice} prefix="£" />
          <InputField label="Deposit" value={deposit} onChange={setDeposit} prefix="£" />
          <InputField label="Mortgage term" value={termYears} onChange={setTermYears} suffix="years" min={5} max={40} />
        </div>
      </div>

      {/* Key results */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm font-medium text-gray-500">Loan amount</p>
          <p className="text-2xl font-bold text-gray-900">{formatGBP(result.loanAmount)}</p>
          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${LTV_COLORS[result.ltvBand]}`}>
            {result.ltv}% LTV
          </span>
        </div>
        <div className="rounded-xl border-2 border-brand-300 bg-brand-50 p-5 text-center">
          <p className="text-sm font-medium text-brand-700">Monthly payment</p>
          <p className="text-2xl font-bold text-brand-900">{formatGBP(result.monthlyPayment2yr)}</p>
          <p className="text-xs text-brand-600">2-year fixed (~4.5%)</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm font-medium text-gray-500">After fixed period</p>
          <p className="text-2xl font-bold text-gray-900">{formatGBP(result.monthlyPaymentSVR)}</p>
          <p className="text-xs text-gray-400">SVR (~6.5%)</p>
        </div>
        <div className={`rounded-xl border p-5 text-center ${
          result.passesStressTest ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
        }`}>
          <p className="text-sm font-medium text-gray-500">Stress test</p>
          <p className={`text-2xl font-bold ${result.passesStressTest ? 'text-green-700' : 'text-red-700'}`}>
            {result.passesStressTest ? 'Pass' : 'Fail'}
          </p>
          <p className="text-xs text-gray-400">{result.affordabilityRatio}% of income</p>
        </div>
      </div>

      {/* Borrowing capacity */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">How much could you borrow?</h3>
        <p className="mt-1 text-sm text-gray-500">
          Based on your income of {formatGBP(result.incomeUsed)}/year (average used by lenders).
        </p>
        <p className="mt-1 text-xs text-gray-400">{result.incomeNote}</p>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            { label: 'Conservative (3×)', amount: result.maxBorrowingConservative, desc: 'High street lenders, stricter criteria' },
            { label: 'Moderate (4×)', amount: result.maxBorrowingModerate, desc: 'Most common for employed applicants' },
            { label: 'Optimistic (4.5×)', amount: result.maxBorrowingOptimistic, desc: 'Best case — specialist lenders, strong profile' },
          ].map((tier) => (
            <div key={tier.label} className={`rounded-lg p-4 ${
              result.loanAmount <= tier.amount ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <p className="text-sm font-medium text-gray-700">{tier.label}</p>
              <p className="mt-1 text-xl font-bold text-gray-900">{formatGBP(tier.amount)}</p>
              <p className="mt-1 text-xs text-gray-500">{tier.desc}</p>
              {result.loanAmount <= tier.amount ? (
                <p className="mt-2 text-xs font-medium text-green-700">Your {formatGBP(result.loanAmount)} loan fits ✓</p>
              ) : (
                <p className="mt-2 text-xs text-red-600">Need {formatGBP(result.loanAmount - tier.amount)} more deposit</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Trading history */}
      <div className={`mt-8 rounded-xl border p-6 ${
        result.tradingYearsSufficient ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
      }`}>
        <h3 className={`text-base font-semibold ${result.tradingYearsSufficient ? 'text-green-900' : 'text-amber-900'}`}>
          Trading history: {yearsTrading} year{yearsTrading !== 1 ? 's' : ''}
        </h3>
        <p className={`mt-2 text-sm ${result.tradingYearsSufficient ? 'text-green-800' : 'text-amber-800'}`}>
          {result.tradingYearsNote}
        </p>
      </div>

      {/* Tips */}
      {result.tips.length > 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Tips for self-employed mortgage applicants</h3>
          <ul className="mt-4 space-y-3">
            {result.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">{i + 1}</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Uses illustrative rates: 2-year fix ~4.5%, SVR ~6.5%, stress test 8%. Actual rates vary by lender and your profile.</li>
          <li>Income multiplier: most lenders offer 3-4.5× income for self-employed applicants. 4× is typical for 2+ years trading.</li>
          <li>Stress test: lenders check you can afford payments at a higher rate (typically 2-3% above your actual rate). Most require total commitments under 40-50% of income.</li>
          <li>Self-employed income is typically averaged over 2-3 years. Lenders may use the lower of the two years.</li>
          <li>This is an estimate only. Actual affordability depends on the specific lender&apos;s criteria, your credit score, and other factors.</li>
        </ul>
      </div>
    </div>
  );
}
