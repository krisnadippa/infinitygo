import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Invoice, formatRupiah, formatDate } from "@/lib/admin-data";

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b',
    paddingBottom: 20,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  logo: {
    width: 56,
    height: 56,
    objectFit: 'contain',
  },
  companyName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  companyDetails: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 2,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  invoiceTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: '#94a3b8',
    marginBottom: 4,
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    borderRadius: 4,
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  billSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  billCol: {
    width: '30%',
  },
  billLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#94a3b8',
    marginBottom: 8,
  },
  billName: {
    fontWeight: 'bold',
    color: '#1e293b',
  },
  billText: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  billRight: {
    alignItems: 'flex-end',
  },
  table: {
    width: '100%',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b',
    paddingBottom: 8,
    marginBottom: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 8,
    alignItems: 'center',
  },
  tableColDesc: { width: '40%', paddingRight: 8 },
  tableColType: { width: '15%' },
  tableColQty: { width: '10%', textAlign: 'center' },
  tableColPrice: { width: '17.5%', textAlign: 'right' },
  tableColTotal: { width: '17.5%', textAlign: 'right' },
  th: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#1e293b',
  },
  tdDescName: { fontWeight: 'bold', fontSize: 10, color: '#1e293b' },
  tdDescNotes: { fontSize: 9, color: '#94a3b8', marginTop: 2 },
  tdType: {
    backgroundColor: '#eff6ff',
    color: '#2563eb',
    fontSize: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  tdNum: { color: '#334155', fontSize: 10 },
  tdTotal: { fontWeight: 'bold', color: '#1e293b', fontSize: 10 },
  summarySection: {
    alignItems: 'flex-end',
    marginBottom: 28,
  },
  summaryBox: {
    width: 250,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 6,
  },
  summaryLabel: { color: '#64748b' },
  summaryValue: { fontWeight: 'bold', color: '#1e293b' },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b',
    paddingVertical: 8,
    marginTop: 8,
  },
  summaryTotalLabel: { fontWeight: 'bold', fontSize: 12, color: '#1e293b' },
  summaryTotalValue: { fontWeight: 'bold', fontSize: 14, color: '#0f172a' },
  dpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#eff6ff',
    padding: 6,
    borderRadius: 4,
  },
  paidFullRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f0fdf4',
    padding: 6,
    borderRadius: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    marginTop: 4,
  },
  paidBadge: {
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 6,
    padding: 6,
    marginTop: 4,
  },
  paidBadgeText: {
    color: '#166534',
    fontWeight: 'bold',
    fontSize: 9,
    letterSpacing: 1,
  },
  expenseTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#94a3b8',
    marginBottom: 12,
  },
  bottomSection: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: '#1e293b',
    paddingTop: 20,
    marginTop: 32,
  },
  notesCol: { width: '50%', paddingRight: 20 },
  paymentCol: { width: '50%', alignItems: 'flex-end' },
  notesTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: '#94a3b8',
    marginBottom: 8,
  },
  notesText: { fontSize: 10, color: '#475569', lineHeight: 1.5 },
  paymentBank: { fontWeight: 'bold', color: '#1e293b', fontSize: 11 },
  paymentAcc: { fontWeight: 'bold', color: '#334155', fontSize: 10, marginTop: 2 },
  paymentName: { color: '#475569', fontSize: 9.5, marginTop: 4 },
});

const itemTypeTranslation: Record<string, string> = {
  "Paket Tour": "Tour Package",
  "Akomodasi": "Accommodation",
  "Kendaraan": "Vehicle",
  "Wifi": "Wifi",
  "MICE": "MICE",
  "Custom": "Custom",
};

interface InvoicePDFProps {
  invoice: Invoice;
  showExpense?: boolean;
}

