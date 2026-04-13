import { describe, it, expect } from 'vitest';
import {
  effectivePersonalAllowance,
  incomeTax,
  class4NICs,
  class1EmployeeNICs,
  class1EmployerNICs,
  corporationTax,
  dividendTax,
  studentLoanRepayment,
  NI2_WEEKLY,
  NI2_ANNUAL,
  PERSONAL_ALLOWANCE,
  BASIC_RATE_LIMIT,
  HIGHER_RATE_LIMIT,
  NI1_EMPLOYER_RATE,
  NI1_EMPLOYER_THRESHOLD,
  DIVIDEND_BASIC_RATE,
  DIVIDEND_HIGHER_RATE,
  DIVIDEND_ADDITIONAL_RATE,
  DIVIDEND_ALLOWANCE,
} from './tax';

// Helper: round to 2dp for comparison
const r = (n: number) => Math.round(n * 100) / 100;

describe('2026/27 Tax Year Constants', () => {
  it('has correct personal allowance', () => {
    expect(PERSONAL_ALLOWANCE).toBe(12_570);
  });

  it('has correct basic rate limit', () => {
    expect(BASIC_RATE_LIMIT).toBe(50_270);
  });

  it('has correct higher rate limit', () => {
    expect(HIGHER_RATE_LIMIT).toBe(125_140);
  });

  it('has correct Class 2 NI rate', () => {
    expect(NI2_WEEKLY).toBe(3.65);
    expect(r(NI2_ANNUAL)).toBe(189.80);
  });

  it('has correct employer NI rate (15% from April 2025)', () => {
    expect(NI1_EMPLOYER_RATE).toBe(0.15);
    expect(NI1_EMPLOYER_THRESHOLD).toBe(5_000);
  });

  it('has correct dividend rates (increased April 2026)', () => {
    expect(DIVIDEND_BASIC_RATE).toBe(0.1075);
    expect(DIVIDEND_HIGHER_RATE).toBe(0.3575);
    expect(DIVIDEND_ADDITIONAL_RATE).toBe(0.3935);
    expect(DIVIDEND_ALLOWANCE).toBe(500);
  });
});

describe('Personal Allowance', () => {
  it('returns full PA below £100k', () => {
    expect(effectivePersonalAllowance(50_000)).toBe(12_570);
    expect(effectivePersonalAllowance(100_000)).toBe(12_570);
  });

  it('tapers £1 for every £2 above £100k', () => {
    expect(effectivePersonalAllowance(101_000)).toBe(12_070); // lose £500
    expect(effectivePersonalAllowance(110_000)).toBe(7_570);  // lose £5,000
    expect(effectivePersonalAllowance(120_000)).toBe(2_570);  // lose £10,000
  });

  it('reaches zero at £125,140', () => {
    expect(effectivePersonalAllowance(125_140)).toBe(0);
    expect(effectivePersonalAllowance(130_000)).toBe(0);
    expect(effectivePersonalAllowance(200_000)).toBe(0);
  });
});

describe('Income Tax — England/Wales/NI', () => {
  it('returns 0 below personal allowance', () => {
    expect(incomeTax(0)).toBe(0);
    expect(incomeTax(12_570)).toBe(0);
  });

  it('calculates basic rate correctly', () => {
    // £20,000: taxable = £7,430 at 20% = £1,486
    expect(incomeTax(20_000)).toBe(1_486);
  });

  it('calculates at basic/higher boundary', () => {
    // £50,270: taxable = £37,700 at 20% = £7,540
    expect(incomeTax(50_270)).toBe(7_540);
  });

  it('calculates higher rate correctly', () => {
    // £60,000: basic band £37,700 × 20% = £7,540
    //          higher band £9,730 × 40% = £3,892
    //          total = £11,432
    expect(incomeTax(60_000)).toBe(11_432);
  });

  it('calculates with PA taper at £110k', () => {
    // PA = £7,570. Taxable = £102,430
    // Basic: £37,700 × 20% = £7,540
    // Higher: £102,430 - £37,700 = £64,730 × 40% = £25,892
    // Total: £33,432
    expect(incomeTax(110_000)).toBe(33_432);
  });

  it('calculates additional rate with PA taper', () => {
    // £150,000: PA = 0 (fully tapered). Taxable = £150,000.
    // Band boundaries use PERSONAL_ALLOWANCE constant for widths:
    // Basic: £37,700 × 20% = £7,540
    // Higher: £74,870 × 40% = £29,948
    // Additional: £150,000 - (125,140 - 12,570) = £37,430 × 45% = £16,843.50
    // Total: £54,331.50
    // (The PA taper creates an effective 60% rate between £100k-£125,140)
    expect(incomeTax(150_000)).toBe(54_331.50);
  });
});

