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
  studentLoanRepayment,
} from './tax';

export interface DayRateInput {
  mode: 'salary-to-rate' | 'rate-to-salary';
  targetSalary?: number;
  dayRate?: number;
  holidayDays: number;
  sickDays: number;
  trainingDays: number;
  unpaidGapWeeks: number;
  pensionPercent: number;
  insuranceCostAnnual: number;
  accountingCostAnnual: number;
  equipmentCostAnnual: number;
  studentLoan: StudentLoanPlan;
  structure: 'sole-trader' | 'limited-company';
}

export interface DayRateResult {
  totalWeekdays: number;
  holidayDays: number;
  sickDays: number;
  trainingDays: number;
  gapDays: number;
  billableDays: number;

  requiredDayRate: number;
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
  effectiveTaxRate: number;

  equivalentPermSalary: number;
  permTakeHome: number;
  upliftRequired: number;
}

const WEEKDAYS_PER_YEAR = 260;
const BANK_HOLIDAYS = 8;

export function calculateDayRate(input: DayRateInput): DayRateResult {
  const gapDays = input.unpaidGapWeeks * 5;
  const nonBillableDays = input.holidayDays + input.sickDays + input.trainingDays + gapDays + BANK_HOLIDAYS;
  const billableDays = Math.max(1, WEEKDAYS_PER_YEAR - nonBillableDays);
  const businessCosts = input.insuranceCostAnnual + input.accountingCostAnnual + input.equipmentCostAnnual;

  if (input.mode === 'salary-to-rate') {
    return calculateFromSalary(input, billableDays, businessCosts, gapDays);
  }
  return calculateFromRate(input.dayRate!, input, billableDays, businessCosts, gapDays);
}

/** Calculate take-home from a given day rate */
function calculateFromRate(
  dayRate: number,
  input: DayRateInput,
  billableDays: number,
  businessCosts: number,
  gapDays: number,
): DayRateResult {
  const annualGross = dayRate * billableDays;
  const profit = annualGross - businessCosts;
  const pensionContribution = Math.round(Math.max(0, profit) * (input.pensionPercent / 100));
  const taxableIncome = Math.max(0, profit - pensionContribution);

  const taxResult = input.structure === 'sole-trader'
    ? calcSoleTraderTax(taxableIncome, input.studentLoan)
    : calcLtdCompanyTax(taxableIncome, input.studentLoan);

  const takeHome = taxableIncome - taxResult.totalTax;
  const totalDeductions = taxResult.totalTax + pensionContribution + businessCosts;

  const { equivalentPermSalary, permTakeHome } = calcPermEquivalent(takeHome, input.studentLoan);

  return {
    totalWeekdays: WEEKDAYS_PER_YEAR,
    holidayDays: input.holidayDays + BANK_HOLIDAYS,
    sickDays: input.sickDays,
    trainingDays: input.trainingDays,
    gapDays,
    billableDays,
    requiredDayRate: dayRate,
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
    monthlyTakeHome: Math.round((takeHome / 12) * 100) / 100,
    effectiveTaxRate: annualGross > 0
      ? Math.round(((totalDeductions - pensionContribution) / annualGross) * 1000) / 10
      : 0,
    equivalentPermSalary,
    permTakeHome,
    upliftRequired: equivalentPermSalary > 0
      ? Math.round(((annualGross / equivalentPermSalary - 1) * 100) * 10) / 10
      : 0,
  };
}

/** Work backwards from a target perm salary to find the required day rate */
function calculateFromSalary(
  input: DayRateInput,
  billableDays: number,
  businessCosts: number,
  gapDays: number,
): DayRateResult {
  const targetSalary = input.targetSalary!;

  // What does a perm employee take home at this salary?
  const permIT = incomeTax(targetSalary);
  const permNI = class1EmployeeNICs(targetSalary);
  const permSL = studentLoanRepayment(targetSalary, input.studentLoan);
  const permTakeHome = targetSalary - permIT - permNI - permSL;

  // Iteratively find the gross revenue that gives the same take-home as freelancer
  let grossRevenue = targetSalary * 1.4;

  for (let i = 0; i < 80; i++) {
    const profit = grossRevenue - businessCosts;
    const pension = Math.round(Math.max(0, profit) * (input.pensionPercent / 100));
    const taxable = Math.max(0, profit - pension);

    const taxResult = input.structure === 'sole-trader'
      ? calcSoleTraderTax(taxable, input.studentLoan)
      : calcLtdCompanyTax(taxable, input.studentLoan);

    const takeHome = taxable - taxResult.totalTax;
    const diff = takeHome - permTakeHome;

    if (Math.abs(diff) < 1) break;
    grossRevenue -= diff * 0.7;
  }

  const dayRate = Math.ceil(grossRevenue / billableDays);

  // Recalculate forward with the rounded day rate
  const result = calculateFromRate(dayRate, input, billableDays, businessCosts, gapDays);

  return {
    ...result,
    equivalentPermSalary: targetSalary,
    permTakeHome,
  };
}

interface TaxBreakdown {
  incomeTax: number;
  ni: number;
  studentLoan: number;
  corpTax: number;
  divTax: number;
  totalTax: number;
}

function calcSoleTraderTax(taxableIncome: number, sl: StudentLoanPlan): TaxBreakdown {
  const it = incomeTax(taxableIncome);
  const ni = class4NICs(taxableIncome) + (taxableIncome > 0 ? NI2_ANNUAL : 0);
  const slRepay = studentLoanRepayment(taxableIncome, sl);
  return { incomeTax: it, ni, studentLoan: slRepay, corpTax: 0, divTax: 0, totalTax: it + ni + slRepay };
}

function calcLtdCompanyTax(taxableIncome: number, sl: StudentLoanPlan): TaxBreakdown {
  const salary = Math.min(PERSONAL_ALLOWANCE, taxableIncome);
  const employerNI = class1EmployerNICs(salary);
  const companyProfit = Math.max(0, taxableIncome - salary - employerNI);
  const ct = corporationTax(companyProfit);
  const dividends = companyProfit - ct;

  const salaryIT = incomeTax(salary);
  const salaryNI = class1EmployeeNICs(salary);
  const dt = dividendTax(dividends, salary);
  const slRepay = studentLoanRepayment(salary + dividends, sl);

  return {
    incomeTax: salaryIT,
    ni: salaryNI + employerNI,
    studentLoan: slRepay,
    corpTax: ct,
    divTax: dt,
    totalTax: salaryIT + salaryNI + employerNI + ct + dt + slRepay,
  };
}

function calcPermEquivalent(
  freelancerTakeHome: number,
  sl: StudentLoanPlan,
): { equivalentPermSalary: number; permTakeHome: number } {
  let low = 0;
  let high = freelancerTakeHome * 2.5;

  for (let i = 0; i < 60; i++) {
    const mid = (low + high) / 2;
    const takeHome = mid - incomeTax(mid) - class1EmployeeNICs(mid) - studentLoanRepayment(mid, sl);

    if (Math.abs(takeHome - freelancerTakeHome) < 1) {
      return { equivalentPermSalary: Math.round(mid), permTakeHome: Math.round(takeHome) };
    }
    if (takeHome < freelancerTakeHome) low = mid;
    else high = mid;
  }

  const mid = (low + high) / 2;
  return {
    equivalentPermSalary: Math.round(mid),
    permTakeHome: Math.round(mid - incomeTax(mid) - class1EmployeeNICs(mid) - studentLoanRepayment(mid, sl)),
  };
}
