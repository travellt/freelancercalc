import {
  incomeTax,
  class4NICs,
  NI2_ANNUAL,
  studentLoanRepayment,
  type StudentLoanPlan,
  type TaxRegion,
} from './tax';

export interface QuarterlyTaxInput {
  annualProfit: number;
  studentLoan: StudentLoanPlan;
  region: TaxRegion;
  otherIncome: number;
  isFirstYear: boolean; // first year of self-employment = no payments on account
  previousYearTax: number; // last year's total tax bill (for payments on account)
}

export interface QuarterlyTaxResult {
  // Annual tax breakdown
  incomeTax: number;
  class4NICs: number;
  class2NICs: number;
  studentLoan: number;
  totalAnnualTax: number;

  // Payments on account
  paymentsOnAccount: boolean;
  firstPaymentOnAccount: number; // due 31 Jan during tax year
  secondPaymentOnAccount: number; // due 31 Jul after tax year
  balancingPayment: number; // due 31 Jan after tax year (with next year's first POA)

  // Payment schedule
  schedule: PaymentEvent[];

  // Monthly reserve
  monthlyReserve: number;
  weeklyReserve: number;

  // Comparison with previous year
  taxChange: number;
  taxChangePercent: number;
}

export interface PaymentEvent {
  date: string;
  label: string;
  amount: number;
  description: string;
}

export function calculateQuarterlyTax(input: QuarterlyTaxInput): QuarterlyTaxResult {
  // Total income including other sources
  const totalIncome = input.annualProfit + input.otherIncome;
  const taxOnTotal = incomeTax(totalIncome, input.region);
  const taxOnOther = input.otherIncome > 0 ? incomeTax(input.otherIncome, input.region) : 0;
  const freelanceTax = Math.max(0, taxOnTotal - taxOnOther);

  const ni4 = class4NICs(input.annualProfit);
  const ni2 = input.annualProfit > 0 ? NI2_ANNUAL : 0;

  const sl = studentLoanRepayment(totalIncome, input.studentLoan);
  const slOther = input.otherIncome > 0 ? studentLoanRepayment(input.otherIncome, input.studentLoan) : 0;
  const slFreelance = Math.max(0, sl - slOther);

  const totalAnnualTax = Math.round((freelanceTax + ni4 + ni2 + slFreelance) * 100) / 100;

  // Payments on account
  // POA = 50% of previous year's tax bill, paid in two instalments
  // Not required if: previous year tax < £1,000, or >80% was deducted at source
  const paymentsOnAccount = !input.isFirstYear && input.previousYearTax >= 1000;
  const poaAmount = paymentsOnAccount ? Math.round(input.previousYearTax / 2 * 100) / 100 : 0;

  // Balancing payment = this year's actual tax minus POA already paid
  const totalPoaPaid = poaAmount * 2;
  const balancingPayment = Math.max(0, Math.round((totalAnnualTax - totalPoaPaid) * 100) / 100);

  // Build payment schedule for 2025/26 tax year
  const schedule: PaymentEvent[] = [];

  if (paymentsOnAccount) {
    schedule.push({
      date: '31 January 2026',
      label: '1st Payment on Account',
      amount: poaAmount,
      description: `50% of last year's tax bill (${formatGBP(input.previousYearTax)}). Also due: any balancing payment from last year.`,
    });
    schedule.push({
      date: '31 July 2026',
      label: '2nd Payment on Account',
      amount: poaAmount,
      description: `Second instalment — same amount as January.`,
    });
  }

  schedule.push({
    date: '31 January 2027',
    label: 'Balancing Payment',
    amount: balancingPayment,
    description: paymentsOnAccount
      ? `Difference between actual tax (${formatGBP(totalAnnualTax)}) and POAs already paid (${formatGBP(totalPoaPaid)}).${totalAnnualTax > totalPoaPaid ? '' : ' You may receive a refund if your actual tax is lower than estimated.'}`
      : `Full tax bill for 2025/26 — no payments on account as this is your first year or last year's bill was under £1,000.`,
  });

  if (!input.isFirstYear && totalAnnualTax >= 1000) {
    schedule.push({
      date: '31 January 2027',
      label: '1st POA for next year',
      amount: Math.round(totalAnnualTax / 2),
      description: `Also due on the same date — 50% of this year's tax as advance payment for next year.`,
    });
  }

  // Monthly/weekly reserve recommendation
  const totalDueThisYear = paymentsOnAccount
    ? poaAmount * 2 + balancingPayment
    : totalAnnualTax;
  const monthlyReserve = Math.ceil(totalDueThisYear / 12);
  const weeklyReserve = Math.ceil(totalDueThisYear / 52);

  return {
    incomeTax: freelanceTax,
    class4NICs: ni4,
    class2NICs: Math.round(ni2 * 100) / 100,
    studentLoan: slFreelance,
    totalAnnualTax,
    paymentsOnAccount,
    firstPaymentOnAccount: poaAmount,
    secondPaymentOnAccount: poaAmount,
    balancingPayment,
    schedule,
    monthlyReserve,
    weeklyReserve,
    taxChange: Math.round((totalAnnualTax - input.previousYearTax) * 100) / 100,
    taxChangePercent: input.previousYearTax > 0
      ? Math.round(((totalAnnualTax - input.previousYearTax) / input.previousYearTax) * 1000) / 10
      : 0,
  };
}

function formatGBP(n: number): string {
  return `£${Math.round(n).toLocaleString('en-GB')}`;
}