describe('Income Tax — Scotland', () => {
  it('returns 0 below personal allowance', () => {
    expect(incomeTax(12_570, 'scotland')).toBe(0);
  });

  it('calculates starter rate', () => {
    // £15,000: taxable = £2,430
    // Starter band (up to £3,967) at 19%: £2,430 × 0.19 = £461.70
    expect(incomeTax(15_000, 'scotland')).toBe(461.70);
  });

  it('calculates across multiple Scottish bands', () => {
    // £30,000: taxable = £17,430
    // Starter: £3,967 × 19% = £753.73
    // Basic: (£16,956 - £3,967) = £12,989 × 20% = £2,597.80
    // Intermediate: (£17,430 - £16,956) = £474 × 21% = £99.54
    // Total: £3,451.07
    expect(incomeTax(30_000, 'scotland')).toBe(3_451.07);
  });

  it('is slightly higher than England at typical freelancer income', () => {
    // At £50,000, Scotland should be slightly more than England
    const englandTax = incomeTax(50_000, 'england');
    const scotlandTax = incomeTax(50_000, 'scotland');
    expect(scotlandTax).toBeGreaterThan(englandTax);
  });
});

describe('Class 4 NICs', () => {
  it('returns 0 below lower profits limit', () => {
    expect(class4NICs(0)).toBe(0);
    expect(class4NICs(12_570)).toBe(0);
  });

  it('calculates main rate band correctly', () => {
    // £30,000: (30,000 - 12,570) × 6% = £1,045.80
    expect(class4NICs(30_000)).toBe(1_045.80);
  });

  it('calculates at upper profits limit', () => {
    // £50,270: (50,270 - 12,570) × 6% = £2,262
    expect(class4NICs(50_270)).toBe(2_262);
  });

  it('calculates additional rate above UPL', () => {
    // £60,000: main = £2,262 + additional = (60,000 - 50,270) × 2% = £194.60
    expect(class4NICs(60_000)).toBe(2_456.60);
  });
});

describe('Class 1 Employee NICs', () => {
  it('returns 0 at or below primary threshold', () => {
    expect(class1EmployeeNICs(12_570)).toBe(0);
  });

  it('calculates at typical salary', () => {
    // £30,000: (30,000 - 12,570) × 8% = £1,394.40
    expect(class1EmployeeNICs(30_000)).toBe(1_394.40);
  });

  it('returns 0 for optimal director salary at PA', () => {
    // £12,570 salary = exactly at threshold, no NICs
    expect(class1EmployeeNICs(12_570)).toBe(0);
  });
});

describe('Class 1 Employer NICs', () => {
  it('returns 0 below threshold', () => {
    expect(class1EmployerNICs(5_000)).toBe(0);
  });

  it('calculates at 15% above £5,000', () => {
    // £12,570: (12,570 - 5,000) × 15% = £1,135.50
    expect(class1EmployerNICs(12_570)).toBe(1_135.50);
  });

  it('calculates at higher salary', () => {
    // £50,000: (50,000 - 5,000) × 15% = £6,750
    expect(class1EmployerNICs(50_000)).toBe(6_750);
  });
});

describe('Corporation Tax', () => {
  it('returns 0 for zero or negative profits', () => {
    expect(corporationTax(0)).toBe(0);
    expect(corporationTax(-1000)).toBe(0);
  });

  it('calculates small profits rate (19%) up to £50k', () => {
    expect(corporationTax(30_000)).toBe(5_700);
    expect(corporationTax(50_000)).toBe(9_500);
  });

  it('calculates main rate (25%) at £250k+', () => {
    expect(corporationTax(250_000)).toBe(62_500);
    expect(corporationTax(500_000)).toBe(125_000);
  });

  it('applies marginal relief between £50k-£250k', () => {
    // At £100k: main tax = £25,000, relief = (250,000 - 100,000) × 3/200 = £2,250
    // Effective = £22,750
    expect(corporationTax(100_000)).toBe(22_750);

    // At £150k: main tax = £37,500, relief = (250,000 - 150,000) × 3/200 = £1,500
    // Effective = £36,000
    expect(corporationTax(150_000)).toBe(36_000);
  });

  it('has smooth transition from 19% to 25%', () => {
    // Just above £50k should be slightly more than 19%
    const justAbove = corporationTax(50_001);
    expect(justAbove).toBeGreaterThan(50_001 * 0.19);
    expect(justAbove).toBeLessThan(50_001 * 0.25);
  });
});

