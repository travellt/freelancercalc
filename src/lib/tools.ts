export interface Tool {
  slug: string;
  title: string;
  description: string;
  category: 'tax' | 'business' | 'money' | 'career';
  tier: 1 | 2 | 3;
  available: boolean;
}

export const TOOLS: Tool[] = [
  {
    slug: 'take-home-pay-calculator',
    title: 'Take-Home Pay Calculator',
    description: 'Compare your take-home pay as a sole trader vs limited company. See exactly what you keep after tax, NICs, and dividends.',
    category: 'tax',
    tier: 1,
    available: true,
  },
  {
    slug: 'day-rate-calculator',
    title: 'Day Rate Calculator',
    description: 'Work out the day rate you need to charge to match a permanent salary — accounting for holidays, sick days, pension, and tax.',
    category: 'career',
    tier: 1,
    available: true,
  },
  {
    slug: 'ir35-status-checker',
    title: 'IR35 Status Checker',
    description: 'Assess your IR35 status with a clear, guided questionnaire based on HMRC criteria.',
    category: 'tax',
    tier: 1,
    available: true,
  },
  {
    slug: 'vat-registration-checker',
    title: 'VAT Registration Checker',
    description: 'Track your turnover against the VAT threshold and model the impact of voluntary registration.',
    category: 'tax',
    tier: 1,
    available: true,
  },
  {
    slug: 'quarterly-tax-estimator',
    title: 'Quarterly Tax Estimator',
    description: 'Estimate your quarterly payments on account so you\'re never caught short by HMRC.',
    category: 'tax',
    tier: 2,
    available: true,
  },
  {
    slug: 'dividend-salary-optimiser',
    title: 'Dividend vs Salary Optimiser',
    description: 'Find the optimal salary/dividend split for limited company directors to minimise tax.',
    category: 'tax',
    tier: 2,
    available: true,
  },
  {
    slug: 'freelancer-pension-calculator',
    title: 'Freelancer Pension Calculator',
    description: 'See how much you need to save for retirement when there\'s no employer contribution.',
    category: 'money',
    tier: 2,
    available: true,
  },
  {
    slug: 'expense-checker',
    title: 'Business Expense Checker',
    description: 'Find out which expenses you can claim as a freelancer — with HMRC-compliant explanations.',
    category: 'tax',
    tier: 2,
    available: true,
  },
];

export function getAvailableTools(): Tool[] {
  return TOOLS.filter(t => t.available);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find(t => t.slug === slug);
}

export const CATEGORY_LABELS: Record<Tool['category'], string> = {
  tax: 'Tax & Compliance',
  business: 'Business Planning',
  money: 'Money & Pension',
  career: 'Rates & Career',
};
