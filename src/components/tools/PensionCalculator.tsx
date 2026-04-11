'use client';

import { useState, useMemo } from 'react';
import { calculatePension, type PensionResult } from '@/lib/pension';
import { formatGBP } from '@/lib/tax';

function InputField({
  label, hint, value, onChange, prefix, suffix, min, max, step = 1,
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

function GrowthChart({ projections }: { projections: PensionResult['projections'] }) {
  if (projections.length < 2) return null;
  const maxVal = Math.max(...projections.map(p => p.potValue));
  if (maxVal <= 0) return null;

  // Show every Nth bar to keep chart readable
  const step = Math.max(1, Math.floor(projections.length / 25));
  const filtered = projections.filter((_, i) => i === 0 || i === projections.length - 1 || i % step === 0);

  return (
    <div>
      <div className="flex items-end gap-1" style={{ height: 160 }}>
        {filtered.map((p, i) => {
          const height = (p.potValue / maxVal) * 100;
          const contribHeight = (p.contributions / maxVal) * 100;
          return (
            <div key={i} className="group relative flex-1" style={{ height: '100%' }}>
              {/* Growth */}
              <div className="absolute bottom-0 w-full rounded-t bg-green-300 transition-all" style={{ height: `${height}%` }}
                title={`Age ${p.age}: ${formatGBP(p.potValue)} (${formatGBP(p.contributions)} contributed)`} />
              {/* Contributions */}
              <div className="absolute bottom-0 w-full rounded-t bg-brand-400 transition-all" style={{ height: `${contribHeight}%` }} />
            </div>
          );
        })}
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>Age {filtered[0]?.age}</span>
        <span>Age {filtered[filtered.length - 1]?.age}</span>
      </div>
      <div className="mt-2 flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-brand-400" /> Contributions</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-green-300" /> Investment growth</span>
      </div>
    </div>
  );
}

export default function PensionCalculator() {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [currentPot, setCurrentPot] = useState(10_000);
  const [monthlyContribution, setMonthlyContribution] = useState(300);
  const [growthRate, setGrowthRate] = useState(7);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [desiredIncome, setDesiredIncome] = useState(25_000);

  const result: PensionResult = useMemo(
    () => calculatePension({
      currentAge, retirementAge, currentPot, monthlyContribution,
      annualGrowthRate: growthRate, inflationRate, desiredRetirementIncome: desiredIncome,
    }),
    [currentAge, retirementAge, currentPot, monthlyContribution, growthRate, inflationRate, desiredIncome]
  );

  const onTrack = result.shortfall === 0;

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your pension details</h2>
        <p className="mt-1 text-sm text-gray-500">Adjust the inputs to see how different contribution levels affect your retirement.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <InputField label="Your age" value={currentAge} onChange={setCurrentAge} min={16} max={80} suffix="years" />
          <InputField label="Retirement age" value={retirementAge} onChange={setRetirementAge} min={currentAge + 1} max={80} suffix="years" />
          <InputField label="Current pension pot" hint="Total saved so far" value={currentPot} onChange={setCurrentPot} prefix="£" />
          <InputField label="Monthly contribution" hint="What you save each month" value={monthlyContribution} onChange={setMonthlyContribution} prefix="£" />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <InputField label="Expected annual growth" hint="Typical: 5-8% for equities" value={growthRate} onChange={setGrowthRate} suffix="%" step={0.5} />
          <InputField label="Inflation rate" hint="Bank of England target: 2%" value={inflationRate} onChange={setInflationRate} suffix="%" step={0.5} />
          <InputField label="Desired retirement income" hint="Annual, in today's money" value={desiredIncome} onChange={setDesiredIncome} prefix="£" />
        </div>
      </div>

      {/* Summary */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border-2 border-brand-300 bg-brand-50 p-5 text-center">
          <p className="text-sm font-medium text-brand-700">Projected pot at {retirementAge}</p>
          <p className="text-2xl font-bold text-brand-900">{formatGBP(result.projectedPotReal)}</p>
          <p className="text-xs text-brand-600">in today&apos;s money</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm font-medium text-gray-500">Annual retirement income</p>
          <p className="text-2xl font-bold text-gray-900">{formatGBP(result.annualDrawdownReal)}</p>
          <p className="text-xs text-gray-400">{formatGBP(result.monthlyDrawdownReal)}/month (4% rule)</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm font-medium text-gray-500">You&apos;ll contribute</p>
          <p className="text-2xl font-bold text-gray-900">{formatGBP(result.totalContributions)}</p>
          <p className="text-xs text-gray-400">over {result.yearsToRetirement} years</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm font-medium text-gray-500">Investment growth</p>
          <p className="text-2xl font-bold text-green-700">{formatGBP(result.totalGrowth)}</p>
          <p className="text-xs text-gray-400">compound returns</p>
        </div>
      </div>

      {/* On track / shortfall */}
      <div className={`mt-4 rounded-lg p-4 text-center text-sm font-medium ${
        onTrack ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
      }`}>
        {onTrack ? (
          <>Your projected pension income of <strong>{formatGBP(result.annualDrawdownReal)}/year</strong> meets your target of {formatGBP(desiredIncome)}/year.</>
        ) : (
          <>
            Your projected pension income of <strong>{formatGBP(result.annualDrawdownReal)}/year</strong> is{' '}
            <strong>{formatGBP(result.shortfall)}/year short</strong> of your {formatGBP(desiredIncome)} target.
            To close the gap, increase contributions by <strong>{formatGBP(result.additionalMonthlyNeeded)}/month</strong> (total: {formatGBP(monthlyContribution + result.additionalMonthlyNeeded)}/month).
          </>
        )}
      </div>

      {/* Growth chart */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">Pension growth over time</h3>
        <p className="mt-1 text-sm text-gray-500">See how contributions and compound growth build your pot.</p>
        <div className="mt-4">
          <GrowthChart projections={result.projections} />
        </div>
      </div>

      {/* Tax relief */}
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6">
        <h3 className="text-base font-semibold text-green-900">Tax relief on pension contributions</h3>
        <p className="mt-2 text-sm text-green-800">
          As a freelancer, you get tax relief on personal pension contributions. At the basic rate, every
          £80 you contribute becomes £100 in your pension (the government adds £20).
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-green-100 p-3 text-center">
            <p className="text-xs text-green-700">Tax relief per year</p>
            <p className="text-lg font-bold text-green-900">{formatGBP(result.taxReliefPerYear)}</p>
          </div>
          <div className="rounded-lg bg-green-100 p-3 text-center">
            <p className="text-xs text-green-700">Total tax relief over {result.yearsToRetirement} years</p>
            <p className="text-lg font-bold text-green-900">{formatGBP(result.taxReliefTotal)}</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-green-700">
          Higher/additional rate taxpayers can claim extra relief through self-assessment.
          Ltd company directors can make employer contributions — no NI and deductible from corporation tax.
        </p>
      </div>

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Uses the 4% safe withdrawal rule — you can sustainably draw 4% of your pot per year in retirement.</li>
          <li>&ldquo;In today&apos;s money&rdquo; figures are adjusted for inflation so you can compare meaningfully with current income.</li>
          <li>Investment growth is compounded annually. Real-world returns vary — consider using 5% for conservative estimates or 7% for equities-heavy portfolios.</li>
          <li>Tax relief shown at basic rate (20%). Higher/additional rate taxpayers receive more via self-assessment.</li>
          <li>Does not account for: state pension (currently ~£11,500/year at full entitlement), charges/fees on your pension, or lifetime allowance.</li>
          <li>This is a projection, not a guarantee. Past performance doesn&apos;t predict future returns.</li>
        </ul>
      </div>
    </div>
  );
}
