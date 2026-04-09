/**
 * UK Tax Constants — 2025/26 Tax Year (6 April 2025 – 5 April 2026)
 * Source: HMRC published rates. Verify before each tax year.
 */

export const TAX_YEAR = '2025/26';
export const TAX_YEAR_START = '2025-04-06';
export const TAX_YEAR_END = '2026-04-05';

// Income Tax
export const PERSONAL_ALLOWANCE = 12_570;
export const BASIC_RATE_LIMIT = 50_270;
export const HIGHER_RATE_LIMIT = 125_140;
export const BASIC_RATE = 0.20;
export const HIGHER_RATE = 0.40;
export const ADDITIONAL_RATE = 0.45;
export const PA_TAPER_THRESHOLD = 100_000;

// National Insurance — Class 4 (Self-Employed)
export const NI4_LOWER_PROFITS = 12_570;
export const NI4_UPPER_PROFITS = 50_270;
export const NI4_MAIN_RATE = 0.06;
export const NI4_ADDITIONAL_RATE = 0.02;
export const NI2_WEEKLY = 3.45;
export const NI2_ANNUAL = NI2_WEEKLY * 52;

// National Insurance — Class 1 (Employed / Director)
export const NI1_PRIMARY_THRESHOLD = 12_570;
export const NI1_UPPER_EARNINGS = 50_270;
export const NI1_EMPLOYEE_RATE = 0.08;
export const NI1_EMPLOYEE_ABOVE_UEL = 0.02;
export const NI1_EMPLOYER_RATE = 0.138;
export const NI1_EMPLOYER_THRESHOLD = 5_000;
export const EMPLOYMENT_ALLOWANCE = 10_500;

// Corporation Tax
export const CT_SMALL_PROFITS_LIMIT = 50_000;
export const CT_MAIN_LIMIT = 250_000;
export const CT_SMALL_RATE = 0.19;
export const CT_MAIN_RATE = 0.25;

// Dividends
export const DIVIDEND_ALLOWANCE = 500;
export const DIVIDEND_BASIC_RATE = 0.0875;
export const DIVIDEND_HIGHER_RATE = 0.3375;
export const DIVIDEND_ADDITIONAL_RATE = 0.3935;

// VAT
export const VAT_THRESHOLD = 90_000;
export const VAT_DEREGISTRATION = 88_000;
export const VAT_STANDARD_RATE = 0.20;

// Student Loans
export const STUDENT_LOAN = {
  plan1: { threshold: 24_990, rate: 0.09 },
  plan2: { threshold: 27_295, rate: 0.09 },
  plan4: { threshold: 31_395, rate: 0.09 },
  plan5: { threshold: 25_000, rate: 0.09 },
  postgrad: { threshold: 21_000, rate: 0.06 },
} as const;

export type StudentLoanPlan = keyof typeof STUDENT_LOAN | 'none';

// Pension
export const PENSION_ANNUAL_ALLOWANCE = 60_000;

// ─── Calculation helpers ───

/** Calculate personal allowance accounting for taper above £100k */
export function effectivePersonalAllowance(income: number): number {
  if (income <= PA_TAPER_THRESHOLD) return PERSONAL_ALLOWANCE;
  const reduction = Math.floor((income - PA_TAPER_THRESHOLD) / 2);
  return Math.max(0, PERSONAL_ALLOWANCE - reduction);
}

/** Income tax on a given taxable income (after personal allowance) */
export function incomeTax(gross: number): number {
  const pa = effectivePersonalAllowance(gross);
  const taxable = Math.max(0, gross - pa);

  let tax = 0;
  const basicBand = Math.min(taxable, BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE);
  tax += basicBand * BASIC_RATE;

  const higherBand = Math.min(
    Math.max(0, taxable - (BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE)),
    HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT
  );
  tax += higherBand * HIGHER_RATE;

  const additionalBand = Math.max(0, taxable - (HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE));
  tax += additionalBand * ADDITIONAL_RATE;

  return Math.round(tax * 100) / 100;
}

