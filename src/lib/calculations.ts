import {
  incomeTax,
  class4NICs,
  class1EmployeeNICs,
  class1EmployerNICs,
  corporationTax,
  dividendTax,
  studentLoanRepayment,
  NI2_ANNUAL,
  PERSONAL_ALLOWANCE,
  NI1_PRIMARY_THRESHOLD,
  type StudentLoanPlan,
  type TaxRegion,
} from './tax';

export interface TakeHomeInput {
  annualRevenue: number;
  annualExpenses: number;
  studentLoan: StudentLoanPlan;
  pensionPercent: number;
  otherIncome: number; // employment income, rental, etc.
  region: TaxRegion;
  ltdSalary: number; // director salary (user can adjust from optimal)
}

export interface SoleTraderResult {
  revenue: number;
  expenses: number;
  profit: number;
  pensionContribution: number;
  taxableProfit: number;
  totalTaxableWithOther: number;
  incomeTax: number;
  class4NICs: number;
  class2NICs: number;
  studentLoan: number;
  totalDeductions: number;
  takeHome: number;
  effectiveTaxRate: number;
  monthlyTakeHome: number;
  weeklyTakeHome: number;
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
  totalCostInclCorpTax: number;
  takeHome: number;
  effectiveTaxRate: number;
  monthlyTakeHome: number;
  weeklyTakeHome: number;
}

export interface ComparisonResult {
  soleTrader: SoleTraderResult;
  ltdCompany: LtdCompanyResult;
  difference: number;
}

export function calculateSoleTrader(input: TakeHomeInput): SoleTraderResult {
  const profit = input.annualRevenue - input.annualExpenses;
  const pensionContribution = Math.round(Math.max(0, profit) * (input.pensionPercent / 100));
  const taxableProfit = Math.max(0, profit - pensionContribution);

  // Income tax applies to total income (freelance profit + other income)
  const totalTaxable = taxableProfit + input.otherIncome;
  const taxOnTotal = incomeTax(totalTaxable, input.region);
  const taxOnOther = input.otherIncome > 0 ? incomeTax(input.otherIncome, input.region) : 0;
  const tax = Math.max(0, taxOnTotal - taxOnOther); // marginal tax on freelance income

  const ni4 = class4NICs(taxableProfit);
  const ni2 = taxableProfit > 0 ? NI2_ANNUAL : 0;
  const sl = studentLoanRepayment(totalTaxable, input.studentLoan);
  const slOnOther = input.otherIncome > 0 ? studentLoanRepayment(input.otherIncome, input.studentLoan) : 0;
  const slOnFreelance = Math.max(0, sl - slOnOther);

  const totalDeductions = tax + ni4 + ni2 + slOnFreelance + pensionContribution;
  const takeHome = profit - totalDeductions;

  return {
    revenue: input.annualRevenue,
    expenses: input.annualExpenses,
    profit,
    pensionContribution,
    taxableProfit,
    totalTaxableWithOther: totalTaxable,
    incomeTax: tax,
    class4NICs: ni4,
    class2NICs: Math.round(ni2 * 100) / 100,
    studentLoan: slOnFreelance,
    totalDeductions,
    takeHome: Math.round(takeHome * 100) / 100,
    effectiveTaxRate: profit > 0 ? Math.round(((totalDeductions - pensionContribution) / profit) * 1000) / 10 : 0,
    monthlyTakeHome: Math.round(takeHome / 12),
    weeklyTakeHome: Math.round(takeHome / 52),
  };
}

/**
 * Ltd company calculation.
 * User can set director salary (default: £12,570 = personal allowance, optimal for most).
 * Employment allowance NOT available for single-director companies (since April 2023).
 */
export function calculateLtdCompany(input: TakeHomeInput): LtdCompanyResult {
  const grossProfit = input.annualRevenue - input.annualExpenses;

  const optimalSalary = Math.min(input.ltdSalary, Math.max(0, grossProfit));
  const employerNI = class1EmployerNICs(optimalSalary);
  const pensionContribution = Math.round(Math.max(0, grossProfit) * (input.pensionPercent / 100));

  const companyProfit = Math.max(0, grossProfit - optimalSalary - employerNI - pensionContribution);
  const corpTax = corporationTax(companyProfit);
  const retainedProfit = companyProfit - corpTax;
  const dividends = Math.max(0, retainedProfit);

  // Personal tax — salary + dividends sit on top of any other income
  const totalSalaryIncome = optimalSalary + input.otherIncome;
  const salaryTaxOnTotal = incomeTax(totalSalaryIncome, input.region);
  const salaryTaxOnOther = input.otherIncome > 0 ? incomeTax(input.otherIncome, input.region) : 0;
  const salaryTax = Math.max(0, salaryTaxOnTotal - salaryTaxOnOther);

  const salaryNI = class1EmployeeNICs(optimalSalary);
  const divTax = dividendTax(dividends, totalSalaryIncome, input.region);

  const totalPersonalIncome = optimalSalary + dividends + input.otherIncome;
  const sl = studentLoanRepayment(totalPersonalIncome, input.studentLoan);
  const slOnOther = input.otherIncome > 0 ? studentLoanRepayment(input.otherIncome, input.studentLoan) : 0;
  const slOnCompany = Math.max(0, sl - slOnOther);

  const totalPersonalTax = salaryTax + salaryNI + divTax + slOnCompany;
  const totalCostInclCorpTax = corpTax + totalPersonalTax + employerNI;
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
    studentLoan: slOnCompany,
    totalPersonalTax,
    totalCostInclCorpTax,
    takeHome: Math.round(takeHome * 100) / 100,
    effectiveTaxRate: grossProfit > 0
      ? Math.round((totalCostInclCorpTax / grossProfit) * 1000) / 10
      : 0,
    monthlyTakeHome: Math.round(takeHome / 12),
    weeklyTakeHome: Math.round(takeHome / 52),
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
