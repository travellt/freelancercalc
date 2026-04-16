'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  type InvoiceData,
  type InvoiceLineItem,
  emptyInvoice,
  calculateTotals,
  calculateLineTotal,
  formatDate,
  defaultDueDate,
  BUSINESS_STORAGE_KEY,
} from '@/lib/invoice';
import { formatGBP, TAX_YEAR } from '@/lib/tax';
import EmailCapture from './EmailCapture';

function InputField({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
      />
    </div>
  );
}

function TextAreaField({
  label, value, onChange, placeholder, rows = 3,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none"
      />
    </div>
  );
}

function NumberField({
  value, onChange, prefix, className = '',
}: {
  value: number; onChange: (v: number) => void; prefix?: string; className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      {prefix && <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-xs text-gray-400">{prefix}</span>}
      <input
        type="number"
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        step="0.01"
        min={0}
        className={`block w-full rounded-md border border-gray-300 bg-white py-1.5 text-right text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none ${prefix ? 'pl-6 pr-2' : 'px-2'}`}
      />
    </div>
  );
}

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<InvoiceData>(emptyInvoice);
  const [businessSaved, setBusinessSaved] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'generating' | 'error'>('idle');
  const [downloadError, setDownloadError] = useState('');

  // Load saved business details on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(BUSINESS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setInvoice((inv) => ({ ...inv, business: { ...inv.business, ...parsed } }));
        setBusinessSaved(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save business details to localStorage on change
  const saveBusiness = useCallback(() => {
    try {
      localStorage.setItem(BUSINESS_STORAGE_KEY, JSON.stringify(invoice.business));
      setBusinessSaved(true);
      setTimeout(() => setBusinessSaved(false), 2000);
    } catch {
      // ignore
    }
  }, [invoice.business]);

  const clearBusiness = useCallback(() => {
    if (!confirm('Clear your saved business details from this browser?')) return;
    localStorage.removeItem(BUSINESS_STORAGE_KEY);
    setInvoice((inv) => ({ ...inv, business: emptyInvoice().business }));
    setBusinessSaved(false);
  }, []);

  const totals = useMemo(() => calculateTotals(invoice), [invoice]);

  const updateBusiness = <K extends keyof InvoiceData['business']>(k: K, v: InvoiceData['business'][K]) => {
    setInvoice((inv) => ({ ...inv, business: { ...inv.business, [k]: v } }));
  };
  const updateClient = <K extends keyof InvoiceData['client']>(k: K, v: InvoiceData['client'][K]) => {
    setInvoice((inv) => ({ ...inv, client: { ...inv.client, [k]: v } }));
  };
  const updateLine = (idx: number, patch: Partial<InvoiceLineItem>) => {
    setInvoice((inv) => ({
      ...inv,
      lineItems: inv.lineItems.map((item, i) => (i === idx ? { ...item, ...patch } : item)),
    }));
  };
  const addLine = () => {
    setInvoice((inv) => ({
      ...inv,
      lineItems: [...inv.lineItems, { description: '', quantity: 1, unitPrice: 0 }],
    }));
  };
  const removeLine = (idx: number) => {
    setInvoice((inv) => ({
      ...inv,
      lineItems: inv.lineItems.filter((_, i) => i !== idx),
    }));
  };

  // Update due date when issue date changes
  const updateIssueDate = (iso: string) => {
    setInvoice((inv) => ({ ...inv, issueDate: iso, dueDate: defaultDueDate(iso) }));
  };

  const downloadPdf = async () => {
    setDownloadState('generating');
    setDownloadError('');
    try {
      const { generateInvoicePdf } = await import('@/lib/invoice-pdf');
      const doc = generateInvoicePdf(invoice);
      const filename = `${invoice.invoiceNumber || 'invoice'}.pdf`;
      doc.save(filename);
      setDownloadState('idle');
    } catch (err) {
      console.error('PDF generation failed:', err);
      setDownloadError(err instanceof Error ? err.message : 'Failed to generate PDF');
      setDownloadState('error');
    }
  };

  const vatEnabled = invoice.vatRate !== null;

  return (
    <div>
      {/* Business details */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Your business details</h2>
            <p className="mt-1 text-sm text-gray-500">
              Saved in this browser so you only need to enter once. Not sent anywhere else.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveBusiness}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
            >
              {businessSaved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={clearBusiness}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InputField label="Business name" value={invoice.business.name} onChange={(v) => updateBusiness('name', v)} placeholder="Your trading name" />
          <InputField label="Email" value={invoice.business.email} onChange={(v) => updateBusiness('email', v)} placeholder="you@example.com" type="email" />
        </div>
        <div className="mt-4">
          <TextAreaField label="Address" value={invoice.business.address} onChange={(v) => updateBusiness('address', v)} placeholder="Street, City, Postcode" rows={2} />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <InputField label="Phone" value={invoice.business.phone} onChange={(v) => updateBusiness('phone', v)} />
          <InputField label="Company number (if ltd)" value={invoice.business.companyNumber} onChange={(v) => updateBusiness('companyNumber', v)} placeholder="Optional" />
          <InputField label="VAT number (if registered)" value={invoice.business.vatNumber} onChange={(v) => updateBusiness('vatNumber', v)} placeholder="Optional" />
        </div>

        <h3 className="mt-6 text-sm font-semibold text-gray-900">Payment details</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <InputField label="Bank name" value={invoice.business.bankName} onChange={(v) => updateBusiness('bankName', v)} />
          <InputField label="Account name" value={invoice.business.accountName} onChange={(v) => updateBusiness('accountName', v)} />
          <InputField label="Sort code" value={invoice.business.sortCode} onChange={(v) => updateBusiness('sortCode', v)} placeholder="00-00-00" />
          <InputField label="Account number" value={invoice.business.accountNumber} onChange={(v) => updateBusiness('accountNumber', v)} placeholder="12345678" />
          <InputField label="IBAN (optional)" value={invoice.business.iban} onChange={(v) => updateBusiness('iban', v)} placeholder="For international clients" />
        </div>
      </div>

      {/* Client details */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Client details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <InputField label="Client name" value={invoice.client.name} onChange={(v) => updateClient('name', v)} placeholder="Company or person" />
          <InputField label="Client email" value={invoice.client.email} onChange={(v) => updateClient('email', v)} type="email" />
        </div>
        <div className="mt-4">
          <TextAreaField label="Client address" value={invoice.client.address} onChange={(v) => updateClient('address', v)} placeholder="Street, City, Postcode" rows={2} />
        </div>
        <div className="mt-4">
          <InputField label="Client reference (PO, job number, etc.)" value={invoice.client.reference} onChange={(v) => updateClient('reference', v)} placeholder="Optional" />
        </div>
      </div>

      {/* Invoice details */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-gray-900">Invoice details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <InputField label="Invoice number" value={invoice.invoiceNumber} onChange={(v) => setInvoice((inv) => ({ ...inv, invoiceNumber: v }))} />
          <InputField label="Issue date" value={invoice.issueDate} onChange={updateIssueDate} type="date" />
          <InputField label="Due date" value={invoice.dueDate} onChange={(v) => setInvoice((inv) => ({ ...inv, dueDate: v }))} type="date" />
        </div>

        {/* VAT toggle */}
        <div className="mt-6">
          <label className="block text-xs font-medium text-gray-700">VAT</label>
          <div className="mt-1.5 flex gap-2">
            <button
              onClick={() => setInvoice((inv) => ({ ...inv, vatRate: null }))}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                !vatEnabled ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              No VAT
            </button>
            <button
              onClick={() => setInvoice((inv) => ({ ...inv, vatRate: 0.20 }))}
              className={`rounded-lg border px-4 py-2 text-sm transition-colors ${
                vatEnabled ? 'border-brand-500 bg-brand-50 font-medium text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              VAT 20% (standard)
            </button>
          </div>
          {vatEnabled && !invoice.business.vatNumber && (
            <p className="mt-2 text-xs text-amber-700">
              ⚠️ Add your VAT registration number above — required on VAT invoices.
            </p>
          )}
        </div>

        {/* Line items */}
        <h3 className="mt-8 text-sm font-semibold text-gray-900">Line items</h3>
        <div className="mt-3 space-y-3">
          {/* Header row (desktop only) */}
          <div className="hidden grid-cols-12 gap-3 pb-2 text-xs font-medium uppercase tracking-wide text-gray-500 sm:grid">
            <div className="col-span-6">Description</div>
            <div className="col-span-2 text-right">Quantity</div>
            <div className="col-span-2 text-right">Rate (£)</div>
            <div className="col-span-2 text-right">Amount</div>
          </div>

          {invoice.lineItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 sm:border-0 sm:bg-transparent sm:p-0">
              <div className="col-span-12 sm:col-span-6">
                <label className="block text-xs font-medium text-gray-700 sm:hidden">Description</label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateLine(idx, { description: e.target.value })}
                  placeholder="What are you billing for?"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none sm:mt-0"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 sm:hidden">Qty</label>
                <NumberField value={item.quantity} onChange={(v) => updateLine(idx, { quantity: v })} />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700 sm:hidden">Rate</label>
                <NumberField value={item.unitPrice} onChange={(v) => updateLine(idx, { unitPrice: v })} prefix="£" />
              </div>
              <div className="col-span-3 flex items-center justify-end text-sm font-medium text-gray-900 sm:col-span-2 sm:mt-0">
                {formatGBP(calculateLineTotal(item))}
              </div>
              <div className="col-span-1 flex items-center justify-end">
                {invoice.lineItems.length > 1 && (
                  <button
                    onClick={() => removeLine(idx)}
                    aria-label="Remove line"
                    className="text-gray-400 hover:text-red-500"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addLine}
          className="mt-3 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:border-brand-400 hover:text-brand-600"
        >
          + Add line
        </button>

        {/* Totals */}
        <div className="mt-6 ml-auto w-full max-w-xs space-y-2 text-sm">
          {vatEnabled && (
            <>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatGBP(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (20%)</span>
                <span className="tabular-nums">{formatGBP(totals.vatAmount)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between border-t-2 border-gray-900 pt-2 text-base font-semibold text-gray-900">
            <span>Total due</span>
            <span className="tabular-nums text-brand-700">{formatGBP(totals.total)}</span>
          </div>
        </div>

        {/* Notes and terms */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <TextAreaField
            label="Payment terms"
            value={invoice.paymentTerms}
            onChange={(v) => setInvoice((inv) => ({ ...inv, paymentTerms: v }))}
            rows={3}
          />
          <TextAreaField
            label="Notes (optional)"
            value={invoice.notes}
            onChange={(v) => setInvoice((inv) => ({ ...inv, notes: v }))}
            placeholder="Thank you for your business..."
            rows={3}
          />
        </div>
      </div>

      {/* Preview + Actions */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Preview</h2>
            <p className="mt-1 text-sm text-gray-500">Quick preview of how the PDF will look.</p>
          </div>
          <button
            onClick={downloadPdf}
            disabled={downloadState === 'generating'}
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 disabled:opacity-50"
          >
            {downloadState === 'generating' ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        {downloadState === 'error' && (
          <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{downloadError}</p>
        )}

        <InvoicePreview data={invoice} />
      </div>

      {/* Email capture */}
      <EmailCapture
        toolName="Invoice Generator"
        resultsSummary={`Invoice ${invoice.invoiceNumber} | Client: ${invoice.client.name || 'Unnamed'} | Total: ${formatGBP(totals.total)}`}
        resultsHtml={`
          <h2>Your Invoice — ${invoice.invoiceNumber}</h2>
          <p><strong>From:</strong> ${invoice.business.name || '—'}</p>
          <p><strong>To:</strong> ${invoice.client.name || '—'}</p>
          <p><strong>Issue date:</strong> ${formatDate(invoice.issueDate)} &middot; <strong>Due:</strong> ${formatDate(invoice.dueDate)}</p>
          <p><strong>Total due:</strong> ${formatGBP(totals.total)}${vatEnabled ? ` (inc ${formatGBP(totals.vatAmount)} VAT)` : ''}</p>
          <p style="color:#6b7280;font-size:12px">Created at freelancercalc.co.uk. Click "Download PDF" in the tool to save a copy.</p>
        `}
      />

      {/* Methodology */}
      <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">How this works</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Your business details are saved in your browser only — never uploaded to our servers.</li>
          <li>PDFs are generated entirely client-side. No invoice data leaves your device unless you click &ldquo;Email me&rdquo;.</li>
          <li>Follows UK legal requirements for invoices: unique number, dates, parties, amounts, VAT details (if registered).</li>
          <li>Default payment terms cite the Late Payment of Commercial Debts Act 1998, which lets you charge 8% above base rate on late payments.</li>
          <li>VAT invoices require your VAT registration number to be legally valid.</li>
          <li>Tax year {TAX_YEAR} &middot; Always consult an accountant for advice specific to your situation.</li>
        </ul>
      </div>
    </div>
  );
}

function InvoicePreview({ data }: { data: InvoiceData }) {
  const totals = calculateTotals(data);
  const hasVat = data.vatRate !== null;

  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-gray-200">
      <div className="bg-white p-6 text-xs text-gray-700 sm:p-8 sm:text-sm">
        <div className="flex items-start justify-between">
          <h3 className="text-2xl font-bold text-brand-800 sm:text-3xl">INVOICE</h3>
          <div className="text-right">
            <p className="font-medium text-gray-500">#{data.invoiceNumber}</p>
            <p className="text-gray-500">Issued: {formatDate(data.issueDate)}</p>
            <p className="text-gray-500">Due: {formatDate(data.dueDate)}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6 sm:grid sm:grid-cols-2 sm:gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">From</p>
            <p className="mt-1 font-semibold text-gray-900">{data.business.name || 'Your business'}</p>
            {data.business.address && <p className="whitespace-pre-line text-gray-600">{data.business.address}</p>}
            {data.business.email && <p className="text-gray-600">{data.business.email}</p>}
            {data.business.phone && <p className="text-gray-600">{data.business.phone}</p>}
            {data.business.companyNumber && <p className="text-gray-600">Company No: {data.business.companyNumber}</p>}
            {data.business.vatNumber && <p className="text-gray-600">VAT No: {data.business.vatNumber}</p>}
          </div>
          <div className="mt-6 sm:mt-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Bill to</p>
            <p className="mt-1 font-semibold text-gray-900">{data.client.name || 'Client'}</p>
            {data.client.address && <p className="whitespace-pre-line text-gray-600">{data.client.address}</p>}
            {data.client.email && <p className="text-gray-600">{data.client.email}</p>}
            {data.client.reference && <p className="text-gray-600">Ref: {data.client.reference}</p>}
          </div>
        </div>

        <table className="mt-8 w-full">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Rate</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.lineItems.map((item, idx) => (
              <tr key={idx}>
                <td className="py-2 pr-2 text-gray-700">{item.description || '—'}</td>
                <td className="py-2 text-right text-gray-600 tabular-nums">{item.quantity}</td>
                <td className="py-2 text-right text-gray-600 tabular-nums">{formatGBP(item.unitPrice)}</td>
                <td className="py-2 text-right text-gray-900 tabular-nums">{formatGBP(calculateLineTotal(item))}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 ml-auto w-full max-w-xs space-y-1">
          {hasVat && (
            <>
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="tabular-nums">{formatGBP(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT (20%)</span>
                <span className="tabular-nums">{formatGBP(totals.vatAmount)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between border-t-2 border-brand-700 pt-2 text-base font-semibold">
            <span className="text-brand-800">Total due</span>
            <span className="tabular-nums text-brand-800">{formatGBP(totals.total)}</span>
          </div>
        </div>

        {(data.business.bankName || data.business.accountNumber) && (
          <div className="mt-8 border-t border-gray-200 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Payment details</p>
            <div className="mt-2 space-y-0.5 text-gray-600">
              {data.business.bankName && <p>Bank: {data.business.bankName}</p>}
              {data.business.accountName && <p>Account name: {data.business.accountName}</p>}
              {data.business.sortCode && <p>Sort code: {data.business.sortCode}</p>}
              {data.business.accountNumber && <p>Account number: {data.business.accountNumber}</p>}
              {data.business.iban && <p>IBAN: {data.business.iban}</p>}
            </div>
          </div>
        )}

        {data.paymentTerms && (
          <div className="mt-6 border-t border-gray-200 pt-4 text-xs text-gray-500">
            <p className="font-semibold uppercase tracking-wide">Payment terms</p>
            <p className="mt-1 whitespace-pre-line">{data.paymentTerms}</p>
          </div>
        )}

        {data.notes && (
          <div className="mt-4 text-xs text-gray-500">
            <p className="font-semibold uppercase tracking-wide">Notes</p>
            <p className="mt-1 whitespace-pre-line">{data.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
