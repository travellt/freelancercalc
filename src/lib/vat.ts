import { VAT_THRESHOLD, VAT_DEREGISTRATION, VAT_STANDARD_RATE } from './tax';

export interface VatInput {
  monthlyRevenue: number;
  monthlyExpensesWithVat: number;
  revenueToDate: number;
  flatRateCategory: string;
  clientType: 'b2b' | 'b2c' | 'mixed';
}

export interface VatResult {
  threshold: number;
  revenueToDate: number;
  remainingBeforeThreshold: number;
  monthsUntilThreshold: number | null;
  mustRegister: boolean;
  percentOfThreshold: number;
  annualRevenue: number;

  // Standard scheme
  vatCollectedAnnual: number;
  vatOnExpensesAnnual: number;
  netVatCostAnnual: number;
  effectiveCostPercent: number;

  // Flat Rate Scheme
  flatRatePercent: number;
  flatRateCategoryName: string;
  flatRateVatDue: number;
  flatRateSaving: number;
  flatRateBetter: boolean;

  // Pricing scenarios
  revenueWithVat: number;
  revenueIfAbsorbVat: number;

  // Voluntary registration recommendation
  voluntaryRegRecommended: boolean;
  voluntaryRegReason: string;
}

export const FLAT_RATE_CATEGORIES = [
  { id: 'accountancy', name: 'Accountancy or bookkeeping', rate: 14.5 },
  { id: 'advertising', name: 'Advertising', rate: 11.0 },
  { id: 'architect', name: 'Architect, civil or structural engineer', rate: 14.5 },
  { id: 'boarding-care', name: 'Boarding or care of animals', rate: 12.0 },
  { id: 'computer-it', name: 'Computer and IT consultancy', rate: 14.5 },
  { id: 'computer-repair', name: 'Computer repair services', rate: 10.5 },
  { id: 'consulting', name: 'Management consultancy', rate: 14.0 },
  { id: 'design', name: 'Architect, surveyor or design consultancy', rate: 14.5 },
  { id: 'entertainment', name: 'Entertainment or journalism', rate: 12.5 },
  { id: 'estate-agent', name: 'Estate agent or property management', rate: 12.0 },
  { id: 'financial-services', name: 'Financial services', rate: 13.5 },
  { id: 'film-photo', name: 'Film, radio, TV or video production', rate: 13.0 },
  { id: 'hairdressing', name: 'Hairdressing or other beauty treatment', rate: 13.0 },
  { id: 'health', name: 'Health (not vets)', rate: 10.5 },
  { id: 'hiring-goods', name: 'Hiring or renting goods', rate: 9.5 },
  { id: 'hotel', name: 'Hotel or accommodation', rate: 10.5 },
  { id: 'investigation', name: 'Investigation or security', rate: 12.0 },
  { id: 'labour-only', name: 'Labour-only building or construction', rate: 14.5 },
  { id: 'laundry', name: 'Laundry or dry cleaning', rate: 12.0 },
  { id: 'lawyer', name: 'Lawyer or legal services', rate: 14.5 },
  { id: 'library-archive', name: 'Library, archive, museum or cultural', rate: 9.5 },
  { id: 'photography', name: 'Photography', rate: 11.0 },
  { id: 'post-office', name: 'Post office', rate: 5.0 },
  { id: 'printing', name: 'Printing', rate: 8.5 },
  { id: 'publishing', name: 'Publishing', rate: 11.0 },
  { id: 'repairing-personal', name: 'Repairing personal or household goods', rate: 10.0 },
  { id: 'repairing-vehicles', name: 'Repairing vehicles', rate: 8.5 },
  { id: 'secretarial', name: 'Secretarial services', rate: 13.0 },
  { id: 'social-work', name: 'Social work or care', rate: 11.0 },
  { id: 'sport-recreation', name: 'Sport or recreation', rate: 8.5 },
  { id: 'teaching', name: 'Teaching or tutoring', rate: 12.0 },
  { id: 'transport', name: 'Transport or storage', rate: 10.0 },
  { id: 'travel-agency', name: 'Travel agency', rate: 10.5 },
  { id: 'veterinary', name: 'Veterinary medicine', rate: 11.0 },
  { id: 'waste', name: 'Waste or recycling', rate: 10.5 },
  { id: 'writing', name: 'Writing, copywriting or content creation', rate: 12.0 },
  { id: 'other', name: 'Any other activity not listed', rate: 12.0 },
] as const;

