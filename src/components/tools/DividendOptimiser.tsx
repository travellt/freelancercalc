'use client';

import { useState, useMemo } from 'react';
import { optimiseSalaryDividend, type OptimiserResult } from '@/lib/dividend-optimiser';
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

/** Simple bar chart for salary vs take-home across scenarios */
function OptimisationChart({ scenarios, optimalSalary }: { scenarios: OptimiserResult['scenarios']; optimalSalary: number }) {
  if (scenarios.length < 3) return null;
  const maxTakeHome = Math.max(...scenarios.map(s => s.takeHome));
  const minTakeHome = Math.min(...scenarios.map(s => s.takeHome));
  const range = maxTakeHome - minTakeHome || 1;

  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-gray-700">Take-home by salary level</h4>
      <div className="mt-3 flex items-end gap-1" style={{ height: 120 }}>
        {scenarios.map((s, i) => {
          const height = ((s.takeHome - minTakeHome) / range) * 100 + 10; // min 10%
          const isOptimal = Math.abs(s.salary - optimalSalary) < 200;
          return (
            <div key={i} className="group relative flex-1" style={{ height: '100%' }}>
              <div
                className={`absolute bottom-0 w-full rounded-t transition-colors ${isOptimal ? 'bg-green-500' : 'bg-brand-300 hover:bg-brand-400'}`}
                style={{ height: `${height}%` }}
                title={`Salary: ${formatGBP(s.salary)} → Take-home: ${formatGBP(s.takeHome)}`}
              />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>£0 salary</span>
        <span>{formatGBP(scenarios[scenarios.length - 1]?.salary ?? 0)} salary</span>
      </div>
      <p className="mt-1 text-xs text-gray-400">Green bar = optimal salary. Hover for details.</p>
    </div>
  );
}

export default function DividendOptimiser() {
  const [grossProfit, setGrossProfit] = useState(60_000);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>('none');
  const [region, setRegion] = useState<TaxRegion>('england');
  const [otherIncome, setOtherIncome] = useState(0);
  const [pensionPercent, setPensionPercent] = useState(0);

  const result: OptimiserResult = useMemo(
    () => optimiseSalaryDividend({ grossProfit, studentLoan, region, otherIncome, pensionPercent }),
    [grossProfit, studentLoan, region, otherIncome, pensionPercent]
  );

  const { optimal } = result;

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your company details</h2>
        <p className="mt-1 text-sm text-gray-500">Enter your company&apos;s profit before salary extraction. Results update instantly.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <InputField label="Company gross profit" hint="Revenue minus expenses, before director salary" value={grossProfit} onChange={setGrossProfit} prefix="£" />
          <InputField label="Other personal income" hint="Employment, rental, etc. (affects tax bands)" value={otherIncome} onChange={setOtherIncome} prefix="£" />
          <SelectField label="Tax region" value={region} onChange={(v) => setRegion(v as TaxRegion)}
            options={[{ value: 'england', label: 'England/Wales/NI' }, { value: 'scotland', label: 'Scotland' }]} />
          <SelectField label="Student loan" value={studentLoan} onChange={(v) => setStudentLoan(v as StudentLoanPlan)}
            options={[
              { value: 'none', label: 'None' }, { value: 'plan1', label: 'Plan 1' },
              { value: 'plan2', label: 'Plan 2' }, { value: 'plan4', label: 'Plan 4' },
              { value: 'plan5', label: 'Plan 5' }, { value: 'postgrad', label: 'Postgraduate' },
            ]} />
          <InputField label="Company pension contribution" hint="% of profit contributed as employer pension" value={pensionPercent} onChange={setPensionPercent} suffix="%" max={100} />
        </div>
      </div>

      {/* Result */}
      <div className="mt-8 rounded-xl border-2 border-green-300 bg-green-50 p-6">
        <div className="text-center">
          <p className="text-sm font-medium text-green-700">Optimal salary/dividend split</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-green-600">Director salary</p>
              <p className="text-2xl font-bold text-green-900">{formatGBP(optimal.salary)}/year</p>
              <p className="text-xs text-green-600">{formatGBP(Math.round(optimal.salary / 12))}/month</p>
            </div>
            <div>
              <p className="text-sm text-green-600">Dividends</p>
              <p className="text-2xl font-bold text-green-900">{formatGBP(optimal.dividendsAvailable)}/year</p>
              <p className="text-xs text-green-600">{formatGBP(Math.round(optimal.dividendsAvailable / 12))}/month</p>
            </div>
            <div>
              <p className="text-sm text-green-600">Total take-home</p>
              <p className="text-2xl font-bold text-green-900">{formatGBP(optimal.takeHome)}/year</p>
              <p className="text-xs text-green-600">{optimal.effectiveTaxRate}% effective tax rate</p>
            </div>
          </div>
        </div>
        <p className="mt-4 text-center text-sm text-green-800">{result.optimalReason}</p>
      </div>

      {/* Chart */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">How salary level affects your take-home</h3>
        <p className="mt-1 text-sm text-gray-500">
          Each bar shows your total take-home pay (salary + dividends minus all taxes) at a different salary level.
        </p>
        <OptimisationChart scenarios={result.scenarios} optimalSalary={result.optimalSalaryAmount} />
      </div>

      {/* Detailed breakdown */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Full tax breakdown at optimal split</h3>
        <div className="mt-4 divide-y divide-gray-100">
          <Row label="Company gross profit" value={formatGBP(grossProfit)} />
          <Row label="Director salary" value={`−${formatGBP(optimal.salary)}`} indent />
          <Row label="Employer NICs" value={`−${formatGBP(optimal.employerNICs)}`} indent hint="13.8% above £5,000" />
          {optimal.companyPensionContrib > 0 && <Row label="Company pension" value={`−${formatGBP(optimal.companyPensionContrib)}`} indent />}
          <Row label="Corporation tax" value={`−${formatGBP(optimal.corporationTax)}`} indent hint={optimal.corporationTaxableProfit <= 50000 ? '19%' : '19-25%'} />
          <Row label="Dividends available" value={formatGBP(optimal.dividendsAvailable)} bold />
          <Row label="Income tax on salary" value={`−${formatGBP(optimal.salaryIncomeTax)}`} indent />
          <Row label="Employee NICs on salary" value={`−${formatGBP(optimal.salaryEmployeeNICs)}`} indent />
          <Row label="Dividend tax" value={`−${formatGBP(optimal.dividendTax)}`} indent />
          {optimal.studentLoan > 0 && <Row label="Student loan" value={`−${formatGBP(optimal.studentLoan)}`} indent />}
          <Row label="Total tax burden" value={formatGBP(optimal.totalTaxBurden)} bold />
          <Row label="Take-home pay" value={formatGBP(optimal.takeHome)} bold />
        </div>
      </div>

      {/* Common scenarios comparison */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Compare common strategies</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-medium uppercase text-gray-500">
                <th className="pb-2 pr-4">Strategy</th>
                <th className="pb-2 pr-4 text-right">Salary</th>
                <th className="pb-2 pr-4 text-right">Dividends</th>
                <th className="pb-2 pr-4 text-right">Total tax</th>
                <th className="pb-2 text-right">Take-home</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { salary: 0, label: 'No salary' },
                { salary: 12_570, label: '£12,570 (personal allowance)' },
                { salary: result.optimalSalaryAmount, label: `${formatGBP(result.optimalSalaryAmount)} (optimal)` },
                { salary: 50_270, label: '£50,270 (higher rate)' },
              ]
                .filter((s, i, arr) => {
                  // dedupe
                  return arr.findIndex(x => Math.abs(x.salary - s.salary) < 100) === i;
                })
                .filter(s => s.salary <= grossProfit)
                .map((s) => {
                  const scenario = result.scenarios.find(sc => Math.abs(sc.salary - s.salary) < 200)
                    ?? result.scenarios[0];
                  const isOptimal = Math.abs(s.salary - result.optimalSalaryAmount) < 200;
                  return (
                    <tr key={s.salary} className={isOptimal ? 'bg-green-50 font-medium' : ''}>
                      <td className="py-2 pr-4">{s.label}</td>
                      <td className="py-2 pr-4 text-right tabular-nums">{formatGBP(scenario.salary)}</td>
                      <td className="py-2 pr-4 text-right tabular-nums">{formatGBP(scenario.dividendsAvailable)}</td>
                      <td className="py-2 pr-4 text-right tabular-nums">{formatGBP(scenario.totalTaxBurden)}</td>
                      <td className={`py-2 text-right tabular-nums ${isOptimal ? 'text-green-700' : ''}`}>{formatGBP(scenario.takeHome)}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Tests hundreds of salary levels from £0 to your gross profit and finds the split that maximises take-home pay.</li>
          <li>Accounts for: income tax{region === 'scotland' ? ' (Scottish rates)' : ''}, employee and employer NICs, corporation tax (with marginal relief), dividend tax, and student loan repayments.</li>
          <li>No employment allowance (single-director company). Employment allowance is only available if you have other employees.</li>
          <li>Assumes all post-tax profit is extracted as dividends. Retaining profit in the company defers tax but doesn&apos;t eliminate it.</li>
          <li>Based on HMRC {TAX_YEAR} rates. Always verify with your accountant.</li>
        </ul>
      </div>
    </div>
  );
}
