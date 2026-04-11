export interface ExpenseCategory {
  id: string;
  name: string;
  claimable: 'yes' | 'partial' | 'no';
  explanation: string;
  soleTraderNotes?: string;
  ltdCompanyNotes?: string;
  hmrcRef?: string;
  examples?: string[];
  commonMistakes?: string;
}

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  // Office & workspace
  {
    id: 'home-office',
    name: 'Working from home',
    claimable: 'partial',
    explanation: 'You can claim a proportion of household costs (heating, electricity, broadband, council tax, rent/mortgage interest) based on the rooms and time used for work.',
    soleTraderNotes: 'Simplified method: claim £6/week (£312/year) flat rate with no receipts needed. Or calculate actual proportion of costs.',
    ltdCompanyNotes: 'The company can pay you £6/week tax-free, or reimburse actual costs with evidence of the business proportion.',
    examples: ['Electricity', 'Gas/heating', 'Broadband', 'Council tax', 'Rent (proportion)', 'Mortgage interest (proportion)'],
    commonMistakes: 'You cannot claim the full cost of any household bill — only the business proportion. Mortgage capital repayments are never allowable.',
  },
  {
    id: 'office-rent',
    name: 'Office or coworking space',
    claimable: 'yes',
    explanation: 'Rent for dedicated business premises, coworking memberships, and hot-desking fees are fully allowable.',
    examples: ['Office rent', 'Coworking membership', 'Hot desk fees', 'Business rates on premises'],
  },
  {
    id: 'office-supplies',
    name: 'Office supplies and stationery',
    claimable: 'yes',
    explanation: 'Day-to-day office supplies used for business purposes are fully allowable.',
    examples: ['Paper, pens, printer ink', 'Postage and packaging', 'Printer paper', 'Desk organiser'],
  },
  // Technology & equipment
  {
    id: 'computer-equipment',
    name: 'Computer and equipment',
    claimable: 'yes',
    explanation: 'Laptops, monitors, keyboards, and other equipment used primarily for business are allowable. If also used personally, only the business proportion is claimable.',
    soleTraderNotes: 'Claim the full cost as a business expense (capital allowance) in the year of purchase for items up to £1 million (Annual Investment Allowance).',
    ltdCompanyNotes: 'The company claims the cost as a capital allowance. If you buy it personally and use it for business, the company can reimburse you.',
    examples: ['Laptop/desktop', 'Monitor', 'Keyboard and mouse', 'Printer', 'External hard drive', 'Webcam', 'Headset'],
    commonMistakes: 'If an item is used both personally and for business (e.g., a laptop you also use for Netflix), only the business proportion is allowable.',
  },
  {
    id: 'software',
    name: 'Software and subscriptions',
    claimable: 'yes',
    explanation: 'Software licences, SaaS subscriptions, and cloud services used for business are fully allowable.',
    examples: ['Microsoft 365', 'Adobe Creative Cloud', 'Accounting software (FreeAgent, Xero)', 'Project management tools', 'Cloud hosting (AWS, Vercel)', 'Domain names', 'Email services'],
  },
  {
    id: 'phone',
    name: 'Phone and mobile',
    claimable: 'partial',
    explanation: 'Business calls and a proportion of your phone contract are allowable. A dedicated business phone is fully allowable.',
    soleTraderNotes: 'If you use a personal phone for business, claim only the business proportion of calls and data.',
    ltdCompanyNotes: 'The company can provide a phone as a tax-free benefit, or reimburse the business proportion of a personal phone.',
    examples: ['Business phone contract', 'Business calls on personal phone', 'VoIP service'],
  },
  // Travel
  {
    id: 'travel',
    name: 'Business travel',
    claimable: 'yes',
    explanation: 'Travel costs for business purposes (visiting clients, attending meetings) are allowable. Commuting to a regular workplace is NOT allowable.',
    soleTraderNotes: 'If you work from home, travel to client sites is business travel. If you have a permanent office, travel between home and office is commuting (not allowable).',
    examples: ['Train tickets to client meetings', 'Flights for business trips', 'Taxi/Uber to client site', 'Bus fares', 'Parking at client site', 'Congestion charge'],
    commonMistakes: 'Travel between your home and a permanent workplace (e.g., your office) is commuting and not allowable, even if you also work from home sometimes.',
  },
  {
    id: 'mileage',
    name: 'Car mileage (business journeys)',
    claimable: 'yes',
    explanation: 'You can claim mileage for business journeys using the HMRC approved rates: 45p/mile for the first 10,000 miles, then 25p/mile.',
    soleTraderNotes: 'Use simplified mileage rates (45p/25p) OR claim actual vehicle costs (fuel, insurance, repairs) — not both. Simplified rates are usually better for lower mileage.',
    ltdCompanyNotes: 'The company can reimburse you at 45p/mile tax-free. Keep a mileage log with dates, destinations, and business purpose.',
    examples: ['Driving to client meetings', 'Driving to conferences', 'Business deliveries'],
    commonMistakes: 'Commuting miles (home to regular workplace) are never allowable. Keep a mileage log — HMRC can ask for evidence.',
  },
  {
    id: 'accommodation',
    name: 'Business accommodation',
    claimable: 'yes',
    explanation: 'Hotel and accommodation costs for genuine business trips are allowable. The trip must have a clear business purpose.',
    examples: ['Hotel for client visit', 'Airbnb for conference', 'Accommodation for multi-day project'],
    commonMistakes: 'Weekends added to a business trip, or accommodation in your home city, are generally not allowable.',
  },
  {
    id: 'meals',
    name: 'Food and meals',
    claimable: 'partial',
    explanation: 'Meals are tricky. Subsistence (food during business travel away from your normal workplace) is allowable. Regular lunch at your desk is not.',
    soleTraderNotes: 'Only meal costs that are over and above what you would normally spend (i.e., because you\'re away from home on business) are allowable.',
    ltdCompanyNotes: 'Same rules apply. Client entertaining is NOT an allowable expense for tax purposes (but can be recorded as a company cost).',
    examples: ['Lunch during a client visit in another city', 'Dinner during an overnight business trip'],
    commonMistakes: 'Lunch at your desk, coffee from a café while working, and regular daily food are NOT allowable — even if you eat at your desk. Client entertaining is not tax-deductible.',
  },
  // Professional services
  {
    id: 'accountant',
    name: 'Accountant and bookkeeping',
    claimable: 'yes',
    explanation: 'Fees for accountants, bookkeepers, and tax advisors are fully allowable business expenses.',
    examples: ['Annual accounts preparation', 'Tax return filing', 'Bookkeeping services', 'VAT return preparation', 'Tax advice'],
  },
  {
    id: 'legal',
    name: 'Legal and professional fees',
    claimable: 'yes',
    explanation: 'Legal fees for business purposes (contract review, debt recovery, employment law) are allowable. Fees for buying property or settling personal disputes are not.',
    examples: ['Contract review', 'Terms and conditions drafting', 'IR35 status review', 'Debt recovery', 'Trademark registration'],
  },
  {
    id: 'insurance',
    name: 'Business insurance',
    claimable: 'yes',
    explanation: 'Insurance policies required for your business are fully allowable.',
    examples: ['Professional indemnity insurance', 'Public liability insurance', 'Employers\' liability insurance', 'Cyber insurance', 'Contents insurance for office'],
    commonMistakes: 'Personal insurance (life, health, income protection) is NOT a business expense for sole traders. For ltd companies, some policies can be a benefit-in-kind.',
  },
  // Training & development
  {
    id: 'training',
    name: 'Training and CPD',
    claimable: 'partial',
    explanation: 'Training that updates or maintains existing skills for your current trade is allowable. Training for an entirely new skill or career change is generally not.',
    soleTraderNotes: 'A web developer learning a new JavaScript framework = allowable. A web developer training as a plumber = not allowable.',
    examples: ['Online courses related to your field', 'Conference tickets', 'Professional certification renewals', 'Industry books and publications'],
    commonMistakes: 'The training must relate to your current trade. Learning an entirely new profession is not an allowable expense.',
  },
  {
    id: 'memberships',
    name: 'Professional memberships',
    claimable: 'yes',
    explanation: 'Subscriptions to professional bodies relevant to your work are allowable.',
    examples: ['RICS membership', 'BCS membership', 'ACCA/CIMA subscription', 'Trade association fees'],
  },
  // Marketing
  {
    id: 'marketing',
    name: 'Marketing and advertising',
    claimable: 'yes',
    explanation: 'Costs of promoting your business are fully allowable.',
    examples: ['Website hosting and domain', 'Google Ads / social media ads', 'Business cards', 'Brochures and printed materials', 'SEO services', 'PR services'],
  },
  {
    id: 'entertaining',
    name: 'Client entertaining',
    claimable: 'no',
    explanation: 'Client entertaining (meals, drinks, events with clients) is NOT an allowable deduction for tax purposes, even though it\'s a legitimate business cost.',
    commonMistakes: 'Many freelancers assume client dinners are tax-deductible — they are not. You can record them as a company expense, but you won\'t get tax relief.',
  },
  // Financial
  {
    id: 'bank-charges',
    name: 'Bank charges and interest',
    claimable: 'yes',
    explanation: 'Business bank account fees, card processing charges, and interest on business loans are allowable.',
    examples: ['Business account monthly fee', 'Payment processing fees (Stripe, PayPal)', 'Interest on business loan', 'Overdraft interest on business account'],
  },
  {
    id: 'pension',
    name: 'Pension contributions',
    claimable: 'partial',
    explanation: 'Pension contributions get tax relief but the mechanism differs between sole traders and limited companies.',
    soleTraderNotes: 'Personal pension contributions are not a business expense — but you get tax relief on contributions up to £60,000/year (or 100% of earnings) via your self-assessment return.',
    ltdCompanyNotes: 'Employer pension contributions from the company are a tax-deductible business expense AND don\'t attract National Insurance. This is one of the most tax-efficient ways to extract money from a limited company.',
  },
  // Clothing
  {
    id: 'clothing',
    name: 'Clothing',
    claimable: 'no',
    explanation: 'Everyday clothing is NOT allowable, even if you only wear it for work. Only specialist protective clothing or uniforms with a permanent logo are allowable.',
    examples: ['Safety boots', 'Hard hat', 'Hi-vis jacket', 'Branded uniform with company logo'],
    commonMistakes: 'A suit, even if you only wear it to client meetings, is not allowable. The test is whether the clothing could be worn in everyday life.',
  },
];

export type ExpenseSearchResult = ExpenseCategory & {
  relevanceScore: number;
};

export function searchExpenses(query: string): ExpenseSearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return EXPENSE_CATEGORIES
    .map((cat) => {
      let score = 0;
      if (cat.name.toLowerCase().includes(q)) score += 10;
      if (cat.explanation.toLowerCase().includes(q)) score += 5;
      if (cat.examples?.some((e) => e.toLowerCase().includes(q))) score += 8;
      if (cat.id.includes(q)) score += 3;
      // Partial word matching
      const words = q.split(/\s+/);
      for (const word of words) {
        if (word.length < 2) continue;
        if (cat.name.toLowerCase().includes(word)) score += 3;
        if (cat.explanation.toLowerCase().includes(word)) score += 2;
        if (cat.examples?.some((e) => e.toLowerCase().includes(word))) score += 3;
      }
      return { ...cat, relevanceScore: score };
    })
    .filter((r) => r.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
