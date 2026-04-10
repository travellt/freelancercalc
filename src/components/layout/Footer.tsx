import Link from 'next/link';
import { TAX_YEAR } from '@/lib/tax';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">FreelancerCalc</h3>
            <p className="mt-2 text-sm text-gray-500">
              Free, accurate tools for UK freelancers, contractors, and sole traders. Tax year {TAX_YEAR}.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Tools</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/tools/take-home-pay-calculator" className="text-sm text-gray-500 hover:text-brand-600">
                  Take-Home Pay Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools/day-rate-calculator" className="text-sm text-gray-500 hover:text-brand-600">
                  Day Rate Calculator
                </Link>
              </li>
              <li>
                <Link href="/tools" className="text-sm text-gray-500 hover:text-brand-600">
                  View all tools →
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Info</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/about" className="text-sm text-gray-500 hover:text-brand-600">About</Link>
              </li>
              <li>
                <Link href="/guides" className="text-sm text-gray-500 hover:text-brand-600">Guides</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          <p>
            FreelancerCalc provides estimates for informational purposes only. Always consult a qualified
            accountant for tax advice specific to your situation.
          </p>
          <p className="mt-2">© {new Date().getFullYear()} FreelancerCalc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
