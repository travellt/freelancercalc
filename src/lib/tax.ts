/**
 * UK Tax Constants — 2026/27 Tax Year (6 April 2026 – 5 April 2027)
 * Source: HMRC published rates. Verify before each tax year.
 */

export const TAX_YEAR = '2026/27';
export const TAX_YEAR_START = '2026-04-06';
export const TAX_YEAR_END = '2027-04-05';

export type TaxRegion = 'england' | 'scotland';

// Income Tax — England/Wales/NI (frozen to April 2028)
export const PERSONAL_ALLOWANCE = 12_570;
export const BASIC_RATE_LIMIT = 50_270;
export const HIGHER_RATE_LIMIT = 125_140;
export const BASIC_RATE = 0.20;
export const HIGHER_RATE = 0.40;
export const ADDITIONAL_RATE = 0.45;
export const PA_TAPER_THRESHOLD = 100_000;

// Scottish Income Tax 2026/27 — starter and basic bands widened
const SCOTTISH_BANDS = [
  { name: 'Starter', from: 0, to: 3_967, rate: 0.19 },
  { name: 'Basic', from: 3_967, to: 16_956, rate: 0.20 },
  { name: 'Intermediate', from: 16_956, to: 31_092, rate: 0.21 },
  { name: 'Higher', from: 31_092, to: 62_430, rate: 0.42 },
  { name: 'Advanced', from: 62_430, to: 112_570, rate: 0.45 },
  { name: 'Top', from: 112_570, to: Infinity, rate: 0.48 },
] as const;

// National Insurance — Class 4 (Self-Employed) — unchanged
export const NI4_LOWER_PROFITS = 12_570;
export const NI4_UPPER_PROFITS = 50_270;
export const NI4_MAIN_RATE = 0.06;
export const NI4_ADDITIONAL_RATE = 0.02;
export const NI2_WEEKLY = 3.65; // was 3.45
export const NI2_ANNUAL = NI2_WEEKLY * 52;

// National Insurance — Class 1 (Employed / Director)
export const NI1_PRIMARY_THRESHOLD = 12_570;
export const NI1_UPPER_EARNINGS = 50_270;
export const NI1_EMPLOYEE_RATE = 0.08;
export const NI1_EMPLOYEE_ABOVE_UEL = 0.02;
export const NI1_EMPLOYER_RATE = 0.15; // was 0.138 — increased from April 2025
export const NI1_EMPLOYER_THRESHOLD = 5_000;
export const EMPLOYMENT_ALLOWANCE = 10_500;

// Corporation Tax — unchanged
export const CT_SMALL_PROFITS_LIMIT = 50_000;
export const CT_MAIN_LIMIT = 250_000;
export const CT_SMALL_RATE = 0.19;
export const CT_MAIN_RATE = 0.25;

// Dividends — basic and higher rates increased from April 2026
export const DIVIDEND_ALLOWANCE = 500;
export const DIVIDEND_BASIC_RATE = 0.1075; // was 0.0875
export const DIVIDEND_HIGHER_RATE = 0.3575; // was 0.3375
export const DIVIDEND_ADDITIONAL_RATE = 0.3935; // unchanged

// VAT — unchanged
export const VAT_THRESHOLD = 90_000;
export const VAT_DEREGISTRATION = 88_000;
export const VAT_STANDARD_RATE = 0.20;

// Student Loans — Plans 1, 2, 4 thresholds increased
export const STUDENT_LOAN = {
  plan1: { threshold: 26_900, rate: 0.09 },  // was 24,990
  plan2: { threshold: 29_385, rate: 0.09 },  // was 27,295
  plan4: { threshold: 33_795, rate: 0.09 },  // was 31,395
  plan5: { threshold: 25_000, rate: 0.09 },  // unchanged
  postgrad: { threshold: 21_000, rate: 0.06 }, // unchanged
} as const;

export type StudentLoanPlan = keyof typeof STUDENT_LOAN | 'none';

