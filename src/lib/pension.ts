export interface PensionInput {
  currentAge: number;
  retirementAge: number;
  currentPot: number;
  monthlyContribution: number;
  annualGrowthRate: number; // % annual return (before inflation)
  inflationRate: number; // %
  desiredRetirementIncome: number; // annual, in today's money
}

export interface PensionResult {
  yearsToRetirement: number;
  projectedPot: number; // nominal
  projectedPotReal: number; // inflation-adjusted
  annualDrawdown: number; // 4% rule
  annualDrawdownReal: number; // inflation-adjusted
  monthlyDrawdown: number;
  monthlyDrawdownReal: number;
  shortfall: number; // vs desired income (real terms)
  additionalMonthlyNeeded: number; // to hit desired income
  totalContributions: number;
  totalGrowth: number;

  // Year-by-year projection
  projections: YearProjection[];

  // Tax relief
  taxReliefPerYear: number;
  taxReliefTotal: number;
}

export interface YearProjection {
  age: number;
  year: number;
  contributions: number; // cumulative
  potValue: number; // nominal
  potValueReal: number; // inflation-adjusted
}

const DRAWDOWN_RATE = 0.04; // 4% safe withdrawal rate

export function calculatePension(input: PensionInput): PensionResult {
  const yearsToRetirement = Math.max(0, input.retirementAge - input.currentAge);
  const annualContribution = input.monthlyContribution * 12;
  const growthRate = input.annualGrowthRate / 100;
  const inflation = input.inflationRate / 100;
  const realReturn = (1 + growthRate) / (1 + inflation) - 1;

  let pot = input.currentPot;
  let potReal = input.currentPot;
  let totalContributions = input.currentPot;
  const projections: YearProjection[] = [];
  const currentYear = new Date().getFullYear();

  projections.push({
    age: input.currentAge,
    year: currentYear,
    contributions: input.currentPot,
    potValue: pot,
    potValueReal: potReal,
  });

  for (let y = 1; y <= yearsToRetirement; y++) {
    pot = (pot + annualContribution) * (1 + growthRate);
    potReal = (potReal + annualContribution) * (1 + realReturn);
    totalContributions += annualContribution;

    projections.push({
      age: input.currentAge + y,
      year: currentYear + y,
      contributions: totalContributions,
      potValue: Math.round(pot),
      potValueReal: Math.round(potReal),
    });
  }

  const projectedPot = Math.round(pot);
  const projectedPotReal = Math.round(potReal);

  const annualDrawdown = Math.round(projectedPot * DRAWDOWN_RATE);
  const annualDrawdownReal = Math.round(projectedPotReal * DRAWDOWN_RATE);

  const shortfall = Math.max(0, input.desiredRetirementIncome - annualDrawdownReal);

  // Calculate additional monthly contribution needed to hit target
  let additionalMonthlyNeeded = 0;
  if (shortfall > 0 && yearsToRetirement > 0) {
    const targetPotReal = input.desiredRetirementIncome / DRAWDOWN_RATE;
    const shortfallPot = targetPotReal - projectedPotReal;
    // Future value of annuity formula: FV = PMT * ((1+r)^n - 1) / r
    // Solve for PMT: PMT = FV * r / ((1+r)^n - 1)
    if (realReturn > 0) {
      const annualExtra = (shortfallPot * realReturn) / (Math.pow(1 + realReturn, yearsToRetirement) - 1);
      additionalMonthlyNeeded = Math.max(0, Math.ceil(annualExtra / 12));
    } else {
      additionalMonthlyNeeded = Math.ceil(shortfallPot / (yearsToRetirement * 12));
    }
  }

  // Tax relief estimate (basic rate assumed — 20% relief on personal contributions)
  const taxReliefPerYear = Math.round(annualContribution * 0.25); // gross up: £80 becomes £100
  const taxReliefTotal = taxReliefPerYear * yearsToRetirement;

  return {
    yearsToRetirement,
    projectedPot,
    projectedPotReal,
    annualDrawdown,
    annualDrawdownReal,
    monthlyDrawdown: Math.round(annualDrawdown / 12),
    monthlyDrawdownReal: Math.round(annualDrawdownReal / 12),
    shortfall,
    additionalMonthlyNeeded,
    totalContributions: Math.round(totalContributions),
    totalGrowth: Math.round(projectedPot - totalContributions),
    projections,
    taxReliefPerYear,
    taxReliefTotal,
  };
}
