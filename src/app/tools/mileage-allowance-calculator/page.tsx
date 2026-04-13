import type { Metadata } from 'next';
import MileageCalculator from '@/components/tools/MileageCalculator';
import { FAQSchema, WebAppSchema } from '@/components/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Mileage Allowance Calculator — HMRC Rates for Freelancers',
  description:
    'Calculate your HMRC mileage claim as a freelancer. Compare simplified rates (45p/25p per mile) vs actual costs. See your tax saving and keep a proper log.',
  keywords: [
    'mileage allowance calculator',
    'HMRC mileage rates 2025',
    '45p per mile calculator',
    'business mileage claim calculator',
    'self employed mileage claim',
    'AMAP rates calculator',
  ],
};

export default function MileageCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <WebAppSchema name="Mileage Allowance Calculator" description="Calculate your HMRC mileage claim. Compare simplified rates vs actual costs." url="https://freelancercalc.co.uk/tools/mileage-allowance-calculator" />
      <FAQSchema faqs={[
        { question: 'What is the HMRC mileage rate for 2026/27?', answer: 'For cars and vans: 45p per mile for the first 10,000 business miles, then 25p per mile above that. Motorcycles: 24p per mile. Bicycles: 20p per mile. Plus 5p per mile per passenger on business journeys (cars only).' },
        { question: 'Can I claim mileage for commuting to work?', answer: 'No. Commuting between your home and a regular, permanent workplace is not business mileage. However, if you work from home as your main base, travel to client sites and temporary workplaces IS claimable business mileage.' },
        { question: 'Should I use simplified mileage rates or actual costs?', answer: 'For most freelancers with moderate business mileage, the simplified HMRC rates (45p/25p) are better and simpler. Actual costs may be better if you drive an older, efficient car with low running costs. You must choose one method per vehicle per year and cannot switch mid-year.' },
      ]} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mileage Allowance Calculator</h1>
        <p className="mt-3 text-lg text-gray-600">
          How much can you claim for business mileage? Calculate your HMRC mileage allowance and
          compare it with actual vehicle costs to see which method saves you more.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          HMRC approved mileage rates &middot; 2026/27 tax year
        </p>
      </div>

      <MileageCalculator />

      <section className="mt-16 border-t border-gray-200 pt-12">
        <h2 className="text-2xl font-bold text-gray-900">Mileage claims for freelancers</h2>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-600">
          <h3 className="pt-2 text-base font-semibold text-gray-900">Two methods: simplified vs actual</h3>
          <p>
            HMRC offers two ways to claim vehicle expenses. The simplified method uses flat rates
            (45p/mile for cars) and requires no receipts for fuel — just a mileage log. The actual
            cost method requires keeping all vehicle receipts and calculating the business proportion.
          </p>
          <p>
            Once you choose a method for a vehicle, you must stick with it for that vehicle for as long
            as you use it in your business. Most freelancers choose simplified rates because they&apos;re
            easier and often give a higher claim.
          </p>

          <h3 className="pt-2 text-base font-semibold text-gray-900">Electric and hybrid vehicles</h3>
          <p>
            The 45p/mile rate applies to all cars regardless of fuel type — petrol, diesel, electric,
            and hybrid all get the same rate. For electric vehicle owners, the simplified rate is
            often significantly more generous than actual electricity costs.
          </p>

          <p className="pt-4 text-xs text-gray-400">
            Always keep a contemporaneous mileage log with date, start/end location, business purpose,
            and miles. HMRC can request this during an investigation. Digital apps like MileIQ can automate tracking.
          </p>
        </div>
      </section>
    </div>
  );
}