// Pension — unchanged
export const PENSION_ANNUAL_ALLOWANCE = 60_000;

// Trading Allowance
export const TRADING_ALLOWANCE = 1_000;

// ─── Calculation helpers ───

/** Calculate personal allowance accounting for taper above £100k */
export function effectivePersonalAllowance(income: number): number {
  if (income <= PA_TAPER_THRESHOLD) return PERSONAL_ALLOWANCE;
  const reduction = (income - PA_TAPER_THRESHOLD) / 2;
  return Math.max(0, PERSONAL_ALLOWANCE - reduction);
}

/** Income tax on gross income — supports England/Wales/NI and Scotland */
export function incomeTax(gross: number, region: TaxRegion = 'england'): number {
  const pa = effectivePersonalAllowance(gross);
  const taxable = Math.max(0, gross - pa);
  if (taxable <= 0) return 0;

  if (region === 'scotland') return scottishIncomeTax(taxable);
  return englandIncomeTax(taxable);
}

function englandIncomeTax(taxable: number): number {
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

function scottishIncomeTax(taxable: number): number {
  let tax = 0;
  let remaining = taxable;

  for (const band of SCOTTISH_BANDS) {
    if (remaining <= 0) break;
    const bandWidth = band.to === Infinity ? remaining : band.to - band.from;
    const inBand = Math.min(remaining, bandWidth);
    tax += inBand * band.rate;
    remaining -= inBand;
  }

  return Math.round(tax * 100) / 100;
}

/** Class 4 NICs for self-employed (same across UK) */
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

/**
 * Corporation tax on profits.
 * HMRC marginal relief formula:
 *   tax = profits × 25%
 *   relief = (250,000 − profits) × 3/200
 * Effective rate scales from 19% at £50k to 25% at £250k
 */
export function corporationTax(profits: number): number {
  if (profits <= 0) return 0;
  if (profits <= CT_SMALL_PROFITS_LIMIT) return Math.round(profits * CT_SMALL_RATE * 100) / 100;
  if (profits >= CT_MAIN_LIMIT) return Math.round(profits * CT_MAIN_RATE * 100) / 100;
  const mainTax = profits * CT_MAIN_RATE;
  const fraction = 3 / 200;
  const relief = (CT_MAIN_LIMIT - profits) * fraction;
  return Math.round((mainTax - relief) * 100) / 100;
}

/** Dividend tax on dividends, given the taxpayer's other income for band calculation */
export function dividendTax(dividends: number, otherIncome: number, region: TaxRegion = 'england'): number {
  if (dividends <= 0) return 0;
  const pa = effectivePersonalAllowance(otherIncome + dividends);
  const totalTaxable = Math.max(0, otherIncome + dividends - pa);
  const otherTaxable = Math.max(0, otherIncome - pa);

  let taxableDividends = totalTaxable - otherTaxable;
  const allowanceUsed = Math.min(taxableDividends, DIVIDEND_ALLOWANCE);
  taxableDividends -= allowanceUsed;

  if (taxableDividends <= 0) return 0;

  // Dividend rates are the same across UK (not affected by Scottish bands)
  const basicCeiling = BASIC_RATE_LIMIT - PERSONAL_ALLOWANCE;
  const higherCeiling = HIGHER_RATE_LIMIT - PERSONAL_ALLOWANCE;

  let tax = 0;
  let cursor = otherTaxable + allowanceUsed;
  let remaining = taxableDividends;

  if (cursor < basicCeiling && remaining > 0) {
    const inBasic = Math.min(remaining, basicCeiling - cursor);
    tax += inBasic * DIVIDEND_BASIC_RATE;
    cursor += inBasic;
    remaining -= inBasic;
  }

  if (cursor < higherCeiling && remaining > 0) {
    const inHigher = Math.min(remaining, higherCeiling - cursor);
    tax += inHigher * DIVIDEND_HIGHER_RATE;
    cursor += inHigher;
    remaining -= inHigher;
  }

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
