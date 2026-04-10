'use client';

import { useState, useMemo } from 'react';
import { calculateDayRate, type DayRateInput, type DayRateResult } from '@/lib/dayrate';
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
        <input
          type="number" value={value || ''} onChange={(e) => onChange(Number(e.target.value) || 0)}
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
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-8 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none">
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );
}

function StatCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-5 text-center ${highlight ? 'border-2 border-brand-300 bg-brand-50' : 'border-gray-200 bg-white'}`}>
      <p className={`text-sm font-medium ${highlight ? 'text-brand-700' : 'text-gray-500'}`}>{label}</p>
      <p className={`mt-1 text-2xl font-bold ${highlight ? 'text-brand-900' : 'text-gray-900'}`}>{value}</p>
      {sub && <p className={`mt-0.5 text-xs ${highlight ? 'text-brand-600' : 'text-gray-400'}`}>{sub}</p>}
    </div>
  );
}

function Row({ label, value, bold, indent, hint }: {
  label: string; value: string; bold?: boolean; indent?: boolean; hint?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-2 ${bold ? 'border-t-2 border-gray-900 font-semibold' : ''} ${indent ? 'pl-4' : ''}`}>
      <span className={bold ? 'text-sm text-gray-900' : 'text-sm text-gray-600'}>
        {label}
        {hint && <span className="ml-1 text-xs text-gray-400">({hint})</span>}
      </span>
      <span className={`text-sm tabular-nums ${bold ? 'font-semibold text-gray-900' : 'text-gray-900'}`}>{value}</span>
    </div>
  );
}

