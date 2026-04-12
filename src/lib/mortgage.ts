export interface MortgageInput {
  annualIncome: number; // net profit / salary+dividends
  yearsTrading: number;
  deposit: number;
  propertyPrice: number;
  termYears: number;
  existingCommitments: number; // monthly credit card, loans, etc.
  structure: 'sole-trader' | 'limited-company';
  // For sole traders: average of last 2-3 years net profit
  // For ltd company: salary + dividends (some lenders use company net profit)
  previousYearIncome?: number;
}

export interface MortgageResult {
  // Affordability
  ltv: number; // loan to value %
  loanAmount: number;
  maxBorrowingConservative: number; // 3x income
  maxBorrowingModerate: number; // 4x income
  maxBorrowingOptimistic: number; // 4.5x income
  incomeUsed: number; // which income figure lenders would use

  // Monthly costs
  monthlyPayment2yr: number; // typical 2-year fix
  monthlyPaymentSVR: number; // standard variable rate
  monthlyPaymentStress: number; // stress test rate

  // Affordability checks
  affordabilityRatio: number; // monthly mortgage / monthly income
  passesStressTest: boolean;
  depositPercent: number;

  // Guidance
  ltvBand: 'excellent' | 'good' | 'moderate' | 'high' | 'very-high';
  tradingYearsSufficient: boolean;
  tradingYearsNote: string;
  incomeNote: string;
  tips: string[];
}

// Typical mortgage rates (illustrative, not live)
const RATES = {
  twoYearFix: 0.045, // 4.5%
  svr: 0.065, // 6.5%
  stressTest: 0.08, // 8% (used by lenders for affordability)
};

function monthlyPayment(loan: number, annualRate: number, termYears: number): number {
  const r = annualRate / 12;
  const n = termYears * 12;
  if (r === 0) return loan / n;
  return Math.round((loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const loanAmount = input.propertyPrice - input.deposit;
  const ltv = input.propertyPrice > 0 ? Math.round((loanAmount / input.propertyPrice) * 1000) / 10 : 0;
  const depositPercent = input.propertyPrice > 0 ? Math.round((input.deposit / input.propertyPrice) * 1000) / 10 : 0;

  // Income calculation
  // Sole traders: lenders typically use average of last 2-3 years' net profit
  // Ltd company: salary + dividends, or sometimes company net profit
  const incomeUsed = input.previousYearIncome
    ? Math.round((input.annualIncome + input.previousYearIncome) / 2)
    : input.annualIncome;

  // Max borrowing multiples
  const maxConservative = incomeUsed * 3;
  const maxModerate = incomeUsed * 4;
  const maxOptimistic = incomeUsed * 4.5;

  // Monthly payments
  const mp2yr = monthlyPayment(loanAmount, RATES.twoYearFix, input.termYears);
  const mpSVR = monthlyPayment(loanAmount, RATES.svr, input.termYears);
  const mpStress = monthlyPayment(loanAmount, RATES.stressTest, input.termYears);

  // Affordability
  const monthlyIncome = incomeUsed / 12;
  const affordabilityRatio = monthlyIncome > 0
    ? Math.round(((mpStress + input.existingCommitments) / monthlyIncome) * 1000) / 10
    : 100;
  const passesStressTest = affordabilityRatio < 45; // most lenders cap at 40-50%

  // LTV band
  let ltvBand: MortgageResult['ltvBand'];
  if (ltv <= 60) ltvBand = 'excellent';
  else if (ltv <= 75) ltvBand = 'good';
  else if (ltv <= 85) ltvBand = 'moderate';
  else if (ltv <= 90) ltvBand = 'high';
  else ltvBand = 'very-high';

  // Trading years
  const tradingYearsSufficient = input.yearsTrading >= 2;
  let tradingYearsNote: string;
  if (input.yearsTrading >= 3) {
    tradingYearsNote = 'Most lenders accept 3+ years of trading history. You have good options available.';
  } else if (input.yearsTrading >= 2) {
    tradingYearsNote = 'Many mainstream lenders accept 2 years of accounts. Some specialist lenders accept 1 year.';
  } else if (input.yearsTrading >= 1) {
    tradingYearsNote = 'Options are limited with 1 year of accounts. Consider specialist lenders or brokers who work with newly self-employed applicants. Expect higher rates.';
  } else {
    tradingYearsNote = 'Most lenders require at least 1 full year of accounts. You may need to wait or use a specialist broker. Some lenders accept a strong employment history transitioning to self-employment.';
  }

  // Income note
  let incomeNote: string;
  if (input.structure === 'sole-trader') {
    incomeNote = input.previousYearIncome
      ? `Lenders will use the average of your last two years' net profit: ${formatGBP(incomeUsed)}/year.`
      : 'Lenders typically average your last 2-3 years of net profit from your SA302 forms. Enter last year\'s profit above for a more accurate estimate.';
  } else {
    incomeNote = 'Most lenders use salary + dividends. Some will use the company\'s net profit instead if it\'s higher — a specialist broker can find these lenders.';
  }

  // Tips
  const tips: string[] = [];
  if (input.yearsTrading < 2) tips.push('Build up at least 2 years of trading accounts before applying. This dramatically increases your lender options.');
  if (ltv > 85) tips.push('A larger deposit (15%+) significantly improves your rates and lender options as a self-employed applicant.');
  if (input.existingCommitments > 0) tips.push('Paying off credit cards and loans before applying improves your affordability score.');
  if (input.structure === 'sole-trader') tips.push('Keep your SA302 tax calculations and tax year overviews — lenders always ask for these.');
  if (input.structure === 'limited-company') tips.push('Ask your accountant for certified accounts, company tax returns, and SA302s. Some lenders also want bank statements.');
  tips.push('Use a whole-of-market mortgage broker experienced with self-employed clients. They know which lenders are most flexible.');
  if (!passesStressTest) tips.push('Your affordability is tight at stress-test rates. Consider a longer mortgage term, larger deposit, or reducing existing commitments.');

  return {
    ltv, loanAmount, depositPercent,
    maxBorrowingConservative: Math.round(maxConservative),
    maxBorrowingModerate: Math.round(maxModerate),
    maxBorrowingOptimistic: Math.round(maxOptimistic),
    incomeUsed,
    monthlyPayment2yr: mp2yr,
    monthlyPaymentSVR: mpSVR,
    monthlyPaymentStress: mpStress,
    affordabilityRatio,
    passesStressTest,
    ltvBand,
    tradingYearsSufficient,
    tradingYearsNote,
    incomeNote,
    tips,
  };
}

function formatGBP(n: number): string {
  return `£${Math.round(n).toLocaleString('en-GB')}`;
}
