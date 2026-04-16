import { jsPDF } from 'jspdf';
import { calculateLineTotal, calculateTotals, formatDate, type InvoiceData } from './invoice';

/**
 * Generate a UK-compliant invoice PDF.
 * Returns the jsPDF instance so the caller can download, blob, or datauri as needed.
 */
export function generateInvoicePdf(data: InvoiceData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const totals = calculateTotals(data);
  const hasVat = data.vatRate !== null;

  // Header — INVOICE title + number
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 64, 175); // brand-800
  doc.text('INVOICE', margin, y + 8);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text(`# ${data.invoiceNumber}`, pageWidth - margin, y + 4, { align: 'right' });
  doc.text(`Issued: ${formatDate(data.issueDate)}`, pageWidth - margin, y + 10, { align: 'right' });
  doc.text(`Due: ${formatDate(data.dueDate)}`, pageWidth - margin, y + 16, { align: 'right' });

  y += 30;

  // Divider
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // From / To columns
  const colWidth = (contentWidth - 10) / 2;
  const fromX = margin;
  const toX = margin + colWidth + 10;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100);
  doc.text('FROM', fromX, y);
  doc.text('BILL TO', toX, y);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(17, 24, 39);
  doc.text(data.business.name || 'Your Business', fromX, y + 6);
  doc.text(data.client.name || 'Client', toX, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);

  const fromLines = [
    ...data.business.address.split('\n'),
    data.business.email,
    data.business.phone,
    data.business.companyNumber ? `Company No: ${data.business.companyNumber}` : '',
    data.business.vatNumber ? `VAT No: ${data.business.vatNumber}` : '',
  ].filter(Boolean);

  const toLines = [
    ...data.client.address.split('\n'),
    data.client.email,
    data.client.reference ? `Ref: ${data.client.reference}` : '',
  ].filter(Boolean);

  let fromY = y + 12;
  fromLines.forEach((line) => {
    doc.text(line, fromX, fromY);
    fromY += 5;
  });

  let toY = y + 12;
  toLines.forEach((line) => {
    doc.text(line, toX, toY);
    toY += 5;
  });

  y = Math.max(fromY, toY) + 8;

  // Line items table
  const col1X = margin;
  const col2X = margin + contentWidth * 0.55;
  const col3X = margin + contentWidth * 0.70;
  const col4X = margin + contentWidth;

  // Table header
  doc.setFillColor(243, 244, 246);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(55, 65, 81);
  doc.text('DESCRIPTION', col1X + 2, y + 5.5);
  doc.text('QTY', col2X, y + 5.5, { align: 'right' });
  doc.text('RATE', col3X, y + 5.5, { align: 'right' });
  doc.text('AMOUNT', col4X - 2, y + 5.5, { align: 'right' });

  y += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(17, 24, 39);

  data.lineItems.forEach((item) => {
    const lineTotal = calculateLineTotal(item);
    const descLines = doc.splitTextToSize(item.description || '—', contentWidth * 0.53);
    const lineHeight = Math.max(6, descLines.length * 5);

    // Start new page if needed
    if (y + lineHeight > doc.internal.pageSize.getHeight() - 60) {
      doc.addPage();
      y = margin;
    }

    doc.text(descLines, col1X + 2, y + 4);
    doc.text(String(item.quantity), col2X, y + 4, { align: 'right' });
    doc.text(formatGBPPdf(item.unitPrice), col3X, y + 4, { align: 'right' });
    doc.text(formatGBPPdf(lineTotal), col4X - 2, y + 4, { align: 'right' });

    y += lineHeight;

    // Row divider
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 2;
  });

  y += 4;

  // Totals
  const totalsX = margin + contentWidth * 0.55;
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99);

  if (hasVat) {
    doc.text('Subtotal', totalsX, y + 4);
    doc.text(formatGBPPdf(totals.subtotal), col4X - 2, y + 4, { align: 'right' });
    y += 6;

    doc.text(`VAT (${Math.round((data.vatRate ?? 0) * 100)}%)`, totalsX, y + 4);
    doc.text(formatGBPPdf(totals.vatAmount), col4X - 2, y + 4, { align: 'right' });
    y += 8;
  }

  // Final total
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(0.5);
  doc.line(totalsX, y, col4X, y);
  y += 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(30, 64, 175);
  doc.text('TOTAL DUE', totalsX, y + 6);
  doc.text(formatGBPPdf(totals.total), col4X - 2, y + 6, { align: 'right' });

  y += 16;

  // Payment details
  if (data.business.bankName || data.business.accountNumber) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100);
    doc.text('PAYMENT DETAILS', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);

    const paymentLines = [
      data.business.bankName ? `Bank: ${data.business.bankName}` : '',
      data.business.accountName ? `Account name: ${data.business.accountName}` : '',
      data.business.sortCode ? `Sort code: ${data.business.sortCode}` : '',
      data.business.accountNumber ? `Account number: ${data.business.accountNumber}` : '',
      data.business.iban ? `IBAN: ${data.business.iban}` : '',
    ].filter(Boolean);

    paymentLines.forEach((line) => {
      doc.text(line, margin, y);
      y += 4.5;
    });
    y += 4;
  }

  // Payment terms
  if (data.paymentTerms) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100);
    doc.text('PAYMENT TERMS', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    const termsLines = doc.splitTextToSize(data.paymentTerms, contentWidth);
    doc.text(termsLines, margin, y);
    y += termsLines.length * 4 + 4;
  }

  // Notes
  if (data.notes) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100);
    doc.text('NOTES', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    const notesLines = doc.splitTextToSize(data.notes, contentWidth);
    doc.text(notesLines, margin, y);
    y += notesLines.length * 4;
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text('Generated with FreelancerCalc.co.uk', pageWidth / 2, footerY, { align: 'center' });

  return doc;
}

function formatGBPPdf(n: number): string {
  return '\u00a3' + n.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