export default function InvoicePDF({ invoice, showExpense = false }: InvoicePDFProps) {
  const statusLabel =
    invoice.paymentType === "DP" && !invoice.paidFull
      ? "DEPOSIT / PARTIAL"
      : invoice.status === "Paid"
      ? "PAID"
      : invoice.status === "Pending"
      ? "UNPAID"
      : invoice.status === "Cancelled"
      ? "CANCELLED"
      : "DRAFT";

  const getStatusStyle = () => {
    if (invoice.status === "Paid") return { borderColor: '#16a34a', color: '#15803d' };
    if (invoice.status === "DP") return { borderColor: '#3b82f6', color: '#2563eb' };
    if (invoice.status === "Pending") return { borderColor: '#f59e0b', color: '#d97706' };
    if (invoice.status === "Cancelled") return { borderColor: '#ef4444', color: '#dc2626' };
    return { borderColor: '#94a3b8', color: '#64748b' };
  };

  const companyInfo = {
    name: "Infinity Go Bali",
    website: "www.infinitygotravel.com",
    email: "infinitygo.travel@gmail.com",
    phone: "+62 812 3456 7890",
  };

  // Construct absolute URL for the logo, safe for both client and server rendering
  const isClient = typeof window !== 'undefined';
  const logoUrl = isClient ? `${window.location.origin}/images/logo.png` : "/images/logo.png";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={logoUrl} style={styles.logo} />
            <View>
              <Text style={styles.companyName}>{companyInfo.name}</Text>
              <Text style={styles.companyDetails}>{companyInfo.website}</Text>
              <Text style={styles.companyDetails}>{companyInfo.email}</Text>
              <Text style={styles.companyDetails}>{companyInfo.phone}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>INVOICE</Text>
            <Text style={styles.invoiceNumber}>{invoice.invoiceNumber}</Text>
            <View style={[styles.statusBadge, getStatusStyle()]}>
              <Text>{statusLabel}</Text>
            </View>
          </View>
        </View>

        {/* Bill Info */}
        <View style={styles.billSection}>
          <View style={styles.billCol}>
            <Text style={styles.billLabel}>From</Text>
            <Text style={styles.billName}>{companyInfo.name}</Text>
            <Text style={styles.billText}>{companyInfo.website}</Text>
            <Text style={styles.billText}>{companyInfo.email}</Text>
          </View>
          <View style={styles.billCol}>
            <Text style={styles.billLabel}>Bill To</Text>
            <Text style={styles.billName}>{invoice.customerName}</Text>
            {invoice.customerPhone && <Text style={styles.billText}>{invoice.customerPhone}</Text>}
            {invoice.customerEmail && <Text style={styles.billText}>{invoice.customerEmail}</Text>}
          </View>
          <View style={styles.billRight}>
            <View style={{ marginBottom: 12, alignItems: 'flex-end' }}>
              <Text style={[styles.billLabel, { textAlign: 'right' }]}>Invoice Date</Text>
              <Text style={[styles.billName, { textAlign: 'right' }]}>{formatDate(invoice.invoiceDate)}</Text>
            </View>
            <View style={{ marginBottom: 12, alignItems: 'flex-end' }}>
              <Text style={[styles.billLabel, { textAlign: 'right' }]}>Due Date</Text>
              <Text style={[styles.billName, { textAlign: 'right' }]}>{formatDate(invoice.dueDate)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[styles.billLabel, { textAlign: 'right' }]}>Payment Method</Text>
              <Text style={[styles.billName, { textAlign: 'right' }]}>{invoice.paymentMethod}</Text>
            </View>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.tableColDesc]}>Description</Text>
            <Text style={[styles.th, styles.tableColType]}>Type</Text>
            <Text style={[styles.th, styles.tableColQty]}>Qty</Text>
            <Text style={[styles.th, styles.tableColPrice]}>Unit Price</Text>
            <Text style={[styles.th, styles.tableColTotal]}>Total</Text>
          </View>
          {invoice.items.map((item, i) => (
            <View key={item.id} style={[styles.tableRow, i % 2 !== 0 ? { backgroundColor: '#f8fafc' } : {}]}>
              <View style={styles.tableColDesc}>
                <Text style={styles.tdDescName}>{item.name}</Text>
                {item.description && <Text style={styles.tdDescNotes}>{item.description}</Text>}
              </View>
              <View style={styles.tableColType}>
                <View style={styles.tdType}>
                  <Text>{itemTypeTranslation[item.type] || item.type}</Text>
                </View>
              </View>
              <Text style={[styles.tdNum, styles.tableColQty]}>{item.quantity}</Text>
              <Text style={[styles.tdNum, styles.tableColPrice]}>{formatRupiah(item.price)}</Text>
              <Text style={[styles.tdTotal, styles.tableColTotal]}>{formatRupiah(item.subtotal)}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summarySection} wrap={false}>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatRupiah(invoice.subtotal)}</Text>
            </View>
            {invoice.discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={{ ...styles.summaryValue, color: '#ef4444' }}>- {formatRupiah(invoice.discount)}</Text>
              </View>
            )}
            {invoice.tax > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>{formatRupiah(invoice.tax)}</Text>
              </View>
            )}
            <View style={styles.summaryTotalRow}>
              <Text style={styles.summaryTotalLabel}>Total</Text>
              <Text style={styles.summaryTotalValue}>{formatRupiah(invoice.grandTotal)}</Text>
            </View>

            {invoice.paymentType === "DP" && (
              <View>
                <View style={styles.dpRow}>
                  <Text style={{ color: '#1d4ed8' }}>Deposit Paid {invoice.dpDate ? `(${formatDate(invoice.dpDate)})` : ''}</Text>
                  <Text style={{ color: '#1d4ed8', fontWeight: 'bold' }}>- {formatRupiah(invoice.dpAmount)}</Text>
                </View>
                {invoice.paidFull && (
                  <View style={styles.paidFullRow}>
                    <Text style={{ color: '#15803d' }}>Remaining Balance Paid</Text>
                    <Text style={{ color: '#15803d', fontWeight: 'bold' }}>- {formatRupiah(invoice.paidRemainingAmount ?? invoice.remainingAmount)}</Text>
                  </View>
                )}
                <View style={styles.balanceRow}>
                  <Text style={{ fontWeight: 'bold' }}>Balance Due</Text>
                  <Text style={{ fontWeight: 'bold', color: invoice.paidFull ? '#16a34a' : '#dc2626' }}>
                    {invoice.paidFull ? "Rp 0" : formatRupiah(invoice.remainingAmount)}
                  </Text>
                </View>
                {invoice.paidFull && (
                  <View style={styles.paidBadge}>
                    <Text style={styles.paidBadgeText}>✓ PAID IN FULL</Text>
                  </View>
                )}
              </View>
            )}

            {invoice.paymentType === "Full" && invoice.status === "Paid" && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Amount Paid</Text>
                <Text style={{ ...styles.summaryValue, color: '#16a34a' }}>{formatRupiah(invoice.grandTotal)}</Text>
              </View>
            )}
            {invoice.paymentType === "Full" && invoice.status !== "Paid" && (
              <View style={styles.summaryRow}>
                <Text style={{ fontWeight: 'bold', color: '#1e293b' }}>Balance Due</Text>
                <Text style={{ fontWeight: 'bold', color: '#dc2626' }}>{formatRupiah(invoice.grandTotal)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Expenses */}
        {showExpense && invoice.expenses && invoice.expenses.length > 0 && (
          <View style={{ marginTop: 20, marginBottom: 20 }} wrap={false}>
            <Text style={styles.expenseTitle}>Operational Expense Details</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { width: '40%' }]}>Description</Text>
                <Text style={[styles.th, { width: '20%' }]}>Category</Text>
                <Text style={[styles.th, { width: '20%' }]}>Date</Text>
                <Text style={[styles.th, { width: '20%', textAlign: 'right' }]}>Amount</Text>
              </View>
              {invoice.expenses.map((exp, i) => (
                <View key={exp.id} style={[styles.tableRow, i % 2 !== 0 ? { backgroundColor: '#f8fafc' } : {}]}>
                  <View style={{ width: '40%', paddingRight: 8 }}>
                    <Text style={styles.tdDescName}>{exp.name}</Text>
                    {exp.notes && <Text style={styles.tdDescNotes}>{exp.notes}</Text>}
                  </View>
                  <View style={{ width: '20%' }}>
                    <View style={[styles.tdType, { backgroundColor: '#fffbeb', color: '#b45309', borderColor: '#fef3c7' }]}>
                      <Text>{exp.category}</Text>
                    </View>
                  </View>
                  <Text style={[styles.tdNum, { width: '20%' }]}>{formatDate(exp.date)}</Text>
                  <Text style={[styles.tdTotal, { width: '20%', textAlign: 'right' }]}>{formatRupiah(exp.amount)}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <Text style={{ color: '#64748b', marginRight: 48, fontSize: 10 }}>Total Operational Expenses</Text>
              <Text style={{ fontWeight: 'bold', color: '#b45309', fontSize: 11 }}>{formatRupiah(invoice.totalExpense)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8, borderBottomWidth: 2, borderBottomColor: '#334155', paddingBottom: 12 }}>
              <Text style={{ color: '#64748b', marginRight: 48, fontSize: 10 }}>Net Profit</Text>
              <Text style={{ fontWeight: 'bold', color: '#15803d', fontSize: 11 }}>{formatRupiah(invoice.netProfit)}</Text>
            </View>
          </View>
        )}

        {/* Bottom Section */}
        <View style={styles.bottomSection} wrap={false}>
          <View style={styles.notesCol}>
            {invoice.notes && (
              <View style={{ marginBottom: 12 }}>
                <Text style={styles.notesTitle}>Notes</Text>
                <Text style={styles.notesText}>{invoice.notes}</Text>
              </View>
            )}
            <View>
              <Text style={styles.notesTitle}>Payment Terms</Text>
              <Text style={styles.notesText}>Payment should be made before the due date. Thank you for choosing Infinity Go Bali.</Text>
            </View>
          </View>
          <View style={styles.paymentCol}>
            <Text style={styles.notesTitle}>Payment Information</Text>
            <Text style={styles.paymentBank}>BCA</Text>
            <Text style={styles.paymentAcc}>4040619343</Text>
            <Text style={styles.paymentName}>A/N PT. Anugerah Wisata kencana</Text>
            <Text style={styles.paymentName}>Swift code: CENAIDJA</Text>
            <Text style={[styles.notesText, { marginTop: 6, textAlign: 'right' }]}>Kartika plaza street no.89{"\n"}Kuta</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
}