/** Class 4 NICs for self-employed */
export function class4NICs(profits: number): number {
  if (profits <= NI4_LOWER_PROFITS) return 0;
  const mainBand = Math.min(profits, NI4_UPPER_PROFITS) - NI4_LOWER_PROFITS;
  const additionalBand = Math.max(0, profits - NI4_UPPER_PROFITS);
  return Math.round((mainBand * NI4_MAIN_RATE + additionalBand * NI4_ADDITIONAL_RATE) * 100) / 100;
}

/** Class 1 employee NICs */
export function class1EmployeeNICs(salary: number): number {
  if (salary <= NI1_PRIMARY_THRESHOLD) return 0;
  const mainBand = Math.min(salary, NI1_UPPER_EARNINGS) - NI1_PRIMARY_THRESHOLD;
  const aboveBand = Math.max(0, salary - NI1_UPPER_EARNINGS);
  return Math.round((mainBand * NI1_EMPLOYEE_RATE + aboveBand * NI1_EMPLOYEE_ABOVE_UEL) * 100) / 100;
}

/** Class 1 employer NICs (no employment allowance applied — single-director company) */
export function class1EmployerNICs(salary: number): number {
  if (salary <= NI1_EMPLOYER_THRESHOLD) return 0;
  return Math.round((salary - NI1_EMPLOYER_THRESHOLD) * NI1_EMPLOYER_RATE * 100) / 100;
}

/** Corporation tax on profits */
export function corporationTax(profits: number): number {
  if (profits <= 0) return 0;
  if (profits <= CT_SMALL_PROFITS_LIMIT) return Math.round(profits * CT_SMALL_RATE * 100) / 100;
  if (profits >= CT_MAIN_LIMIT) return Math.round(profits * CT_MAIN_RATE * 100) / 100;
  // Marginal relief
  const mainTax = profits * CT_MAIN_RATE;
  const relief = ((CT_MAIN_LIMIT - profits) * (CT_MAIN_RATE - CT_SMALL_RATE) * profits) / CT_MAIN_LIMIT;
  return Math.round((mainTax - relief) * 100) / 100;
}

/** Dividend tax on dividends, given the taxpayer's other income for band calculation */
export function dividendTax(dividends: number, otherIncome: number): number {
  if (dividends <= 0) return 0;
  const pa = effectivePersonalAllowance(otherIncome + dividends);
  const totalTaxable = Math.max(0, otherIncome + dividends - pa);
  const otherTaxable = Math.max(0, otherIncome - pa);

  // Dividends sit on top of other income in the bands
  let taxableDividends = totalTaxable - otherTaxable;
  // Apply dividend allowance
  const allowanceUsed = Math.min(taxableDividends, DIVIDEND_ALLOWANCE);
  taxableDividends -= allowanceUsed;

  if (taxableDividends <= 0) return 0;

  const basicCeiling = BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE;
  const higherCeiling = HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE;

  let tax = 0;
  let cursor = otherTaxable + allowanceUsed;
  let remaining = taxableDividends;

  // Basic rate band
  if (cursor < basicCeiling && remaining > 0) {
    const inBasic = Math.min(remaining, basicCeiling - cursor);
    tax += inBasic * DIVIDEND_BASIC_RATE;
    cursor += inBasic;
    remaining -= inBasic;
  }

  // Higher rate band
  if (cursor < higherCeiling && remaining > 0) {
    const inHigher = Math.min(remaining, higherCeiling - cursor);
    tax += inHigher * DIVIDEND_HIGHER_RATE;
    cursor += inHigher;
    remaining -= inHigher;
  }

  // Additional rate
  if (remaining > 0) {
    tax += remaining * DIVIDEND_ADDITIONAL_RATE;
  }

  return Math.round(tax * 100) / 100;
}

/** Student loan repayment */
export function studentLoanRepayment(income: number, plan: StudentLoanPlan): number {
  if (plan === 'none') return 0;
  const { threshold, rate } = STUDENT_LOAN[plan];
  if (income <= threshold) return 0;
  return Math.round((income - threshold) * rate * 100) / 100;
}

/** Format a number as GBP */
export function formatGBP(amount: number): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Format number with commas */
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-GB').format(Math.round(n));
}
