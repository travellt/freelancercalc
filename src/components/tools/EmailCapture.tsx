'use client';

import { useState } from 'react';

interface EmailCaptureProps {
  /** What tool the user was using — included in the email and stored for segmentation */
  toolName: string;
  /** A short summary of the results to include in the email, e.g. "Sole trader: £42,300 | Ltd: £44,800" */
  resultsSummary: string;
  /** Full HTML for the email body (results breakdown) */
  resultsHtml: string;
}

export default function EmailCapture({ toolName, resultsSummary, resultsHtml }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [digest, setDigest] = useState(true);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setStatus('sending');
    try {
      const res = await fetch('/api/email-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          toolName,
          resultsSummary,
          resultsHtml,
          subscribeDigest: digest,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send');
      }
      setStatus('sent');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
    }
  };

  if (status === 'sent') {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <svg className="mx-auto h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-2 text-sm font-medium text-green-800">Results sent to {email}</p>
        {digest && (
          <p className="mt-1 text-xs text-green-600">
            You&apos;ll also receive our weekly freelancer digest with tax tips and tool updates.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-brand-100 bg-brand-50/50 p-6">
      <h3 className="text-base font-semibold text-gray-900">Save your results</h3>
      <p className="mt-1 text-sm text-gray-600">
        Email yourself a copy of these calculations to refer back to later.
      </p>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="block flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={status === 'sending'}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending...' : 'Email me'}
          </button>
        </div>

        <label className="mt-3 flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={digest}
            onChange={(e) => setDigest(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
          />
          <span className="text-xs text-gray-500">
            Also send me the weekly FreelancerCalc digest — tax tips, deadline reminders, and new tools. Unsubscribe any time.
          </span>
        </label>

        {status === 'error' && (
          <p className="mt-2 text-xs text-red-600">{errorMsg}</p>
        )}
      </form>
    </div>
  );
}
