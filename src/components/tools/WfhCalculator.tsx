'use client';

import { useState, useMemo } from 'react';
import { calculateWfh, type WfhResult } from '@/lib/wfh';
import { formatGBP, TAX_YEAR } from '@/lib/tax';
import EmailCapture from './EmailCapture';

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

export default function WfhCalculator() {
  const [status, setStatus] = useState<'sole-trader' | 'limited-company' | 'employed'>('sole-trader');
  const [hoursPerWeek, setHoursPerWeek] = useState(35);
  const [weeksPerYear, setWeeksPerYear] = useState(48);

  // Household costs
  const [annualMortgageRent, setAnnualMortgageRent] = useState(12_000);
  const [annualCouncilTax, setAnnualCouncilTax] = useState(1_800);
  const [annualElectricity, setAnnualElectricity] = useState(1_200);
  const [annualGas, setAnnualGas] = useState(800);
  const [annualWater, setAnnualWater] = useState(400);
  const [annualBroadband, setAnnualBroadband] = useState(360);
  const [annualInsurance, setAnnualInsurance] = useState(300);
  const [totalRooms, setTotalRooms] = useState(5);
  const [workRooms, setWorkRooms] = useState(1);

  const result: WfhResult = useMemo(
    () => calculateWfh({
      status, hoursPerWeek, weeksPerYear,
      annualMortgageRent, annualCouncilTax, annualElectricity, annualGas,
      annualWater, annualBroadband, annualInsurance, totalRooms, workRooms,
    }),
    [status, hoursPerWeek, weeksPerYear, annualMortgageRent, annualCouncilTax,
     annualElectricity, annualGas, annualWater, annualBroadband, annualInsurance,
     totalRooms, workRooms]
  );

  const isSelfEmployed = status !== 'employed';

  return (
    <div>
      {/* Basic inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your working situation</h2>
        <p className="mt-1 text-sm text-gray-500">Tell us about your work-from-home setup.</p>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">Employment status</label>
          <div className="mt-1.5 flex gap-2">
            {([
              { value: 'sole-trader' as const, label: 'Sole Trader' },
              { value: 'limited-company' as const, label: 'Ltd Company Director' },
              { value: 'employed' as const, label: 'Employed' },
            ]).map((opt) => (
              <button key={opt.value} onClick={() => setStatus(opt.value)}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  status === opt.value
                    ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <InputField label="Hours working from home" hint="Per week, on average" value={hoursPerWeek} onChange={setHoursPerWeek} suffix="hrs/week" max={80} />
          <InputField label="Weeks per year" hint="Exclude holidays" value={weeksPerYear} onChange={setWeeksPerYear} suffix="weeks" max={52} />
        </div>
      </div>

      {/* Employed result — simple */}
      {!isSelfEmployed && (
        <div className="mt-8 rounded-xl border-2 border-brand-300 bg-brand-50 p-6 text-center">
          <p className="text-sm font-medium text-brand-700">Your WFH tax relief</p>
          <p className="mt-2 text-4xl font-bold text-brand-900">{formatGBP(result.employedAnnualClaim)}/year</p>
          <p className="mt-1 text-sm text-brand-600">£{result.employedWeeklyRate}/week flat rate &times; {weeksPerYear} weeks</p>
          <p className="mt-3 text-xs text-gray-500">
            Tax saving: {formatGBP(Math.round(result.employedAnnualClaim * 0.2))} (basic rate) to {formatGBP(Math.round(result.employedAnnualClaim * 0.4))} (higher rate)
          </p>
          <div className="mt-4 rounded-lg bg-white/60 p-3 text-left text-xs text-gray-600">
            <p className="font-medium text-gray-700">How to claim</p>
            <p className="mt-1">Apply via HMRC&apos;s online portal. You&apos;ll get a tax code adjustment — the saving comes through your PAYE automatically. No receipts needed.</p>
          </div>
        </div>
      )}

      {/* Self-employed: household costs for actual method */}
      {isSelfEmployed && (
        <>
          <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Your household costs</h2>
            <p className="mt-1 text-sm text-gray-500">
              Annual amounts. Used for the &ldquo;actual costs&rdquo; method comparison. Leave at defaults for a typical estimate.
            </p>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <InputField label="Mortgage/Rent" value={annualMortgageRent} onChange={setAnnualMortgageRent} prefix="£" suffix="/yr" />
              <InputField label="Council tax" value={annualCouncilTax} onChange={setAnnualCouncilTax} prefix="£" suffix="/yr" />
              <InputField label="Electricity" value={annualElectricity} onChange={setAnnualElectricity} prefix="£" suffix="/yr" />
              <InputField label="Gas/heating" value={annualGas} onChange={setAnnualGas} prefix="£" suffix="/yr" />
              <InputField label="Water" value={annualWater} onChange={setAnnualWater} prefix="£" suffix="/yr" />
              <InputField label="Broadband" value={annualBroadband} onChange={setAnnualBroadband} prefix="£" suffix="/yr" />
              <InputField label="Home insurance" value={annualInsurance} onChange={setAnnualInsurance} prefix="£" suffix="/yr" />
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <InputField label="Total rooms in home" hint="Exclude bathrooms, hallways, kitchens" value={totalRooms} onChange={setTotalRooms} suffix="rooms" min={1} max={20} />
              <InputField label="Rooms used for work" hint="Dedicated or mainly used for business" value={workRooms} onChange={setWorkRooms} suffix="rooms" min={0} max={totalRooms} />
            </div>
          </div>

          {/* Comparison results */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className={`rounded-xl border p-6 text-center ${result.betterMethod === 'simplified' ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
              <p className="text-sm font-medium text-gray-500">Simplified method</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{formatGBP(result.simplifiedAnnual)}/yr</p>
              <p className="mt-1 text-sm text-gray-500">£{result.simplifiedMonthlyRate}/month flat rate</p>
              <p className="mt-1 text-xs text-gray-400">
                Tax saving: {formatGBP(result.simplifiedTaxSaving20)} – {formatGBP(result.simplifiedTaxSaving40)}
              </p>
              {result.betterMethod === 'simplified' && (
                <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Better for you</span>
              )}
            </div>
            <div className={`rounded-xl border p-6 text-center ${result.betterMethod === 'actual' ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
              <p className="text-sm font-medium text-gray-500">Actual costs method</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{formatGBP(result.actualAnnualClaim)}/yr</p>
              <p className="mt-1 text-sm text-gray-500">{Math.round(result.roomProportion * 100)}% of {formatGBP(result.totalHouseholdCosts)}</p>
              <p className="mt-1 text-xs text-gray-400">
                Tax saving: {formatGBP(result.actualTaxSaving20)} – {formatGBP(result.actualTaxSaving40)}
              </p>
              {result.betterMethod === 'actual' && (
                <span className="mt-2 inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">Better for you</span>
              )}
            </div>
          </div>

          {/* Difference callout */}
          <div className={`mt-4 rounded-lg p-4 text-center text-sm ${
            result.difference > 50 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
          }`}>
            {result.difference <= 50 ? (
              'The two methods give a similar result. The simplified method is easier — no need to keep household bills.'
            ) : result.betterMethod === 'actual' ? (
              <>The actual costs method saves you an extra <strong>{formatGBP(result.difference)}/year</strong> in claims, but you&apos;ll need to keep records of your household bills.</>
            ) : (
              <>The simplified method is <strong>{formatGBP(result.difference)}/year better</strong> and much simpler — just track your working hours.</>
            )}
          </div>

          {/* Broadband note */}
          {result.broadbandClaim > 0 && (
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              <strong>Broadband:</strong> You can claim {formatGBP(result.broadbandClaim)}/year for business use of your broadband
              ({Math.round((result.broadbandClaim / annualBroadband) * 100)}% of your {formatGBP(annualBroadband)} annual cost).
              This applies whichever method you choose for other costs.
            </div>
          )}

          {/* Breakdown details */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Simplified method breakdown</h3>
              <p className="mt-1 text-xs text-gray-400">HMRC flat rates — no receipts needed</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly working hours</span>
                  <span className="font-medium">{result.monthlyHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">HMRC rate band</span>
                  <span className="font-medium">
                    {result.monthlyHours >= 101 ? '101+ hours' : result.monthlyHours >= 51 ? '51-100 hours' : result.monthlyHours >= 25 ? '25-50 hours' : 'Below 25 hours'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly allowance</span>
                  <span className="font-medium">£{result.simplifiedMonthlyRate}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium text-gray-900">Annual claim</span>
                  <span className="font-bold text-gray-900">{formatGBP(result.simplifiedAnnual)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-base font-semibold text-gray-900">Actual costs breakdown</h3>
              <p className="mt-1 text-xs text-gray-400">Proportion of real household bills</p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total household costs</span>
                  <span className="font-medium">{formatGBP(result.totalHouseholdCosts)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room proportion</span>
                  <span className="font-medium">{workRooms} of {totalRooms} rooms ({Math.round(result.roomProportion * 100)}%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Household portion</span>
                  <span className="font-medium">{formatGBP(Math.round(result.totalHouseholdCosts * result.roomProportion))}</span>
                </div>
                {result.broadbandClaim > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">+ Broadband</span>
                    <span className="font-medium">{formatGBP(result.broadbandClaim)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium text-gray-900">Annual claim</span>
                  <span className="font-bold text-gray-900">{formatGBP(result.actualAnnualClaim)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Practical tips */}
          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
            <h3 className="text-base font-semibold text-amber-900">Important notes</h3>
            <ul className="mt-2 space-y-1 text-sm text-amber-700">
              <li>&bull; <strong>Simplified method:</strong> Just track your hours. No need to calculate actual costs or keep utility bills.</li>
              <li>&bull; <strong>Actual costs:</strong> Keep all household bills and a log of hours worked. More admin, but often a bigger claim.</li>
              <li>&bull; You can switch methods between tax years, but must use one method for the whole year.</li>
              <li>&bull; <strong>Capital gains warning:</strong> If you have a room used <em>exclusively</em> for business, it may affect your principal private residence CGT exemption when you sell. Most freelancers share the room (e.g., spare bedroom with a desk) to avoid this.</li>
              <li>&bull; Phone bills: claim the business proportion separately (check your itemised bill).</li>
            </ul>
          </div>
        </>
      )}

      {/* Email capture */}
      <EmailCapture
        toolName="Working From Home Calculator"
        resultsSummary={isSelfEmployed
          ? `Simplified: ${formatGBP(result.simplifiedAnnual)}/yr | Actual: ${formatGBP(result.actualAnnualClaim)}/yr | Better: ${result.betterMethod}`
          : `WFH relief: ${formatGBP(result.employedAnnualClaim)}/yr (£${result.employedWeeklyRate}/week)`
        }
        resultsHtml={`
          <h2>Your Working From Home Allowance (${TAX_YEAR})</h2>
          ${isSelfEmployed ? `
            <p><strong>Simplified method:</strong> ${formatGBP(result.simplifiedAnnual)}/year (tax saving: ${formatGBP(result.simplifiedTaxSaving20)}-${formatGBP(result.simplifiedTaxSaving40)})</p>
            <p><strong>Actual costs method:</strong> ${formatGBP(result.actualAnnualClaim)}/year (tax saving: ${formatGBP(result.actualTaxSaving20)}-${formatGBP(result.actualTaxSaving40)})</p>
            <p><strong>Better option:</strong> ${result.betterMethod === 'actual' ? 'Actual costs' : 'Simplified'} method</p>
          ` : `
            <p><strong>Annual claim:</strong> ${formatGBP(result.employedAnnualClaim)}</p>
            <p>Apply via HMRC for a tax code adjustment.</p>
          `}
          <p style="color:#6b7280;font-size:12px">Calculated at freelancercalc.co.uk using ${TAX_YEAR} HMRC rates.</p>
        `}
      />

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Simplified rates: HMRC approved flat amounts based on hours worked from home. No receipts or calculations needed.</li>
          <li>Actual costs: proportion of household bills based on rooms used for work. Must keep records.</li>
          <li>Broadband is calculated separately at business use proportion (based on hours).</li>
          <li>Employed workers can claim £6/week flat rate via a tax code adjustment — no employer involvement needed.</li>
          <li>Room count excludes bathrooms, hallways, and kitchens (per HMRC guidance).</li>
          <li>Always consult an accountant for advice specific to your situation.</li>
        </ul>
      </div>
    </div>
  );
}