export default function DayRateCalculator() {
  const [mode, setMode] = useState<'salary-to-rate' | 'rate-to-salary'>('salary-to-rate');
  const [targetSalary, setTargetSalary] = useState(50_000);
  const [dayRate, setDayRate] = useState(400);
  const [holidayDays, setHolidayDays] = useState(25);
  const [sickDays, setSickDays] = useState(5);
  const [trainingDays, setTrainingDays] = useState(3);
  const [adminDaysPerMonth, setAdminDaysPerMonth] = useState(2);
  const [unpaidGapWeeks, setUnpaidGapWeeks] = useState(4);
  const [pensionPercent, setPensionPercent] = useState(5);
  const [insurance, setInsurance] = useState(500);
  const [accounting, setAccounting] = useState(1200);
  const [equipment, setEquipment] = useState(500);
  const [studentLoan, setStudentLoan] = useState<StudentLoanPlan>('none');
  const [structure, setStructure] = useState<'sole-trader' | 'limited-company'>('sole-trader');
  const [region, setRegion] = useState<TaxRegion>('england');
  const [hoursPerDay, setHoursPerDay] = useState(8);

  const result: DayRateResult = useMemo(() => {
    const input: DayRateInput = {
      mode, targetSalary, dayRate, holidayDays, sickDays, trainingDays, adminDaysPerMonth,
      unpaidGapWeeks, pensionPercent, insuranceCostAnnual: insurance,
      accountingCostAnnual: accounting, equipmentCostAnnual: equipment,
      studentLoan, structure, region, hoursPerDay,
    };
    return calculateDayRate(input);
  }, [mode, targetSalary, dayRate, holidayDays, sickDays, trainingDays, adminDaysPerMonth, unpaidGapWeeks, pensionPercent, insurance, accounting, equipment, studentLoan, structure, region, hoursPerDay]);

  return (
    <div>
      {/* Mode toggle */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex gap-2 rounded-lg bg-gray-100 p-1">
          <button onClick={() => setMode('salary-to-rate')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === 'salary-to-rate' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            Salary → Day Rate
          </button>
          <button onClick={() => setMode('rate-to-salary')}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === 'rate-to-salary' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            Day Rate → Take-Home
          </button>
        </div>

        <div className="mt-6">
          {mode === 'salary-to-rate' ? (
            <InputField label="Target equivalent salary" hint="The permanent salary you want to match in take-home pay" value={targetSalary} onChange={setTargetSalary} prefix="£" />
          ) : (
            <InputField label="Your day rate" hint="What you charge (or plan to charge) per day" value={dayRate} onChange={setDayRate} prefix="£" />
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <SelectField label="Business structure" value={structure}
            onChange={(v) => setStructure(v as 'sole-trader' | 'limited-company')}
            options={[{ value: 'sole-trader', label: 'Sole trader' }, { value: 'limited-company', label: 'Limited company' }]}
          />
          <SelectField label="Tax region" value={region}
            onChange={(v) => setRegion(v as TaxRegion)}
            options={[{ value: 'england', label: 'England/Wales/NI' }, { value: 'scotland', label: 'Scotland' }]}
          />
          <SelectField label="Student loan" value={studentLoan}
            onChange={(v) => setStudentLoan(v as StudentLoanPlan)}
            options={[
              { value: 'none', label: 'None' }, { value: 'plan1', label: 'Plan 1' },
              { value: 'plan2', label: 'Plan 2' }, { value: 'plan4', label: 'Plan 4 (Scotland)' },
              { value: 'plan5', label: 'Plan 5' }, { value: 'postgrad', label: 'Postgraduate' },
            ]}
          />
        </div>

        {/* Non-billable time */}
        <h3 className="mt-8 text-sm font-semibold text-gray-900">Non-billable time</h3>
        <p className="mt-0.5 text-xs text-gray-400">8 UK bank holidays added automatically. Every day here is a day without income.</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <InputField label="Holiday days" value={holidayDays} onChange={setHolidayDays} suffix="days" />
          <InputField label="Sick days" value={sickDays} onChange={setSickDays} suffix="days" />
          <InputField label="Training/CPD" value={trainingDays} onChange={setTrainingDays} suffix="days" />
          <InputField label="Admin/biz dev" hint="Per month" value={adminDaysPerMonth} onChange={setAdminDaysPerMonth} suffix="days/mo" />
          <InputField label="Contract gaps" value={unpaidGapWeeks} onChange={setUnpaidGapWeeks} suffix="weeks" />
        </div>

        {/* Business costs */}
        <h3 className="mt-8 text-sm font-semibold text-gray-900">Annual business costs</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <InputField label="Insurance" hint="PI, public liability" value={insurance} onChange={setInsurance} prefix="£" />
          <InputField label="Accountant" value={accounting} onChange={setAccounting} prefix="£" />
          <InputField label="Equipment/software" value={equipment} onChange={setEquipment} prefix="£" />
          <InputField label="Pension" hint="% of profit" value={pensionPercent} onChange={setPensionPercent} suffix="%" max={100} />
          <InputField label="Hours per day" hint="For hourly rate" value={hoursPerDay} onChange={setHoursPerDay} suffix="hrs" min={1} max={24} />
        </div>
      </div>

      {/* Key results */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard highlight
          label={mode === 'salary-to-rate' ? 'Required Day Rate' : 'Your Day Rate'}
          value={`${formatGBP(result.requiredDayRate)}/day`}
          sub={`${formatGBP(result.hourlyRate)}/hour`}
        />
        <StatCard label="Annual take-home" value={formatGBP(result.annualTakeHome)}
          sub={`${formatGBP(result.monthlyTakeHome)}/month`} />
        <StatCard label="Billable days" value={`${result.billableDays}`}
          sub={`of ${result.totalWeekdays} weekdays`} />
        <StatCard label="Effective tax rate" value={`${result.effectiveTaxRate}%`}
          sub="inc. all costs" />
        <StatCard label="Equiv. perm salary" value={formatGBP(result.equivalentPermSalary)}
          sub="same take-home" />
      </div>

      {/* Perm salary comparison */}
      <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
        <p>
          <strong>What this means:</strong> At {formatGBP(result.requiredDayRate)}/day, your take-home
          matches a {formatGBP(result.equivalentPermSalary)} permanent salary.
          {result.upliftRequired > 0 && (
            <> Your gross revenue ({formatGBP(result.annualGrossRevenue)}) is {result.upliftRequired}% higher
            because you&apos;re covering what an employer normally pays: holidays ({result.holidayDays + result.bankHolidays} days),
            sick pay, pension, employer NICs, insurance, and gaps between contracts.</>
          )}
        </p>
        <p className="mt-2 text-xs text-blue-600">
          Remember: a perm role also typically includes employer pension (3-10%), private healthcare, training budget,
          and job security — worth roughly {formatGBP(result.permBenefitsValue)}/year on top of salary.
          Factor this in when comparing offers.
        </p>
      </div>

      {/* Detailed breakdowns */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Working days</h3>
          <div className="mt-4 divide-y divide-gray-100">
            <Row label="Total weekdays in year" value="260" />
            <Row label="Holiday days" value={`−${result.holidayDays}`} indent />
            <Row label="Bank holidays" value={`−${result.bankHolidays}`} indent />
            <Row label="Sick days" value={`−${result.sickDays}`} indent />
            <Row label="Training/CPD" value={`−${result.trainingDays}`} indent />
            <Row label="Admin & business development" value={`−${result.adminDays}`} indent hint={`${adminDaysPerMonth} days/month`} />
            <Row label="Contract gaps" value={`−${result.gapDays}`} indent hint={`${unpaidGapWeeks} weeks`} />
            <Row label="Billable days" value={`${result.billableDays}`} bold />
          </div>
          <p className="mt-3 text-xs text-gray-400">
            A permanent employee with 25 days holiday works ~227 billable days. You&apos;re working {result.billableDays} — {result.billableDays < 227 ? 'fewer' : 'more'} days,
            but each day must also cover the non-billable time.
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-900">Financial breakdown</h3>
          <div className="mt-4 divide-y divide-gray-100">
            <Row label="Gross revenue" value={formatGBP(result.annualGrossRevenue)} hint={`${result.billableDays} × ${formatGBP(result.requiredDayRate)}`} />
            <Row label="Business costs" value={`−${formatGBP(result.businessCosts)}`} indent />
            {result.pensionContribution > 0 && <Row label="Pension contribution" value={`−${formatGBP(result.pensionContribution)}`} indent />}
            <Row label="Taxable income" value={formatGBP(result.taxableIncome)} bold />
            <Row label="Income tax" value={`−${formatGBP(result.incomeTax)}`} indent hint={region === 'scotland' ? 'Scottish rates' : undefined} />
            <Row label="National Insurance" value={`−${formatGBP(result.nationalInsurance)}`} indent />
            {result.corporationTax > 0 && <Row label="Corporation tax" value={`−${formatGBP(result.corporationTax)}`} indent />}
            {result.dividendTax > 0 && <Row label="Dividend tax" value={`−${formatGBP(result.dividendTax)}`} indent />}
            {result.studentLoan > 0 && <Row label="Student loan" value={`−${formatGBP(result.studentLoan)}`} indent />}
            <Row label="Annual take-home" value={formatGBP(result.annualTakeHome)} bold />
          </div>
        </div>
      </div>

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Based on HMRC {TAX_YEAR} tax rates{region === 'scotland' ? ' (Scottish income tax bands)' : ''}. 8 UK bank holidays included automatically.</li>
          <li>&ldquo;Salary → Day Rate&rdquo; finds the day rate giving the same take-home as the equivalent permanent salary.</li>
          <li>Admin/business development time accounts for invoicing, proposals, marketing, and non-client work.</li>
          <li>The equivalent permanent salary comparison accounts for income tax and employee NICs. It does not include employer pension, healthcare, or other benefits.</li>
          <li>Hourly rate = day rate ÷ {hoursPerDay} hours.</li>
        </ul>
      </div>
    </div>
  );
}
