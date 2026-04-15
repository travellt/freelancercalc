/**
 * Working From Home Allowance Calculator
 *
 * Two methods:
 * 1. Simplified expenses (flat rate) — HMRC approved amounts, no receipts needed
 * 2. Actual costs method — proportion of household bills based on rooms/hours
 *
 * HMRC simplified rates (unchanged since 2020):
 * - 25-50 hours/month: £10/month
 * - 51-100 hours/month: £18/month
 * - 101+ hours/month: £26/month
 *
 * For employed (not self-employed): £6/week (£312/year) flat rate
 */

export interface WfhInput {
  status: 'sole-trader' | 'limited-company' | 'employed';
  hoursPerWeek: number;
  weeksPerYear: number;

  // For actual cost method
  annualMortgageRent: number;
  annualCouncilTax: number;
  annualElectricity: number;
  annualGas: number;
  annualWater: number;
  annualBroadband: number;
  annualInsurance: number;
  totalRooms: number;
  workRooms: number;
}

export interface WfhResult {
  // Simplified method
  monthlyHours: number;
  simplifiedMonthlyRate: number;
  simplifiedAnnual: number;
  simplifiedTaxSaving20: number;
  simplifiedTaxSaving40: number;

  // Actual cost method
  totalHouseholdCosts: number;
  roomProportion: number;
  timeProportion: number;
  combinedProportion: number;
  actualAnnualClaim: number;
  actualTaxSaving20: number;
  actualTaxSaving40: number;

  // Broadband (separate — can claim proportion regardless of method)
  broadbandClaim: number;

  // Comparison
  betterMethod: 'simplified' | 'actual';
  difference: number;

  // Employed rate
  employedWeeklyRate: number;
  employedAnnualClaim: number;
}

function getSimplifiedMonthlyRate(monthlyHours: number): number {
  if (monthlyHours >= 101) return 26;
  if (monthlyHours >= 51) return 18;
  if (monthlyHours >= 25) return 10;
  return 0;
}

export function calculateWfh(input: WfhInput): WfhResult {
  const monthlyHours = Math.round((input.hoursPerWeek * input.weeksPerYear) / 12);
  const workingMonths = Math.min(12, Math.ceil(input.weeksPerYear / 4.33));

  // Simplified method
  const simplifiedMonthlyRate = getSimplifiedMonthlyRate(monthlyHours);
  const simplifiedAnnual = simplifiedMonthlyRate * workingMonths;

  // Actual cost method
  // Only costs that relate to the home itself (not personal costs)
  const totalHouseholdCosts =
    input.annualMortgageRent +
    input.annualCouncilTax +
    input.annualElectricity +
    input.annualGas +
    input.annualWater +
    input.annualInsurance;

  const roomProportion = input.totalRooms > 0 ? input.workRooms / input.totalRooms : 0;

  // Time proportion: hours worked vs total hours in a year
  const totalHoursInYear = 365 * 24;
  const workHoursInYear = input.hoursPerWeek * input.weeksPerYear;
  const timeProportion = Math.min(1, workHoursInYear / totalHoursInYear);

  // HMRC allows room proportion OR room × time proportion
  // Room proportion alone is simpler and usually more generous
  const combinedProportion = roomProportion;

  const actualHouseholdClaim = totalHouseholdCosts * combinedProportion;

  // Broadband: claim business proportion (typically 50% if used for work)
  const broadbandBusinessProportion = input.hoursPerWeek > 0 ? Math.min(0.75, input.hoursPerWeek / 40) : 0;
  const broadbandClaim = input.annualBroadband * broadbandBusinessProportion;

  const actualAnnualClaim = actualHouseholdClaim + broadbandClaim;

  // Employed rate (£6/week since April 2020)
  const employedWeeklyRate = 6;
  const employedAnnualClaim = employedWeeklyRate * input.weeksPerYear;

  // Tax savings
  const simplifiedTaxSaving20 = Math.round(simplifiedAnnual * 0.20);
  const simplifiedTaxSaving40 = Math.round(simplifiedAnnual * 0.40);
  const actualTaxSaving20 = Math.round(actualAnnualClaim * 0.20);
  const actualTaxSaving40 = Math.round(actualAnnualClaim * 0.40);

  const betterMethod = actualAnnualClaim > simplifiedAnnual ? 'actual' : 'simplified';
  const difference = Math.abs(actualAnnualClaim - simplifiedAnnual);

  return {
    monthlyHours,
    simplifiedMonthlyRate,
    simplifiedAnnual,
    simplifiedTaxSaving20,
    simplifiedTaxSaving40,
    totalHouseholdCosts,
    roomProportion,
    timeProportion,
    combinedProportion,
    actualAnnualClaim: Math.round(actualAnnualClaim),
    actualTaxSaving20,
    actualTaxSaving40,
    broadbandClaim: Math.round(broadbandClaim),
    betterMethod,
    difference: Math.round(difference),
    employedWeeklyRate,
    employedAnnualClaim,
  };
}
