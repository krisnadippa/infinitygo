"use client";

import { useState } from "react";
import { formatRupiah, formatCurrency, Invoice, formatDate } from "@/lib/admin-data";
import InvoicePrint from "@/components/admin/InvoicePrint";
import Button from "@/components/admin/Button";
import { StatusBadge } from "@/components/admin/Badge";
import { CurrencyInput } from "@/components/admin/FormFields";
import Modal from "@/components/admin/Modal";
import { Printer, Download, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import StatusModal from "@/components/admin/StatusModal";
import { saveInvoice } from "../../actions";

export default function InvoiceDetailClient({ initialData }: { initialData: any }) {
  const [invoice, setInvoice] = useState<any>(initialData);
  const [confirmLunas, setConfirmLunas] = useState(false);
  const [lunasDone, setLunasDone] = useState(false);
  const [showExpense, setShowExpense] = useState(false);

  const [settleDate, setSettleDate] = useState("");
  const [settleAmount, setSettleAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p className="text-[15px] font-medium">Invoice not found.</p>
        <Link href="/admin/invoice/list" className="mt-3 text-blue-600 text-[13px] hover:underline">
          Back to Invoice List
        </Link>
      </div>
    );
  }

  const openConfirmLunas = () => {
    const today = new Date().toISOString().split("T")[0];
    setSettleDate(today);
    setSettleAmount(invoice.remainingAmount);
    setConfirmLunas(true);
  };

  const handleBayarLunas = async () => {
    setLoading(true);
    try {
      const updated = {
        ...invoice,
        paidFull: true,
        status: "Paid" as const,
        paidRemainingDate: settleDate,
        paidRemainingAmount: settleAmount,
        remainingAmount: 0,
      };
      
      await saveInvoice(updated);
      setInvoice(updated);
      setConfirmLunas(false);
      
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Settlement Successful",
        message: `Payment settlement for invoice ${invoice.invoiceNumber} has been successfully recorded.`
      });
    } catch (error: any) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Settlement Failed",
        message: error.message || "An error occurred while saving the payment settlement."
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayPending = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const updated = {
        ...invoice,
        status: "Paid" as const,
        paidFull: true,
        remainingAmount: 0,
        paidRemainingDate: today,
        paidRemainingAmount: invoice.grandTotal,
      };
      
      await saveInvoice(updated);
      setInvoice(updated);
      
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Pembayaran Berhasil",
        message: `Invoice ${invoice.invoiceNumber} telah berhasil ditandai sebagai Lunas.`
      });
    } catch (error: any) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Pembayaran Gagal",
        message: error.message || "Terjadi kesalahan saat memproses pembayaran."
      });
    } finally {
      setLoading(false);
    }
  };

  const [loadingPDF, setLoadingPDF] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setLoadingPDF(true);
      const { pdf } = await import("@react-pdf/renderer");
      const InvoicePDF = (await import("@/components/admin/InvoicePDF")).default;

      const blob = await pdf(
        <InvoicePDF invoice={invoice} showExpense={showExpense} />
      ).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Download Failed",
        message: "Failed to generate PDF. Please try again.",
      });
    } finally {
      setLoadingPDF(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <Link href="/admin/invoice/list">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />}>
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-[18px] font-bold text-slate-800">{invoice.invoiceNumber}</h1>
            <p className="text-[12.5px] text-slate-500">{invoice.customerName}</p>
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="flex items-center gap-2">
          {/* Settle Balance button — only appears if DP and not fully paid */}
          {invoice.paymentType === "DP" && !invoice.paidFull && (
            <Button
              variant="primary"
              icon={<CheckCircle size={15} />}
              onClick={openConfirmLunas}
            >
              Settle Balance ({formatCurrency(invoice.remainingAmount, invoice.currency)})
            </Button>
          )}

          {/* Pay Invoice button — only appears if status is Pending */}
          {invoice.status === "Pending" && (
            <Button
              variant="primary"
              icon={<CheckCircle size={15} />}
              onClick={handlePayPending}
              loading={loading}
            >
              Bayar Lunas ({formatCurrency(invoice.grandTotal, invoice.currency)})
            </Button>
          )}

          {/* Toggle Expense — only appears if invoice has expenses */}
          {invoice.expenses && invoice.expenses.length > 0 && (
            <button
              onClick={() => setShowExpense((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                showExpense
                  ? "bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
              }`}
            >
              {showExpense ? <EyeOff size={15} /> : <Eye size={15} />}
              {showExpense ? "Hide Expense" : "Show Expense"}
            </button>
          )}

          <Button 
            variant="outline" 
            icon={<Download size={15} />} 
            onClick={handleDownloadPDF}
            loading={loadingPDF}
          >
            {loadingPDF ? "Generating PDF..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {lunasDone && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-[13px] text-green-700 font-medium no-print">
          Remaining payment successfully recorded. Invoice status is now PAID.
        </div>
      )}

      {/* Print area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 print:shadow-none print:border-none print:rounded-none print:p-6">
        <InvoicePrint invoice={invoice} showExpense={showExpense} />
      </div>

      {/* Confirm modal */}
      <Modal
        isOpen={confirmLunas}
        onClose={() => setConfirmLunas(false)}
        title="Confirm Payment Settlement"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[13px] text-slate-600">
            Record remaining balance payment for <strong>{invoice.customerName}</strong>:
          </p>
          <div className="bg-slate-50 rounded-xl p-3 space-y-1.5">
            <div className="flex justify-between text-[12.5px]">
              <span className="text-slate-500">Total Invoice</span>
              <span className="font-semibold text-slate-700">{formatCurrency(invoice.grandTotal, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-[12.5px]">
              <span className="text-slate-500">Down Payment Paid</span>
              <span className="font-semibold text-blue-600">- {formatCurrency(invoice.dpAmount, invoice.currency)}</span>
            </div>
            <div className="flex justify-between text-[13px] border-t border-slate-200 pt-1.5 mt-1">
              <span className="font-bold text-slate-800">Balance Due</span>
              <span className="font-bold text-red-600">{formatCurrency(invoice.remainingAmount, invoice.currency)}</span>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div>
              <CurrencyInput
                label={`Settle Amount (${invoice.currency})`}
                value={settleAmount || 0}
                onChange={(val) => setSettleAmount(val)}
                currency={invoice.currency}
              />
            </div>
            <div>
              <label className="block text-[12.5px] font-medium text-slate-700 mb-1">Settlement Date</label>
              <input
                type="date"
                value={settleDate}
                onChange={(e) => setSettleDate(e.target.value)}
                className="w-full px-3 py-2 text-[13px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button className="flex-1" icon={<CheckCircle size={15} />} onClick={handleBayarLunas} loading={loading}>
              Save Settlement
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setConfirmLunas(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Print-only styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          header, nav, aside { display: none !important; }
        }
      `}</style>
      <StatusModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ ...statusModal, isOpen: false })}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </div>
  );
}
