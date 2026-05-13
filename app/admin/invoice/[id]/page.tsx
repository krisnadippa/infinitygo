"use client";

import { useState } from "react";
import { dummyInvoices, formatRupiah, Invoice } from "@/lib/admin-data";
import InvoicePrint from "@/components/admin/InvoicePrint";
import Button from "@/components/admin/Button";
import { StatusBadge } from "@/components/admin/Badge";
import Modal from "@/components/admin/Modal";
import { Printer, ArrowLeft, CheckCircle, Edit2 } from "lucide-react";
import Link from "next/link";
import { use } from "react";

// Shared global state simulation — in real app this comes from a store/API
// We use a module-level store pattern for demo
let invoiceStore: Invoice[] = [...dummyInvoices];

export function getInvoiceStore() { return invoiceStore; }
export function updateInvoiceStore(updated: Invoice[]) { invoiceStore = updated; }

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [invoices, setInvoices] = useState<Invoice[]>(invoiceStore);
  const [confirmLunas, setConfirmLunas] = useState(false);
  const [lunasDone, setLunasDone] = useState(false);

  const invoice = invoices.find((inv) => inv.id === id);

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400">
        <p className="text-[15px] font-medium">Invoice tidak ditemukan.</p>
        <Link href="/admin/invoice/list" className="mt-3 text-blue-600 text-[13px] hover:underline">
          Kembali ke Invoice List
        </Link>
      </div>
    );
  }

  const handleBayarLunas = () => {
    const updated = invoices.map((inv) =>
      inv.id === id
        ? { ...inv, paidFull: true, status: "Paid" as const, remainingAmount: 0 }
        : inv
    );
    setInvoices(updated);
    updateInvoiceStore(updated);
    setConfirmLunas(false);
    setLunasDone(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentInvoice = invoices.find((inv) => inv.id === id)!;

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-3">
          <Link href="/admin/invoice/list">
            <Button variant="ghost" size="sm" icon={<ArrowLeft size={15} />}>
              Kembali
            </Button>
          </Link>
          <div>
            <h1 className="text-[18px] font-bold text-slate-800">{currentInvoice.invoiceNumber}</h1>
            <p className="text-[12.5px] text-slate-500">{currentInvoice.customerName}</p>
          </div>
          <StatusBadge status={currentInvoice.status} />
        </div>

        <div className="flex items-center gap-2">
          {/* Bayar Sisa button — hanya muncul jika DP dan belum lunas */}
          {currentInvoice.paymentType === "DP" && !currentInvoice.paidFull && (
            <Button
              variant="primary"
              icon={<CheckCircle size={15} />}
              onClick={() => setConfirmLunas(true)}
            >
              Bayar Sisa ({formatRupiah(currentInvoice.remainingAmount)})
            </Button>
          )}

          <Button variant="outline" icon={<Printer size={15} />} onClick={handlePrint}>
            Cetak / Print
          </Button>
        </div>
      </div>

      {lunasDone && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-[13px] text-green-700 font-medium no-print">
          Pembayaran sisa berhasil dicatat. Invoice sekarang berstatus LUNAS.
        </div>
      )}

      {/* Print area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 print:shadow-none print:border-none print:rounded-none print:p-6">
        <InvoicePrint invoice={currentInvoice} />
      </div>

      {/* Confirm modal */}
      <Modal
        isOpen={confirmLunas}
        onClose={() => setConfirmLunas(false)}
        title="Konfirmasi Pelunasan"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-[13.5px] text-slate-600">
            Konfirmasi bahwa customer <strong>{currentInvoice.customerName}</strong> telah membayar sisa tagihan:
          </p>
          <div className="bg-slate-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-500">Total Invoice</span>
              <span className="font-semibold">{formatRupiah(currentInvoice.grandTotal)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-500">DP Sudah Dibayar</span>
              <span className="font-semibold text-blue-600">- {formatRupiah(currentInvoice.dpAmount)}</span>
            </div>
            <div className="flex justify-between text-[13px] border-t border-slate-200 pt-2">
              <span className="font-bold text-slate-800">Sisa yang Dibayar</span>
              <span className="font-black text-green-600">{formatRupiah(currentInvoice.remainingAmount)}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" icon={<CheckCircle size={15} />} onClick={handleBayarLunas}>
              Konfirmasi Lunas
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setConfirmLunas(false)}>
              Batal
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
    </div>
  );
}
