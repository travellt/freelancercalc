import {
  incomeTax,
  class1EmployeeNICs,
  class1EmployerNICs,
  corporationTax,
  dividendTax,
  studentLoanRepayment,
  PERSONAL_ALLOWANCE,
  NI1_PRIMARY_THRESHOLD,
  type StudentLoanPlan,
  type TaxRegion,
} from './tax';

export interface OptimiserInput {
  grossProfit: number; // company profit before salary/pension
  studentLoan: StudentLoanPlan;
  region: TaxRegion;
  otherIncome: number;
  pensionPercent: number;
}

export interface SalaryScenario {
  salary: number;
  employerNICs: number;
  companyPensionContrib: number;
  corporationTaxableProfit: number;
  corporationTax: number;
  dividendsAvailable: number;
  salaryIncomeTax: number;
  salaryEmployeeNICs: number;
  dividendTax: number;
  studentLoan: number;
  totalTaxBurden: number; // all taxes combined
  takeHome: number;
  effectiveTaxRate: number;
}

export interface OptimiserResult {
  optimal: SalaryScenario;
  scenarios: SalaryScenario[];
  optimalSalaryAmount: number;
  optimalReason: string;
}

function calculateScenario(salary: number, input: OptimiserInput): SalaryScenario {
  const clampedSalary = Math.min(salary, Math.max(0, input.grossProfit));

  const employerNI = class1EmployerNICs(clampedSalary);
  const pensionContrib = Math.round(Math.max(0, input.grossProfit) * (input.pensionPercent / 100));

  const companyProfit = Math.max(0, input.grossProfit - clampedSalary - employerNI - pensionContrib);
  const corpTax = corporationTax(companyProfit);
  const dividends = Math.max(0, companyProfit - corpTax);

  const totalSalaryIncome = clampedSalary + input.otherIncome;
  const salaryTaxTotal = incomeTax(totalSalaryIncome, input.region);
  const salaryTaxOther = input.otherIncome > 0 ? incomeTax(input.otherIncome, input.region) : 0;
  const salaryIT = Math.max(0, salaryTaxTotal - salaryTaxOther);

  const salaryNI = class1EmployeeNICs(clampedSalary);
  const divTax = dividendTax(dividends, totalSalaryIncome, input.region);

  const totalPersonalIncome = clampedSalary + dividends + input.otherIncome;
  const sl = studentLoanRepayment(totalPersonalIncome, input.studentLoan);
  const slOther = input.otherIncome > 0 ? studentLoanRepayment(input.otherIncome, input.studentLoan) : 0;
  const slOnCompany = Math.max(0, sl - slOther);

  const totalTax = corpTax + employerNI + salaryIT + salaryNI + divTax + slOnCompany;
  const takeHome = clampedSalary + dividends - salaryIT - salaryNI - divTax - slOnCompany;

  return {
    salary: clampedSalary,
    employerNICs: employerNI,
    companyPensionContrib: pensionContrib,
    corporationTaxableProfit: companyProfit,
    corporationTax: corpTax,
    dividendsAvailable: dividends,
    salaryIncomeTax: salaryIT,
    salaryEmployeeNICs: salaryNI,
    dividendTax: divTax,
    studentLoan: slOnCompany,
    totalTaxBurden: Math.round(totalTax * 100) / 100,
    takeHome: Math.round(takeHome * 100) / 100,
    effectiveTaxRate: input.grossProfit > 0
      ? Math.round((totalTax / input.grossProfit) * 1000) / 10
      : 0,
  };
}

export function optimiseSalaryDividend(input: OptimiserInput): OptimiserResult {
  // Test salary levels from £0 to gross profit in £100 increments
  const maxSalary = Math.min(input.grossProfit, 60_000);
  const step = Math.max(100, Math.round(maxSalary / 500) * 100);

  let bestScenario: SalaryScenario | null = null;

  // Key salary points to always test
  const keyPoints = [
    0,
    NI1_PRIMARY_THRESHOLD, // just at NI threshold
    PERSONAL_ALLOWANCE,     // personal allowance
    50_270,                 // higher rate threshold
  ];

  const salaryLevels = new Set<number>();
  for (const kp of keyPoints) {
    if (kp <= input.grossProfit) salaryLevels.add(kp);
  }
  for (let s = 0; s <= maxSalary; s += step) {
    salaryLevels.add(s);
  }

  const scenarios: SalaryScenario[] = [];

  for (const salary of Array.from(salaryLevels).sort((a, b) => a - b)) {
    const scenario = calculateScenario(salary, input);
    scenarios.push(scenario);

    if (!bestScenario || scenario.takeHome > bestScenario.takeHome) {
      bestScenario = scenario;
    }
  }

  // Fine-tune around the best salary found
  if (bestScenario) {
    for (let s = Math.max(0, bestScenario.salary - 1000); s <= Math.min(maxSalary, bestScenario.salary + 1000); s += 10) {
      const scenario = calculateScenario(s, input);
      if (scenario.takeHome > bestScenario.takeHome) {
        bestScenario = scenario;
      }
    }
  }

  const optimal = bestScenario!;

  let optimalReason = '';
  if (optimal.salary === 0) {
    optimalReason = 'Taking no salary and extracting everything as dividends minimises your total tax burden at this profit level.';
  } else if (Math.abs(optimal.salary - PERSONAL_ALLOWANCE) < 200) {
    optimalReason = `A salary of ${formatSalary(optimal.salary)} uses your personal allowance (no income tax on salary) while keeping employer NICs relatively low. The rest comes as dividends taxed at lower rates.`;
  } else if (optimal.salary < PERSONAL_ALLOWANCE) {
    optimalReason = `A salary below the personal allowance (${formatSalary(optimal.salary)}) reduces employer NICs while still paying no income tax on salary. You lose some personal allowance but save more on NICs.`;
  } else {
    optimalReason = `A salary of ${formatSalary(optimal.salary)} is the optimal balance between income tax, NICs, corporation tax, and dividend tax at your profit level.`;
  }

  // Return a reasonable number of scenarios for the chart
  const chartScenarios = scenarios.filter((_, i) => i % Math.max(1, Math.floor(scenarios.length / 20)) === 0 || keyPoints.includes(scenarios[i]?.salary));

  return {
    optimal,
    scenarios: chartScenarios.length > 2 ? chartScenarios : scenarios,
    optimalSalaryAmount: optimal.salary,
    optimalReason,
  };
}

function formatSalary(n: number): string {
  return `£${n.toLocaleString('en-GB')}`;
}