describe('Dividend Tax', () => {
  it('returns 0 within allowance', () => {
    // £500 dividends with no other income — within allowance
    expect(dividendTax(500, 12_570)).toBe(0);
  });

  it('returns 0 for zero dividends', () => {
    expect(dividendTax(0, 50_000)).toBe(0);
  });

  it('calculates basic rate dividends', () => {
    // £10,000 dividends, salary £12,570
    // Taxable dividends after £500 allowance: £9,500
    // All in basic band: £9,500 × 10.75% = £1,021.25
    expect(dividendTax(10_000, 12_570)).toBe(1_021.25);
  });

  it('calculates dividends crossing into higher rate', () => {
    // £40,000 dividends, salary £12,570
    // Total income = £52,570. PA = £12,570. Taxable = £40,000.
    // Salary uses £12,570 of PA. Dividend taxable = £40,000 - £500 allowance = £39,500
    // Basic band remaining: £37,700 - 0 (salary at PA) - £500 = £37,200 at basic
    // Wait — let me think more carefully.
    // otherTaxable = max(0, 12,570 - 12,570) = 0
    // totalTaxable = max(0, 52,570 - 12,570) = 40,000
    // taxableDividends = 40,000 - 0 = 40,000
    // After allowance: 39,500
    // cursor starts at 0 + 500 = 500
    // basicCeiling = 37,700
    // inBasic = min(39,500, 37,700 - 500) = 37,200 × 10.75% = £3,999
    // cursor = 37,700, remaining = 2,300
    // higherCeiling = 112,570
    // inHigher = min(2,300, 112,570 - 37,700) = 2,300 × 35.75% = £822.25
    // Total: £4,821.25
    expect(dividendTax(40_000, 12_570)).toBe(4_821.25);
  });
});

describe('Student Loan Repayments', () => {
  it('returns 0 below threshold', () => {
    expect(studentLoanRepayment(26_900, 'plan1')).toBe(0);
    expect(studentLoanRepayment(29_385, 'plan2')).toBe(0);
    expect(studentLoanRepayment(33_795, 'plan4')).toBe(0);
  });

  it('calculates Plan 1 correctly (threshold £26,900)', () => {
    // £40,000: (40,000 - 26,900) × 9% = £1,179
    expect(studentLoanRepayment(40_000, 'plan1')).toBe(1_179);
  });

  it('calculates Plan 2 correctly (threshold £29,385)', () => {
    // £40,000: (40,000 - 29,385) × 9% = £955.35
    expect(studentLoanRepayment(40_000, 'plan2')).toBe(955.35);
  });

  it('calculates Plan 4 correctly (threshold £33,795)', () => {
    // £40,000: (40,000 - 33,795) × 9% = £558.45
    expect(studentLoanRepayment(40_000, 'plan4')).toBe(558.45);
  });

  it('calculates Postgraduate correctly (threshold £21,000, 6%)', () => {
    // £40,000: (40,000 - 21,000) × 6% = £1,140
    expect(studentLoanRepayment(40_000, 'postgrad')).toBe(1_140);
  });

  it('returns 0 for no loan', () => {
    expect(studentLoanRepayment(100_000, 'none')).toBe(0);
  });
});

describe('Cross-validation: Sole Trader full calculation', () => {
  it('matches manual calculation at £45,000 profit', () => {
    const profit = 45_000;
    const tax = incomeTax(profit);     // (45,000 - 12,570) at 20% = £6,486
    const ni4 = class4NICs(profit);    // (45,000 - 12,570) × 6% = £1,945.80
    const ni2 = r(NI2_ANNUAL);         // £189.80
    const total = r(tax + ni4 + ni2);
    const takeHome = r(profit - total);

    expect(tax).toBe(6_486);
    expect(ni4).toBe(1_945.80);
    expect(ni2).toBe(189.80);
    expect(total).toBe(8_621.60);
    expect(takeHome).toBe(36_378.40);
  });
});

describe('Cross-validation: Ltd Company full calculation', () => {
  it('matches manual calculation at £60,000 profit with £12,570 salary', () => {
    const grossProfit = 60_000;
    const salary = 12_570;

    const empNI = class1EmployerNICs(salary);
    expect(empNI).toBe(1_135.50);

    const companyProfit = grossProfit - salary - empNI; // 46,294.50
    expect(r(companyProfit)).toBe(46_294.50);

    const ct = corporationTax(companyProfit); // 46,294.50 × 19% = 8,795.96
    expect(ct).toBe(8_795.96);

    const dividends = r(companyProfit - ct); // 37,498.54
    expect(dividends).toBe(37_498.54);

    // Salary tax: £12,570 salary, PA = £12,570, taxable = 0
    const salaryTax = incomeTax(salary);
    expect(salaryTax).toBe(0);

    // Employee NI: at threshold, = 0
    const salaryNI = class1EmployeeNICs(salary);
    expect(salaryNI).toBe(0);

    // Dividend tax: dividends on top of £12,570 salary
    const divTax = dividendTax(dividends, salary);
    // £500 allowance. Remaining: 36,998.54
    // Basic band: (37,700 - 0 - 500) = 37,200 available. Use 36,998.54 × 10.75% = 3,977.34
    // All fits in basic band since 36,998.54 < 37,200
    expect(divTax).toBe(3_977.34);

    const takeHome = r(salary + dividends - divTax);
    expect(takeHome).toBe(46_091.20);
  });
});
