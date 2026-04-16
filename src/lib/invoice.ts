/**
 * Invoice data model and helpers.
 *
 * UK invoices have specific legal requirements depending on structure:
 * - All invoices: unique sequential number, issue date, supplier name/address,
 *   customer name/address, description of goods/services, total amount
 * - VAT registered: VAT number, VAT rate + amount per line, net/VAT/gross totals
 * - Limited company: company registration number, registered office address
 */

export interface InvoiceBusiness {
  /** Your trading name */
  name: string;
  /** Your trading address */
  address: string;
  email: string;
  phone: string;
  /** Company number (ltd companies) */
  companyNumber: string;
  /** VAT registration number */
  vatNumber: string;
  /** Bank name for payment */
  bankName: string;
  accountName: string;
  sortCode: string;
  accountNumber: string;
  /** IBAN for international clients */
  iban: string;
}

export interface InvoiceClient {
  name: string;
  address: string;
  email: string;
  /** Client's own reference (PO number etc.) */
  reference: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  business: InvoiceBusiness;
  client: InvoiceClient;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  lineItems: InvoiceLineItem[];
  /** VAT rate as decimal (0.20 = 20%). Set to null for no VAT */
  vatRate: number | null;
  notes: string;
  paymentTerms: string;
}

export interface InvoiceTotals {
  subtotal: number;
  vatAmount: number;
  total: number;
}

export function calculateLineTotal(item: InvoiceLineItem): number {
  return item.quantity * item.unitPrice;
}

export function calculateTotals(data: InvoiceData): InvoiceTotals {
  const subtotal = data.lineItems.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  const vatAmount = data.vatRate !== null ? subtotal * data.vatRate : 0;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    total: Math.round((subtotal + vatAmount) * 100) / 100,
  };
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function suggestInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
  return `INV-${year}${month}-${random}`;
}

export function defaultDueDate(issueDate: string, daysNet = 30): string {
  if (!issueDate) return '';
  const d = new Date(issueDate);
  d.setDate(d.getDate() + daysNet);
  return d.toISOString().split('T')[0];
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

export function emptyInvoice(): InvoiceData {
  return {
    business: {
      name: '',
      address: '',
      email: '',
      phone: '',
      companyNumber: '',
      vatNumber: '',
      bankName: '',
      accountName: '',
      sortCode: '',
      accountNumber: '',
      iban: '',
    },
    client: {
      name: '',
      address: '',
      email: '',
      reference: '',
    },
    invoiceNumber: suggestInvoiceNumber(),
    issueDate: todayISO(),
    dueDate: defaultDueDate(todayISO()),
    lineItems: [
      { description: '', quantity: 1, unitPrice: 0 },
    ],
    vatRate: null,
    notes: '',
    paymentTerms: 'Payment due within 30 days of invoice date. Late payment interest charged at 8% above Bank of England base rate (Late Payment of Commercial Debts Act 1998).',
  };
}

/** LocalStorage key for persisting business details between sessions */
export const BUSINESS_STORAGE_KEY = 'freelancercalc_invoice_business';
