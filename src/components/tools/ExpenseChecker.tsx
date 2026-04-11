'use client';

import { useState, useMemo } from 'react';
import { EXPENSE_CATEGORIES, searchExpenses, type ExpenseCategory } from '@/lib/expenses';

function StatusBadge({ status }: { status: ExpenseCategory['claimable'] }) {
  const styles = {
    yes: 'bg-green-100 text-green-800 border-green-200',
    partial: 'bg-amber-100 text-amber-800 border-amber-200',
    no: 'bg-red-100 text-red-800 border-red-200',
  };
  const labels = { yes: 'Allowable', partial: 'Partially allowable', no: 'Not allowable' };

  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function ExpenseCard({ expense, structure }: { expense: ExpenseCategory; structure: 'sole-trader' | 'limited-company' }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rounded-xl border p-5 transition-colors ${
      expense.claimable === 'yes' ? 'border-green-200 bg-green-50/30' :
      expense.claimable === 'partial' ? 'border-amber-200 bg-amber-50/30' :
      'border-red-200 bg-red-50/30'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{expense.name}</h3>
          <StatusBadge status={expense.claimable} />
        </div>
        <button onClick={() => setExpanded(!expanded)}
          className="shrink-0 text-sm text-brand-600 hover:text-brand-700">
          {expanded ? 'Less' : 'More'}
        </button>
      </div>

      <p className="mt-3 text-sm text-gray-600">{expense.explanation}</p>

      {expanded && (
        <div className="mt-4 space-y-3">
          {/* Structure-specific notes */}
          {structure === 'sole-trader' && expense.soleTraderNotes && (
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs font-medium text-blue-700">As a sole trader</p>
              <p className="mt-1 text-xs text-blue-600">{expense.soleTraderNotes}</p>
            </div>
          )}
          {structure === 'limited-company' && expense.ltdCompanyNotes && (
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs font-medium text-blue-700">As a limited company</p>
              <p className="mt-1 text-xs text-blue-600">{expense.ltdCompanyNotes}</p>
            </div>
          )}

          {/* Examples */}
          {expense.examples && expense.examples.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700">Examples:</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {expense.examples.map((ex) => (
                  <span key={ex} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">{ex}</span>
                ))}
              </div>
            </div>
          )}

          {/* Common mistakes */}
          {expense.commonMistakes && (
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-xs font-medium text-red-700">Common mistake</p>
              <p className="mt-1 text-xs text-red-600">{expense.commonMistakes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ExpenseChecker() {
  const [query, setQuery] = useState('');
  const [structure, setStructure] = useState<'sole-trader' | 'limited-company'>('sole-trader');
  const [filter, setFilter] = useState<'all' | 'yes' | 'partial' | 'no'>('all');

  const results = useMemo(() => {
    if (query.trim()) {
      const searched = searchExpenses(query);
      if (filter === 'all') return searched;
      return searched.filter((r) => r.claimable === filter);
    }
    const cats = EXPENSE_CATEGORIES;
    if (filter === 'all') return cats;
    return cats.filter((c) => c.claimable === filter);
  }, [query, filter]);

  const counts = useMemo(() => ({
    all: EXPENSE_CATEGORIES.length,
    yes: EXPENSE_CATEGORIES.filter(c => c.claimable === 'yes').length,
    partial: EXPENSE_CATEGORIES.filter(c => c.claimable === 'partial').length,
    no: EXPENSE_CATEGORIES.filter(c => c.claimable === 'no').length,
  }), []);

  return (
    <div>
      {/* Search and filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search expenses... e.g. 'laptop', 'travel', 'lunch', 'training'"
            className="block w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 shadow-sm transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex gap-2">
            {(['sole-trader', 'limited-company'] as const).map((s) => (
              <button key={s} onClick={() => setStructure(s)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  structure === s ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {s === 'sole-trader' ? 'Sole trader' : 'Limited company'}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            {([
              { value: 'all' as const, label: `All (${counts.all})` },
              { value: 'yes' as const, label: `Allowable (${counts.yes})` },
              { value: 'partial' as const, label: `Partial (${counts.partial})` },
              { value: 'no' as const, label: `Not allowable (${counts.no})` },
            ]).map((f) => (
              <button key={f.value} onClick={() => setFilter(f.value)}
                className={`rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                  filter === f.value ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 space-y-4">
        {results.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
            <p className="text-gray-500">No expenses match your search. Try different keywords.</p>
          </div>
        ) : (
          results.map((expense) => (
            <ExpenseCard key={expense.id} expense={expense} structure={structure} />
          ))
        )}
      </div>

      {/* General guidance */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="text-base font-semibold text-gray-900">The golden rule of expenses</h3>
        <p className="mt-2 text-sm text-gray-600">
          An expense is allowable if it is incurred <strong>&ldquo;wholly and exclusively&rdquo;</strong> for
          business purposes. If something has both personal and business use (e.g., a phone, internet,
          car), only the business proportion is claimable.
        </p>
        <p className="mt-2 text-sm text-gray-600">
          Keep receipts for everything. HMRC can ask for evidence going back 6 years (or longer in
          fraud cases). Digital photos of receipts are acceptable.
        </p>
      </div>

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">Disclaimer</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>This guide covers the most common freelancer expenses. It is not exhaustive.</li>
          <li>Rules can differ based on your specific trade and circumstances.</li>
          <li>HMRC&apos;s &ldquo;wholly and exclusively&rdquo; test applies to all expenses.</li>
          <li>When in doubt, ask your accountant — getting it wrong can lead to penalties.</li>
        </ul>
      </div>
    </div>
  );
}