export function calculateVat(input: VatInput): VatResult {
  const annualRevenue = input.monthlyRevenue * 12;
  const annualExpensesWithVat = input.monthlyExpensesWithVat * 12;

  const remainingBeforeThreshold = Math.max(0, VAT_THRESHOLD - input.revenueToDate);
  const mustRegister = input.revenueToDate >= VAT_THRESHOLD;

  let monthsUntilThreshold: number | null = null;
  if (!mustRegister && input.monthlyRevenue > 0) {
    monthsUntilThreshold = Math.ceil(remainingBeforeThreshold / input.monthlyRevenue);
  }

  const percentOfThreshold = Math.min(100, Math.round((input.revenueToDate / VAT_THRESHOLD) * 1000) / 10);

  // Standard scheme
  const vatCollected = annualRevenue * VAT_STANDARD_RATE;
  const vatOnExpenses = annualExpensesWithVat * (VAT_STANDARD_RATE / (1 + VAT_STANDARD_RATE));
  const netVatCost = vatCollected - vatOnExpenses;
  const effectiveCostPercent = annualRevenue > 0 ? Math.round((netVatCost / annualRevenue) * 1000) / 10 : 0;

  // Flat Rate Scheme
  const category = FLAT_RATE_CATEGORIES.find(c => c.id === input.flatRateCategory) ?? FLAT_RATE_CATEGORIES.find(c => c.id === 'computer-it')!;
  const grossIncVat = annualRevenue * (1 + VAT_STANDARD_RATE);
  const flatRateVatDue = Math.round(grossIncVat * (category.rate / 100) * 100) / 100;
  const flatRateSaving = Math.round((netVatCost - flatRateVatDue) * 100) / 100;

  // Voluntary registration recommendation
  let voluntaryRegRecommended = false;
  let voluntaryRegReason = '';

  if (!mustRegister) {
    if (input.clientType === 'b2b') {
      voluntaryRegRecommended = true;
      voluntaryRegReason = 'Most of your clients are VAT-registered businesses who can reclaim the VAT you charge — so it costs them nothing. You can reclaim VAT on your own expenses, and it signals a more established business.';
    } else if (input.clientType === 'mixed' && vatOnExpenses > annualRevenue * 0.03) {
      voluntaryRegRecommended = true;
      voluntaryRegReason = 'You have enough VAT-reclaimable expenses to offset a meaningful portion of the VAT you\'d collect. Since many of your clients are businesses, most won\'t mind the VAT.';
    } else if (input.clientType === 'b2c') {
      voluntaryRegReason = 'Most of your clients are consumers who can\'t reclaim VAT, so registering would effectively increase your prices by 20% or reduce your revenue. Avoid registering unless required.';
    }
  }

  return {
    threshold: VAT_THRESHOLD,
    revenueToDate: input.revenueToDate,
    remainingBeforeThreshold: Math.round(remainingBeforeThreshold),
    monthsUntilThreshold,
    mustRegister,
    percentOfThreshold,
    annualRevenue,
    vatCollectedAnnual: Math.round(vatCollected),
    vatOnExpensesAnnual: Math.round(vatOnExpenses),
    netVatCostAnnual: Math.round(netVatCost),
    effectiveCostPercent,
    flatRatePercent: category.rate,
    flatRateCategoryName: category.name,
    flatRateVatDue: Math.round(flatRateVatDue),
    flatRateSaving: Math.round(flatRateSaving),
    flatRateBetter: flatRateSaving > 0,
    revenueWithVat: Math.round(annualRevenue * (1 + VAT_STANDARD_RATE)),
    revenueIfAbsorbVat: Math.round(annualRevenue / (1 + VAT_STANDARD_RATE)),
    voluntaryRegRecommended,
    voluntaryRegReason,
  };
}
