import {
  incomeTax,
  class4NICs,
  class1EmployeeNICs,
  class1EmployerNICs,
  corporationTax,
  dividendTax,
  NI2_ANNUAL,
  PERSONAL_ALLOWANCE,
  type StudentLoanPlan,
  type TaxRegion,
  studentLoanRepayment,
} from './tax';

export interface DayRateInput {
  mode: 'salary-to-rate' | 'rate-to-salary';
  targetSalary?: number;
  dayRate?: number;
  holidayDays: number;
  sickDays: number;
  trainingDays: number;
  adminDaysPerMonth: number; // non-billable admin/biz dev days per month
  unpaidGapWeeks: number;
  pensionPercent: number;
  insuranceCostAnnual: number;
  accountingCostAnnual: number;
  equipmentCostAnnual: number;
  studentLoan: StudentLoanPlan;
  structure: 'sole-trader' | 'limited-company';
  region: TaxRegion;
  hoursPerDay: number;
}

export interface DayRateResult {
  totalWeekdays: number;
  holidayDays: number;
  bankHolidays: number;
  sickDays: number;
  trainingDays: number;
  adminDays: number;
  gapDays: number;
  billableDays: number;

  requiredDayRate: number;
  hourlyRate: number;
  annualGrossRevenue: number;
  businessCosts: number;
  pensionContribution: number;
  taxableIncome: number;
  incomeTax: number;
  nationalInsurance: number;
  studentLoan: number;
  corporationTax: number;
  dividendTax: number;
  totalDeductions: number;
  annualTakeHome: number;
  monthlyTakeHome: number;
  weeklyTakeHome: number;
  effectiveTaxRate: number;

  equivalentPermSalary: number;
  permTakeHome: number;
  upliftRequired: number;

  // Perm comparison breakdown
  permBenefitsValue: number; // estimated value of perm benefits
}

const WEEKDAYS_PER_YEAR = 260;
const BANK_HOLIDAYS = 8;
const ESTIMATED_PERM_BENEFITS_PERCENT = 0.15; // employer pension, benefits ~15% on top

export function calculateDayRate(input: DayRateInput): DayRateResult {
  const gapDays = input.unpaidGapWeeks * 5;
  const adminDays = Math.round(input.adminDaysPerMonth * 12);
  const nonBillableDays = input.holidayDays + input.sickDays + input.trainingDays + adminDays + gapDays + BANK_HOLIDAYS;
  const billableDays = Math.max(1, WEEKDAYS_PER_YEAR - nonBillableDays);
  const businessCosts = input.insuranceCostAnnual + input.accountingCostAnnual + input.equipmentCostAnnual;

  if (input.mode === 'salary-to-rate') {
    return calculateFromSalary(input, billableDays, businessCosts, gapDays, adminDays);
  }
  return calculateFromRate(input.dayRate!, input, billableDays, businessCosts, gapDays, adminDays);
}

function calculateFromRate(
  dayRate: number, input: DayRateInput, billableDays: number,
  businessCosts: number, gapDays: number, adminDays: number,
): DayRateResult {
  const annualGross = dayRate * billableDays;
  const profit = annualGross - businessCosts;
  const pensionContribution = Math.round(Math.max(0, profit) * (input.pensionPercent / 100));
  const taxableIncome = Math.max(0, profit - pensionContribution);

  const taxResult = input.structure === 'sole-trader'
    ? calcSoleTraderTax(taxableIncome, input.studentLoan, input.region)
    : calcLtdCompanyTax(taxableIncome, input.studentLoan, input.region);

  const takeHome = taxableIncome - taxResult.totalTax;
  const totalDeductions = taxResult.totalTax + pensionContribution + businessCosts;

  const { equivalentPermSalary, permTakeHome } = calcPermEquivalent(takeHome, input.studentLoan, input.region);
  const permBenefitsValue = Math.round(equivalentPermSalary * ESTIMATED_PERM_BENEFITS_PERCENT);

  return {
    totalWeekdays: WEEKDAYS_PER_YEAR,
    holidayDays: input.holidayDays,
    bankHolidays: BANK_HOLIDAYS,
    sickDays: input.sickDays,
    trainingDays: input.trainingDays,
    adminDays,
    gapDays,
    billableDays,
    requiredDayRate: dayRate,
    hourlyRate: Math.round((dayRate / input.hoursPerDay) * 100) / 100,
    annualGrossRevenue: annualGross,
    businessCosts,
    pensionContribution,
    taxableIncome,
    incomeTax: taxResult.incomeTax,
    nationalInsurance: taxResult.ni,
    studentLoan: taxResult.studentLoan,
    corporationTax: taxResult.corpTax,
    dividendTax: taxResult.divTax,
    totalDeductions,
    annualTakeHome: Math.round(takeHome * 100) / 100,
    monthlyTakeHome: Math.round(takeHome / 12),
    weeklyTakeHome: Math.round(takeHome / 52),
    effectiveTaxRate: annualGross > 0
      ? Math.round(((totalDeductions - pensionContribution) / annualGross) * 1000) / 10 : 0,
    equivalentPermSalary,
    permTakeHome,
    upliftRequired: equivalentPermSalary > 0
      ? Math.round(((annualGross / equivalentPermSalary - 1) * 100) * 10) / 10 : 0,
    permBenefitsValue,
  };
}

