'use client';

import { useState, useMemo } from 'react';
import { calculateVat, type VatResult } from '@/lib/vat';
import { formatGBP, TAX_YEAR } from '@/lib/tax';

function InputField({
  label,
  hint,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
}: {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
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

function ProgressBar({ percent, warning }: { percent: number; warning: boolean }) {
  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs text-gray-500">
        <span>£0</span>
        <span>{formatGBP(90_000)} threshold</span>
      </div>
      <div className="mt-1 h-4 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percent >= 100 ? 'bg-red-500' : percent >= 80 ? 'bg-amber-500' : 'bg-brand-500'
          }`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs font-medium text-gray-600">{percent}%</p>
    </div>
  );
}

function InfoCard({
  title,
  children,
  variant = 'default',
}: {
  title: string;
  children: React.ReactNode;
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

  const result: VatResult = useMemo(
    () =>
      calculateVat({
        monthlyRevenue,
        monthlyExpensesWithVat: monthlyExpenses,
        monthsTrading: 0,
        revenueToDate,
      }),
    [monthlyRevenue, monthlyExpenses, revenueToDate]
  );

  return (
    <div>
      {/* Inputs */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Your details</h2>
        <p className="mt-1 text-sm text-gray-500">Enter your current revenue figures. Results update instantly.</p>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <InputField
            label="Monthly revenue"
            hint="Your average monthly turnover"
            value={monthlyRevenue}
            onChange={setMonthlyRevenue}
            prefix="£"
          />
          <InputField
            label="Monthly VAT-able expenses"
            hint="Costs that include VAT (software, supplies, etc.)"
            value={monthlyExpenses}
            onChange={setMonthlyExpenses}
            prefix="£"
          />
          <InputField
            label="Revenue in last 12 months"
            hint="Rolling 12-month total turnover"
            value={revenueToDate}
            onChange={setRevenueToDate}
            prefix="£"
          />
        </div>
      </div>

      {/* Threshold status */}
      <div className="mt-8">
        <InfoCard
          title="VAT threshold status"
          variant={result.mustRegister ? 'danger' : result.percentOfThreshold >= 80 ? 'warning' : 'default'}
        >
          {result.mustRegister ? (
            <div>
              <p className="text-sm font-medium text-red-800">
                You must register for VAT. Your rolling 12-month revenue ({formatGBP(result.revenueToDate)})
                has exceeded the {formatGBP(result.threshold)} threshold.
              </p>
              <p className="mt-2 text-sm text-red-700">
                You must notify HMRC within 30 days of the end of the month in which you exceeded the threshold.
                Registration takes effect from the start of the second month after exceeding it.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-700">
                <strong>{formatGBP(result.remainingBeforeThreshold)}</strong> remaining before you hit the
                {' '}{formatGBP(result.threshold)} VAT registration threshold.
              </p>
              {result.monthsUntilThreshold !== null && (
                <p className="mt-1 text-sm text-gray-600">
                  At your current rate of {formatGBP(monthlyRevenue)}/month, you&apos;ll reach the threshold in
                  approximately <strong>{result.monthsUntilThreshold} month{result.monthsUntilThreshold !== 1 ? 's' : ''}</strong>.
                </p>
              )}
            </div>
          )}
          <ProgressBar percent={result.percentOfThreshold} warning={result.percentOfThreshold >= 80} />
        </InfoCard>
      </div>

      {/* Impact analysis */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Standard VAT scheme */}
        <InfoCard title="Standard VAT scheme">
          <div className="divide-y divide-gray-100">
            <Row label="VAT you'd charge clients (20%)" value={formatGBP(result.vatCollectedAnnual)} />
            <Row label="VAT you'd reclaim on expenses" value={`−${formatGBP(result.vatOnExpensesAnnual)}`} indent />
            <Row label="Net VAT you'd owe HMRC" value={formatGBP(result.netVatCostAnnual)} bold />
          </div>
          <p className="mt-3 text-xs text-gray-500">
            This is {result.effectiveCostPercent}% of your revenue. You collect VAT from clients and pay
            the difference to HMRC after reclaiming VAT on your expenses.
          </p>
        </InfoCard>

        {/* Flat Rate Scheme */}
        <InfoCard
          title="Flat Rate Scheme"
          variant={result.flatRateSaving > 0 ? 'success' : 'default'}
        >
          <div className="divide-y divide-gray-100">
            <Row label="Gross revenue inc. VAT" value={formatGBP(result.revenueWithVat)} />
            <Row label={`Flat rate (${result.flatRatePercent}% — IT/consultancy)`} value={formatGBP(result.flatRateVatDue)} indent />
            <Row label="You'd owe HMRC" value={formatGBP(result.flatRateVatDue)} bold />
          </div>
          {result.flatRateSaving > 0 ? (
            <p className="mt-3 text-sm font-medium text-green-800">
              The Flat Rate Scheme would save you {formatGBP(result.flatRateSaving)}/year vs the standard scheme.
            </p>
          ) : (
            <p className="mt-3 text-sm text-gray-600">
              The standard scheme is better for you — you&apos;d pay {formatGBP(Math.abs(result.flatRateSaving))}/year less.
            </p>
          )}
          <p className="mt-2 text-xs text-gray-400">
            Flat rate % varies by trade. IT consultancy shown. You can&apos;t reclaim VAT on expenses under this scheme
            (except capital assets over £2,000).
          </p>
        </InfoCard>
      </div>

      {/* Pricing impact */}
      <div className="mt-8">
        <InfoCard title="Impact on your pricing">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Add VAT on top</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatGBP(result.revenueWithVat)}/year</p>
              <p className="mt-1 text-xs text-gray-500">
                Charge {formatGBP(monthlyRevenue * 1.2)}/month (current + 20%). Your B2B clients reclaim the VAT,
                so it costs them nothing extra. Best option for B2B work.
              </p>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-700">Absorb VAT (keep prices)</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{formatGBP(result.revenueIfAbsorbVat)}/year</p>
              <p className="mt-1 text-xs text-gray-500">
                Keep charging {formatGBP(monthlyRevenue)}/month but your real revenue drops to{' '}
                {formatGBP(Math.round(monthlyRevenue / 1.2))}/month. Only consider this for B2C work.
              </p>
            </div>
          </div>
        </InfoCard>
      </div>

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>VAT registration threshold is {formatGBP(90_000)} for {TAX_YEAR} (increased from £85,000 in April 2025).</li>
          <li>You must register if your rolling 12-month turnover exceeds the threshold, or you expect it to in the next 30 days alone.</li>
          <li>The Flat Rate Scheme lets you pay a fixed % of gross turnover instead of tracking VAT on every expense. Simpler but not always cheaper.</li>
          <li>Flat rate percentages vary by trade — we show IT/consultancy ({result.flatRatePercent}%) as it&apos;s the most common for freelancers.</li>
          <li>Once registered, you can deregister if turnover drops below {formatGBP(88_000)}.</li>
        </ul>
      </div>
    </div>
  );
}
