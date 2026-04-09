import {
  incomeTax,
  class4NICs,
  class1EmployeeNICs,
  class1EmployerNICs,
  corporationTax,
  dividendTax,
  studentLoanRepayment,
  NI2_ANNUAL,
  NI1_EMPLOYER_THRESHOLD,
  EMPLOYMENT_ALLOWANCE,
  type StudentLoanPlan,
} from './tax';

export interface TakeHomeInput {
  annualRevenue: number;
  annualExpenses: number;
  studentLoan: StudentLoanPlan;
  pensionPercent: number; // % of profits to contribute to pension
}

export interface SoleTraderResult {
  revenue: number;
  expenses: number;
  profit: number;
  pensionContribution: number;
  taxableProfit: number;
  incomeTax: number;
  class4NICs: number;
  class2NICs: number;
  studentLoan: number;
  totalDeductions: number;
  takeHome: number;
  effectiveTaxRate: number;
}

export interface LtdCompanyResult {
  revenue: number;
  expenses: number;
  grossProfit: number;
  optimalSalary: number;
  employerNICs: number;
  pensionContribution: number;
  corporationTaxableProfit: number;
  corporationTax: number;
  retainedProfit: number;
  dividends: number;
  dividendTax: number;
  salaryIncomeTax: number;
  salaryEmployeeNICs: number;
  studentLoan: number;
  totalPersonalTax: number;
  takeHome: number;
  effectiveTaxRate: number;
}

export interface ComparisonResult {
  soleTrader: SoleTraderResult;
  ltdCompany: LtdCompanyResult;
  difference: number; // positive = ltd company better
}

export function calculateSoleTrader(input: TakeHomeInput): SoleTraderResult {
  const profit = input.annualRevenue - input.annualExpenses;
  const pensionContribution = Math.round(profit * (input.pensionPercent / 100));
  const taxableProfit = Math.max(0, profit - pensionContribution);

  const tax = incomeTax(taxableProfit);
  const ni4 = class4NICs(taxableProfit);
  const ni2 = taxableProfit > 0 ? NI2_ANNUAL : 0;
  const sl = studentLoanRepayment(taxableProfit, input.studentLoan);

  const totalDeductions = tax + ni4 + ni2 + sl + pensionContribution;
  const takeHome = profit - totalDeductions;

  return {
    revenue: input.annualRevenue,
    expenses: input.annualExpenses,
    profit,
    pensionContribution,
    taxableProfit,
    incomeTax: tax,
    class4NICs: ni4,
    class2NICs: Math.round(ni2 * 100) / 100,
    studentLoan: sl,
    totalDeductions,
    takeHome: Math.round(takeHome * 100) / 100,
    effectiveTaxRate: profit > 0 ? Math.round(((totalDeductions - pensionContribution) / profit) * 1000) / 10 : 0,
  };
}

/**
 * For Ltd company, we use the common optimisation:
 * - Pay salary at the NI primary threshold (£12,570) to use personal allowance without triggering employee NICs
 * - Take the rest as dividends
 *
 * For single-director companies, employment allowance is NOT available (since April 2023)
 * when the only employee is a director.
 */
export function calculateLtdCompany(input: TakeHomeInput): LtdCompanyResult {
  const grossProfit = input.annualRevenue - input.annualExpenses;

  // Optimal salary: at the NI primary threshold to avoid employee NICs
  // but still use the personal allowance
  const optimalSalary = Math.min(12_570, grossProfit);

  // Employer NICs on salary (no employment allowance for single-director companies)
  const employerNI = class1EmployerNICs(optimalSalary);

  // Pension contribution from the company (pre-corporation-tax expense)
  const pensionContribution = Math.round(grossProfit * (input.pensionPercent / 100));

  // Corporation tax calculation
  // Company profit = gross profit - salary - employer NICs - pension
  const companyProfit = Math.max(0, grossProfit - optimalSalary - employerNI - pensionContribution);
  const corpTax = corporationTax(companyProfit);

  // Retained profit after corporation tax = available for dividends
  const retainedProfit = companyProfit - corpTax;
  const dividends = Math.max(0, retainedProfit);

  // Personal tax on salary
  const salaryTax = incomeTax(optimalSalary);
  const salaryNI = class1EmployeeNICs(optimalSalary);

  // Dividend tax (dividends sit on top of salary income)
  const divTax = dividendTax(dividends, optimalSalary);

  // Student loan on total income (salary + dividends)
  const sl = studentLoanRepayment(optimalSalary + dividends, input.studentLoan);

  const totalPersonalTax = salaryTax + salaryNI + divTax + sl;
  const takeHome = optimalSalary + dividends - totalPersonalTax;

  return {
    revenue: input.annualRevenue,
    expenses: input.annualExpenses,
    grossProfit,
    optimalSalary,
    employerNICs: employerNI,
    pensionContribution,
    corporationTaxableProfit: companyProfit,
    corporationTax: corpTax,
    retainedProfit,
    dividends,
    dividendTax: divTax,
    salaryIncomeTax: salaryTax,
    salaryEmployeeNICs: salaryNI,
    studentLoan: sl,
    totalPersonalTax,
    takeHome: Math.round(takeHome * 100) / 100,
    effectiveTaxRate:
      grossProfit > 0
        ? Math.round(((corpTax + totalPersonalTax + employerNI) / grossProfit) * 1000) / 10
        : 0,
  };
}

export function compareTakeHome(input: TakeHomeInput): ComparisonResult {
  const soleTrader = calculateSoleTrader(input);
  const ltdCompany = calculateLtdCompany(input);

  return {
    soleTrader,
    ltdCompany,
    difference: Math.round((ltdCompany.takeHome - soleTrader.takeHome) * 100) / 100,
  };
}