function calculateFromSalary(
  input: DayRateInput, billableDays: number,
  businessCosts: number, gapDays: number, adminDays: number,
): DayRateResult {
  const targetSalary = input.targetSalary!;

  const permIT = incomeTax(targetSalary, input.region);
  const permNI = class1EmployeeNICs(targetSalary);
  const permSL = studentLoanRepayment(targetSalary, input.studentLoan);
  const permTakeHome = targetSalary - permIT - permNI - permSL;

  let grossRevenue = targetSalary * 1.4;

  for (let i = 0; i < 100; i++) {
    const profit = grossRevenue - businessCosts;
    const pension = Math.round(Math.max(0, profit) * (input.pensionPercent / 100));
    const taxable = Math.max(0, profit - pension);

    const taxResult = input.structure === 'sole-trader'
      ? calcSoleTraderTax(taxable, input.studentLoan, input.region)
      : calcLtdCompanyTax(taxable, input.studentLoan, input.region);

    const takeHome = taxable - taxResult.totalTax;
    const diff = takeHome - permTakeHome;

    if (Math.abs(diff) < 1) break;
    grossRevenue -= diff * 0.6;
    if (grossRevenue < 0) { grossRevenue = 0; break; }
  }

  const dayRate = Math.ceil(grossRevenue / billableDays);
  const result = calculateFromRate(dayRate, input, billableDays, businessCosts, gapDays, adminDays);

  return { ...result, equivalentPermSalary: targetSalary, permTakeHome };
}

interface TaxBreakdown {
  incomeTax: number;
  ni: number;
  studentLoan: number;
  corpTax: number;
  divTax: number;
  totalTax: number;
}

function calcSoleTraderTax(taxableIncome: number, sl: StudentLoanPlan, region: TaxRegion): TaxBreakdown {
  const it = incomeTax(taxableIncome, region);
  const ni = class4NICs(taxableIncome) + (taxableIncome > 0 ? NI2_ANNUAL : 0);
  const slRepay = studentLoanRepayment(taxableIncome, sl);
  return { incomeTax: it, ni, studentLoan: slRepay, corpTax: 0, divTax: 0, totalTax: it + ni + slRepay };
}

function calcLtdCompanyTax(taxableIncome: number, sl: StudentLoanPlan, region: TaxRegion): TaxBreakdown {
  const salary = Math.min(PERSONAL_ALLOWANCE, taxableIncome);
  const employerNI = class1EmployerNICs(salary);
  const companyProfit = Math.max(0, taxableIncome - salary - employerNI);
  const ct = corporationTax(companyProfit);
  const dividends = companyProfit - ct;

  const salaryIT = incomeTax(salary, region);
  const salaryNI = class1EmployeeNICs(salary);
  const dt = dividendTax(dividends, salary, region);
  const slRepay = studentLoanRepayment(salary + dividends, sl);

  return {
    incomeTax: salaryIT, ni: salaryNI + employerNI, studentLoan: slRepay,
    corpTax: ct, divTax: dt,
    totalTax: salaryIT + salaryNI + employerNI + ct + dt + slRepay,
  };
}

function calcPermEquivalent(
  freelancerTakeHome: number, sl: StudentLoanPlan, region: TaxRegion,
): { equivalentPermSalary: number; permTakeHome: number } {
  let low = 0;
  let high = freelancerTakeHome * 2.5;

  for (let i = 0; i < 80; i++) {
    const mid = (low + high) / 2;
    const takeHome = mid - incomeTax(mid, region) - class1EmployeeNICs(mid) - studentLoanRepayment(mid, sl);

    if (Math.abs(takeHome - freelancerTakeHome) < 1) {
      return { equivalentPermSalary: Math.round(mid), permTakeHome: Math.round(takeHome) };
    }
    if (takeHome < freelancerTakeHome) low = mid;
    else high = mid;
  }

  const mid = (low + high) / 2;
  return {
    equivalentPermSalary: Math.round(mid),
    permTakeHome: Math.round(mid - incomeTax(mid, region) - class1EmployeeNICs(mid) - studentLoanRepayment(mid, sl)),
  };
}
