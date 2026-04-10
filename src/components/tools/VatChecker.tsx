'use client';

import { useState, useMemo } from 'react';
import { calculateVat, FLAT_RATE_CATEGORIES, type VatResult } from '@/lib/vat';
import { formatGBP, TAX_YEAR } from '@/lib/tax';

function InputField({
  label, hint, value, onChange, prefix, suffix, min = 0,
}: {
  label: string; hint?: string; value: number; onChange: (v: number) => void;
  prefix?: string; suffix?: string; min?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
      <div className="relative mt-1.5">
        {prefix && <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{prefix}</span>}
        <input type="number" value={value || ''} onChange={(e) => onChange(Number(e.target.value) || 0)} min={min}
          className={`block w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none ${prefix ? 'pl-7' : 'pl-3'} ${suffix ? 'pr-12' : 'pr-3'}`}
        />
        {suffix && <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">{suffix}</span>}
      </div>
    </div>
  );
}

function ProgressBar({ percent }: { percent: number }) {
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500">
        <span>£0</span>
        <span>{formatGBP(90_000)} threshold</span>
      </div>
      <div className="mt-1 h-4 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-amber-500' : 'bg-brand-500'}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs font-medium text-gray-600">{percent}%</p>
    </div>
  );
}

function InfoCard({ title, children, variant = 'default' }: {
  title: string; children: React.ReactNode;
  variant?: 'default' | 'warning' | 'success' | 'danger';
}) {
  const styles = {
    default: 'border-gray-200 bg-white',
    warning: 'border-amber-300 bg-amber-50',
    success: 'border-green-300 bg-green-50',
    danger: 'border-red-300 bg-red-50',
  };
  return (
    <div className={`rounded-xl border p-6 ${styles[variant]}`}>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Row({ label, value, bold, indent }: { label: string; value: string; bold?: boolean; indent?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 ${bold ? 'border-t-2 border-gray-900 font-semibold' : ''} ${indent ? 'pl-4' : ''}`}>
      <span className={bold ? 'text-sm text-gray-900' : 'text-sm text-gray-600'}>{label}</span>
      <span className="text-sm tabular-nums text-gray-900">{value}</span>
    </div>
  );
}

export default function VatChecker() {
  const [monthlyRevenue, setMonthlyRevenue] = useState(6_000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(500);
  const [revenueToDate, setRevenueToDate] = useState(30_000);
  const [flatRateCategory, setFlatRateCategory] = useState('computer-it');
  const [clientType, setClientType] = useState<'b2b' | 'b2c' | 'mixed'>('b2b');

  const result: VatResult = useMemo(
    () => calculateVat({ monthlyRevenue, monthlyExpensesWithVat: monthlyExpenses, revenueToDate, flatRateCategory, clientType }),
    [monthlyRevenue, monthlyExpenses, revenueToDate, flatRateCategory, clientType]
  );

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your details</h2>
        <p className="mt-1 text-sm text-gray-500">Enter your current revenue figures. Results update instantly.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <InputField label="Monthly revenue" hint="Average monthly turnover" value={monthlyRevenue} onChange={setMonthlyRevenue} prefix="£" />
          <InputField label="Monthly VAT-able expenses" hint="Costs that include VAT (software, supplies, etc.)" value={monthlyExpenses} onChange={setMonthlyExpenses} prefix="£" />
          <InputField label="Revenue in last 12 months" hint="Rolling 12-month total turnover" value={revenueToDate} onChange={setRevenueToDate} prefix="£" />
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Your trade / profession</label>
            <p className="mt-0.5 text-xs text-gray-400">Used for Flat Rate Scheme percentage</p>
            <select value={flatRateCategory} onChange={(e) => setFlatRateCategory(e.target.value)}
              className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none">
              {FLAT_RATE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name} ({cat.rate}%)</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Who are your clients?</label>
            <p className="mt-0.5 text-xs text-gray-400">Affects whether voluntary registration makes sense</p>
            <div className="mt-1.5 flex gap-2">
              {[
                { value: 'b2b' as const, label: 'Businesses (B2B)' },
                { value: 'b2c' as const, label: 'Consumers (B2C)' },
                { value: 'mixed' as const, label: 'Both' },
              ].map((opt) => (
                <button key={opt.value} onClick={() => setClientType(opt.value)}
                  className={`flex-1 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                    clientType === opt.value
                      ? 'border-brand-500 bg-brand-50 font-medium text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Threshold status */}
      <div className="mt-8">
        <InfoCard title="VAT threshold status"
          variant={result.mustRegister ? 'danger' : result.percentOfThreshold >= 80 ? 'warning' : 'default'}>
          {result.mustRegister ? (
            <div>
              <p className="text-sm font-medium text-red-800">
                You must register for VAT. Your rolling 12-month revenue ({formatGBP(result.revenueToDate)})
                has exceeded the {formatGBP(result.threshold)} threshold.
              </p>
              <p className="mt-2 text-sm text-red-700">
                You must notify HMRC within 30 days of the end of the month in which you exceeded the threshold.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-700">
                <strong>{formatGBP(result.remainingBeforeThreshold)}</strong> remaining before the
                {' '}{formatGBP(result.threshold)} threshold.
              </p>
              {result.monthsUntilThreshold !== null && (
                <p className="mt-1 text-sm text-gray-600">
                  At {formatGBP(monthlyRevenue)}/month, you&apos;ll reach the threshold in
                  approximately <strong>{result.monthsUntilThreshold} month{result.monthsUntilThreshold !== 1 ? 's' : ''}</strong>.
                </p>
              )}
            </div>
          )}
          <ProgressBar percent={result.percentOfThreshold} />
        </InfoCard>
      </div>

      {/* Voluntary registration advice */}
      {!result.mustRegister && result.voluntaryRegReason && (
        <div className={`mt-4 rounded-lg p-4 text-sm ${
          result.voluntaryRegRecommended ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
        }`}>
          <p className="font-medium">{result.voluntaryRegRecommended ? 'Voluntary registration could benefit you' : 'Voluntary registration probably not worth it'}</p>
          <p className="mt-1 text-xs">{result.voluntaryRegReason}</p>
        </div>
      )}

      {/* Scheme comparison */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <InfoCard title="Standard VAT scheme">
          <div className="divide-y divide-gray-100">
            <Row label="VAT you'd charge clients (20%)" value={formatGBP(result.vatCollectedAnnual)} />
            <Row label="VAT you'd reclaim on expenses" value={`−${formatGBP(result.vatOnExpensesAnnual)}`} indent />
            <Row label="Net VAT owed to HMRC" value={formatGBP(result.netVatCostAnnual)} bold />
          </div>
          <p className="mt-3 text-xs text-gray-500">
            Effective cost: {result.effectiveCostPercent}% of your revenue. Requires tracking VAT on every invoice and expense.
          </p>
        </InfoCard>

        <InfoCard title={`Flat Rate Scheme (${result.flatRatePercent}%)`}
          variant={result.flatRateBetter ? 'success' : 'default'}>
          <div className="divide-y divide-gray-100">
            <Row label="Gross revenue inc. VAT" value={formatGBP(result.revenueWithVat)} />
            <Row label={`Flat rate: ${result.flatRatePercent}%`} value={formatGBP(result.flatRateVatDue)} indent />
            <Row label="Net VAT owed to HMRC" value={formatGBP(result.flatRateVatDue)} bold />
          </div>
          {result.flatRateBetter ? (
            <p className="mt-3 text-sm font-medium text-green-800">
              Saves {formatGBP(result.flatRateSaving)}/year vs standard scheme, and much simpler bookkeeping.
            </p>
          ) : (
            <p className="mt-3 text-sm text-gray-600">
              Standard scheme saves {formatGBP(Math.abs(result.flatRateSaving))}/year — your expenses are high enough to make it worthwhile.
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Rate shown for: {result.flatRateCategoryName}. You can&apos;t reclaim VAT on expenses under this scheme (except capital assets over £2,000).
          </p>
        </InfoCard>
      </div>

      {/* Pricing impact */}
      <div className="mt-8">
        <InfoCard title="Impact on your pricing">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Add VAT on top of current prices</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatGBP(result.revenueWithVat)}/year</p>
              <p className="mt-1 text-xs text-gray-500">
                Charge {formatGBP(Math.round(monthlyRevenue * 1.2))}/month instead of {formatGBP(monthlyRevenue)}.
                {clientType === 'b2b' && ' Your B2B clients reclaim the VAT, so it costs them nothing extra. Best option.'}
                {clientType === 'b2c' && ' Your consumers can\'t reclaim VAT — this is a real 20% price increase for them.'}
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Keep prices the same (absorb VAT)</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatGBP(result.revenueIfAbsorbVat)}/year</p>
              <p className="mt-1 text-xs text-gray-500">
                Your real revenue drops to {formatGBP(Math.round(monthlyRevenue / 1.2))}/month — a {formatGBP(Math.round(monthlyRevenue - monthlyRevenue / 1.2))}/month hit.
                {clientType === 'b2c' && ' May be necessary to stay competitive with non-VAT-registered competitors.'}
              </p>
            </div>
          </div>
        </InfoCard>
      </div>

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>VAT registration threshold is {formatGBP(90_000)} for {TAX_YEAR} (increased from £85,000 in April 2024).</li>
          <li>You must register if your rolling 12-month turnover exceeds the threshold, or you expect it to in the next 30 days alone.</li>
          <li>The Flat Rate Scheme lets you pay a fixed % of gross turnover instead of tracking VAT on every expense. Simpler but not always cheaper.</li>
          <li>First-year FRS discount: you get 1% off the flat rate in your first year of VAT registration (not shown here).</li>
          <li>Once registered, you can deregister if turnover drops below {formatGBP(88_000)}.</li>
          <li>Making Tax Digital (MTD) requires digital VAT records and online filing via compatible software.</li>
        </ul>
      </div>
    </div>
  );
}
