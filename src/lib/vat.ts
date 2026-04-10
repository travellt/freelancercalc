import { VAT_THRESHOLD, VAT_DEREGISTRATION, VAT_STANDARD_RATE } from './tax';

export interface VatInput {
  monthlyRevenue: number;
  monthlyExpensesWithVat: number; // expenses that include VAT (supplies, software, etc.)
  monthsTrading: number; // how many months you've been trading this period
  revenueToDate: number; // total revenue in the current rolling 12 months
}

export interface VatResult {
  // Threshold tracking
  threshold: number;
  revenueToDate: number;
  remainingBeforeThreshold: number;
  monthsUntilThreshold: number | null; // null = won't hit it at current rate
  mustRegister: boolean;
  percentOfThreshold: number;

  // Voluntary registration analysis
  vatCollectedAnnual: number;
  vatOnExpensesAnnual: number;
  netVatCostAnnual: number; // what you'd owe HMRC
  effectiveCostPercent: number; // net VAT cost as % of revenue

  // Flat Rate Scheme
  flatRatePercent: number; // typical for "computer consultancy" etc.
  flatRateVatDue: number;
  flatRateSaving: number; // compared to standard scheme

  // Revenue impact
  revenueWithVat: number; // what you'd charge with VAT on top
  revenueIfAbsorbVat: number; // if you keep prices the same (eat the VAT)
}

// Common Flat Rate Scheme percentages by trade
const FLAT_RATE_CATEGORIES: Record<string, number> = {
  'computer-it': 14.5,
  'management-consultancy': 14.0,
  'architect-surveyor': 14.5,
  'accountancy': 14.5,
  'advertising': 11.0,
  'photography': 11.0,
  'publishing': 11.0,
  'general': 12.0,
};

export function calculateVat(input: VatInput): VatResult {
  const annualRevenue = input.monthlyRevenue * 12;
  const annualExpensesWithVat = input.monthlyExpensesWithVat * 12;

  // Threshold tracking
  const remainingBeforeThreshold = Math.max(0, VAT_THRESHOLD - input.revenueToDate);
  const mustRegister = input.revenueToDate >= VAT_THRESHOLD;

  let monthsUntilThreshold: number | null = null;
  if (!mustRegister && input.monthlyRevenue > 0) {
    const monthsLeft = remainingBeforeThreshold / input.monthlyRevenue;
    monthsUntilThreshold = Math.ceil(monthsLeft);
  }

  const percentOfThreshold = Math.min(100, Math.round((input.revenueToDate / VAT_THRESHOLD) * 1000) / 10);

  // Standard VAT scheme analysis
  const vatCollected = annualRevenue * VAT_STANDARD_RATE;
  const vatOnExpenses = annualExpensesWithVat * (VAT_STANDARD_RATE / (1 + VAT_STANDARD_RATE)); // extract VAT from gross
  const netVatCost = vatCollected - vatOnExpenses;
  const effectiveCostPercent = annualRevenue > 0
    ? Math.round((netVatCost / annualRevenue) * 1000) / 10
    : 0;

  // Flat Rate Scheme (using IT consultancy as default — most common for freelancers)
  const flatRatePercent = FLAT_RATE_CATEGORIES['computer-it'];
  const grossWithVat = annualRevenue * (1 + VAT_STANDARD_RATE);
  const flatRateVatDue = Math.round(grossWithVat * (flatRatePercent / 100) * 100) / 100;
  const flatRateSaving = Math.round((netVatCost - flatRateVatDue) * 100) / 100;

  return {
    threshold: VAT_THRESHOLD,
    revenueToDate: input.revenueToDate,
    remainingBeforeThreshold: Math.round(remainingBeforeThreshold),
    monthsUntilThreshold,
    mustRegister,
    percentOfThreshold,

    vatCollectedAnnual: Math.round(vatCollected),
    vatOnExpensesAnnual: Math.round(vatOnExpenses),
    netVatCostAnnual: Math.round(netVatCost),
    effectiveCostPercent,

    flatRatePercent,
    flatRateVatDue: Math.round(flatRateVatDue),
    flatRateSaving: Math.round(flatRateSaving),

    revenueWithVat: Math.round(annualRevenue * (1 + VAT_STANDARD_RATE)),
    revenueIfAbsorbVat: Math.round(annualRevenue / (1 + VAT_STANDARD_RATE)),
  };
}
