'use client';

import { useState, useMemo } from 'react';
import { calculateMileage, type MileageResult, type VehicleType } from '@/lib/mileage';
import { formatGBP, TAX_YEAR, type TaxRegion } from '@/lib/tax';
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
        <input type="number" value={value || ''} onChange={(e) => onChange(Number(e.target.value) || 0)}
          min={min} max={max} step={step}
          className={`block w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-14' : 'pr-3'}`}
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">{suffix}</span>}
      </div>
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

export default function MileageCalculator() {
  const [vehicleType, setVehicleType] = useState<VehicleType>('car');
  const [annualMiles, setAnnualMiles] = useState(5_000);
  const [passengers, setPassengers] = useState(0);
  const [fuelCost, setFuelCost] = useState(1.45);
  const [mpg, setMpg] = useState(40);
  const [insurance, setInsurance] = useState(600);
  const [maintenance, setMaintenance] = useState(400);
  const [roadTax, setRoadTax] = useState(180);
  const [region, setRegion] = useState<TaxRegion>('england');

  const result: MileageResult = useMemo(
    () => calculateMileage({
      vehicleType, annualBusinessMiles: annualMiles, passengers,
      fuelCostPerLitre: fuelCost, mpg, annualInsurance: insurance,
      annualMaintenance: maintenance, annualRoadTax: roadTax, region,
    }),
    [vehicleType, annualMiles, passengers, fuelCost, mpg, insurance, maintenance, roadTax, region]
  );

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your vehicle details</h2>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Vehicle type</label>
          <div className="mt-1.5 flex gap-2">
            {([
              { value: 'car' as const, label: 'Car/van' },
              { value: 'motorcycle' as const, label: 'Motorcycle' },
              { value: 'bicycle' as const, label: 'Bicycle' },
            ]).map((opt) => (
              <button key={opt.value} onClick={() => setVehicleType(opt.value)}
                className={`flex-1 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                  vehicleType === opt.value ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>{opt.label}</button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <InputField label="Annual business miles" hint="Only journeys with a business purpose" value={annualMiles} onChange={setAnnualMiles} suffix="miles" />
          {vehicleType === 'car' && (
            <InputField label="Business passengers" hint="Average passengers per journey (0 if solo)" value={passengers} onChange={setPassengers} suffix="people" max={4} />
          )}
        </div>

        {vehicleType === 'car' && (
          <>
            <h3 className="mt-8 text-sm font-semibold text-gray-900">For actual cost comparison</h3>
            <p className="mt-0.5 text-xs text-gray-400">Optional — used to compare simplified vs actual cost method</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InputField label="Fuel cost" value={fuelCost} onChange={setFuelCost} prefix="£" suffix="/litre" step={0.01} />
              <InputField label="Fuel efficiency" value={mpg} onChange={setMpg} suffix="mpg" />
              <InputField label="Annual insurance" value={insurance} onChange={setInsurance} prefix="£" />
              <InputField label="Annual maintenance" value={maintenance} onChange={setMaintenance} prefix="£" />
            </div>
          </>
        )}
      </div>

      {/* Key results */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border-2 border-brand-300 bg-brand-50 p-5 text-center">
          <p className="text-sm font-medium text-brand-700">Your annual claim</p>
          <p className="text-3xl font-bold text-brand-900">{formatGBP(result.totalHmrcClaim)}</p>
          <p className="text-xs text-brand-600">HMRC simplified method</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm font-medium text-gray-500">Tax saving</p>
          <p className="text-2xl font-bold text-gray-900">{formatGBP(result.taxSaving20)} – {formatGBP(result.taxSaving40)}</p>
          <p className="text-xs text-gray-400">basic to higher rate</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 text-center">
          <p className="text-sm font-medium text-gray-500">Per mile</p>
          <p className="text-2xl font-bold text-gray-900">{result.hmrcPerMile}p</p>
          <p className="text-xs text-gray-400">{result.monthlyMiles} miles/month</p>
        </div>
      </div>

      {/* HMRC rates breakdown */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-gray-900">HMRC simplified mileage claim</h3>
        <div className="mt-4 divide-y divide-gray-100">
          {vehicleType === 'car' ? (
            <>
              <Row label="First 10,000 miles" value={formatGBP(result.hmrcClaimFirst10k)} hint="45p/mile" />
              {result.hmrcClaimAbove10k > 0 && (
                <Row label="Miles above 10,000" value={formatGBP(result.hmrcClaimAbove10k)} hint="25p/mile" indent />
              )}
              {result.hmrcPassengerClaim > 0 && (
                <Row label="Passenger supplement" value={formatGBP(result.hmrcPassengerClaim)} hint="5p/mile per passenger" indent />
              )}
            </>
          ) : (
            <Row label="All business miles" value={formatGBP(result.hmrcClaimFirst10k)} hint={vehicleType === 'motorcycle' ? '24p/mile' : '20p/mile'} />
          )}
          <Row label="Total claim" value={formatGBP(result.totalHmrcClaim)} bold />
        </div>
      </div>

      {/* Actual cost comparison (cars only) */}
      {vehicleType === 'car' && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Actual cost method comparison</h3>
          <p className="mt-1 text-sm text-gray-500">
            You can claim actual vehicle costs (business proportion) instead of simplified rates — but not both.
          </p>
          <div className="mt-4 divide-y divide-gray-100">
            <Row label="Fuel (business proportion)" value={formatGBP(result.fuelCost)} indent />
            <Row label="Insurance (business proportion)" value={formatGBP(result.insuranceProportion)} indent />
            <Row label="Maintenance (business proportion)" value={formatGBP(result.maintenanceProportion)} indent />
            <Row label="Road tax (business proportion)" value={formatGBP(result.roadTaxProportion)} indent />
            <Row label="Total actual cost" value={formatGBP(result.totalActualCost)} bold />
          </div>

          <div className={`mt-4 rounded-lg p-3 text-sm font-medium ${
            result.simplifiedBetter ? 'bg-green-50 text-green-800' : 'bg-amber-50 text-amber-800'
          }`}>
            {result.simplifiedBetter ? (
              <>The simplified method saves you <strong>{formatGBP(result.difference)}/year</strong> more. Use HMRC mileage rates.</>
            ) : (
              <>Actual costs save you <strong>{formatGBP(result.difference)}/year</strong> more — but require keeping all receipts and calculating proportions. Most freelancers find simplified rates easier.</>
            )}
          </div>
        </div>
      )}

      {/* Important rules */}
      <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6">
        <h3 className="text-base font-semibold text-amber-900">Important: what counts as business mileage</h3>
        <div className="mt-2 space-y-2 text-sm text-amber-800">
          <p><strong>Business mileage includes:</strong> Driving to client meetings, visiting suppliers, going to a temporary workplace, attending conferences.</p>
          <p><strong>NOT business mileage:</strong> Commuting between your home and a regular workplace. If you work from the same office every day, driving there is commuting — not a business expense.</p>
          <p><strong>Working from home exception:</strong> If your home IS your regular workplace (no separate office), travel to client sites IS business mileage.</p>
          <p><strong>Keep a mileage log:</strong> Record the date, destination, purpose, and miles for every business journey. HMRC can ask for this.</p>
        </div>
      </div>

      {/* Email capture */}
      <EmailCapture
        toolName="Mileage Allowance Calculator"
        resultsSummary={`Annual claim: ${formatGBP(result.totalHmrcClaim)} | Tax saving: ${formatGBP(result.taxSaving20)}-${formatGBP(result.taxSaving40)} | ${annualMiles.toLocaleString()} miles`}
        resultsHtml={`
          <h2>Your Mileage Allowance Calculation (${TAX_YEAR})</h2>
          <p><strong>Annual business miles:</strong> ${annualMiles.toLocaleString()}</p>
          <p><strong>HMRC claim:</strong> ${formatGBP(result.totalHmrcClaim)}</p>
          <p><strong>Tax saving:</strong> ${formatGBP(result.taxSaving20)} (basic rate) to ${formatGBP(result.taxSaving40)} (higher rate)</p>
          <p style="color:#6b7280;font-size:12px">Calculated at freelancercalc.co.uk using ${TAX_YEAR} HMRC mileage rates.</p>
        `}
      />

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>HMRC approved mileage rates: cars 45p/mile (first 10,000), then 25p/mile. Motorcycles 24p/mile. Bicycles 20p/mile.</li>
          <li>Passenger supplement: 5p/mile per passenger on a business journey (cars only).</li>
          <li>You must choose ONE method per vehicle per year — simplified OR actual costs, not both.</li>
          <li>Actual cost proportion based on business miles ÷ total miles (assumed 10,000 personal miles for comparison).</li>
          <li>Tax saving is the reduction in your tax bill from claiming the expense. Depends on your marginal rate.</li>
        </ul>
      </div>
    </div>
  );
}
