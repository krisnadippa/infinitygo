"use client";

import Image from "next/image";
import { Invoice, formatRupiah, formatDate } from "@/lib/admin-data";

interface InvoicePrintProps {
  invoice: Invoice;
  showExpense?: boolean;
}

const itemTypeTranslation: Record<string, string> = {
  "Paket Tour": "Tour Package",
  "Akomodasi": "Accommodation",
  "Kendaraan": "Vehicle",
  "Custom": "Custom",
};

export default function InvoicePrint({ invoice, showExpense = false }: InvoicePrintProps) {
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

  const statusColor =
    invoice.status === "Paid"
      ? "border-green-600 text-green-700"
      : invoice.status === "DP"
      ? "border-blue-500 text-blue-600"
      : invoice.status === "Pending"
      ? "border-amber-500 text-amber-600"
      : invoice.status === "Cancelled"
      ? "border-red-500 text-red-600"
      : "border-slate-400 text-slate-500";

  const companyInfo = {
    name: "Infinity Go Bali",
    address: "Jl. Raya Kuta No. 88, Kuta, Badung",
    city: "Bali 80361, Indonesia",
    phone: "+62 812 3456 7890",
    email: "admin@infinitygo.id",
  };

  return (
    <div
      id="invoice-print-area"
      className="bg-white w-full max-w-[794px] mx-auto font-sans text-[13px] text-slate-800 pt-8 flex flex-col min-h-[970px]"
      style={{ 
        fontFamily: "'Inter', 'Outfit', sans-serif",
      }}
    >
      <style jsx global>{`
        @media print {
          @page {
            size: auto;
            margin: 0mm !important; /* Wajib 0mm untuk menyembunyikan header (URL) dan footer bawaan browser */
          }
          body {
            margin: 0 !important;
            padding: 10mm 15mm 15mm 15mm !important; /* Gunakan padding pada body untuk memberi jarak konten dengan tepi kertas */
            box-sizing: border-box;
          }
          header, footer, nav, .print-hidden {
            display: none !important;
          }
          #invoice-print-area {
            min-height: 270mm !important; /* Tinggi disesuaikan agar footer tetap terdorong ke bawah */
            display: flex !important;
            flex-direction: column !important;
          }
          .avoid-break {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}</style>
      {/* ===== HEADER ===== */}
      <div className="flex items-start justify-between pb-6 border-b-2 border-slate-800 mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Infinity Go"
              fill
              className="object-contain"
              sizes="56px"
            />
          </div>
          <div>
            <h1 className="text-[22px] font-black text-slate-900 leading-tight tracking-tight">
              {companyInfo.name}
            </h1>
            <p className="text-[11.5px] text-slate-500 mt-0.5">{companyInfo.address}</p>
            <p className="text-[11.5px] text-slate-500">{companyInfo.city}</p>
            <p className="text-[11.5px] text-slate-500">{companyInfo.phone}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-1">
            INVOICE
          </p>
          <p className="text-[18px] font-black text-slate-900">{invoice.invoiceNumber}</p>
          <div
            className={`inline-block mt-2 px-3 py-1 border-2 rounded text-[11px] font-bold uppercase tracking-wide ${statusColor}`}
          >
            {statusLabel}
          </div>
        </div>
      </div>

      {/* ===== BILL FROM / BILL TO / DATES ===== */}
      <div className="grid grid-cols-3 gap-6 mb-7">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            From
          </p>
          <p className="font-bold text-slate-800">{companyInfo.name}</p>
          <p className="text-slate-500 text-[12px] mt-0.5">{companyInfo.address}</p>
          <p className="text-slate-500 text-[12px]">{companyInfo.city}</p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            Bill To
          </p>
          <p className="font-bold text-slate-800">{invoice.customerName}</p>
          {invoice.customerPhone && (
            <p className="text-slate-500 text-[12px] mt-0.5">{invoice.customerPhone}</p>
          )}
          {invoice.customerEmail && (
            <p className="text-slate-500 text-[12px]">{invoice.customerEmail}</p>
          )}
        </div>
        <div className="text-right">
          <div className="mb-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Invoice Date
            </p>
            <p className="font-semibold text-slate-800">{formatDate(invoice.invoiceDate)}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Due Date
            </p>
            <p className="font-semibold text-slate-800">{formatDate(invoice.dueDate)}</p>
          </div>
          <div className="mt-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
              Payment Method
            </p>
            <p className="font-semibold text-slate-800">{invoice.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* ===== ITEMS TABLE ===== */}
      <table className="w-full mb-5 border-collapse">
        <thead>
          <tr className="border-b-2 border-slate-800 text-slate-800">
            <th className="text-left px-4 py-3 text-[11.5px] font-bold uppercase tracking-widest">
              Description
            </th>
            <th className="text-left px-4 py-3 text-[11.5px] font-bold uppercase tracking-widest w-28">
              Type
            </th>
            <th className="text-center px-4 py-3 text-[11.5px] font-bold uppercase tracking-widest w-14">
              Qty
            </th>
            <th className="text-right px-4 py-3 text-[11.5px] font-bold uppercase tracking-widest w-36">
              Unit Price
            </th>
            <th className="text-right px-4 py-3 text-[11.5px] font-bold uppercase tracking-widest w-36">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr
              key={item.id}
              className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}
            >
              <td className="px-4 py-3 border-b border-slate-200">
                <p className="font-semibold text-slate-800 text-[13px]">{item.name}</p>
                {item.description && (
                  <p className="text-[11.5px] text-slate-400 mt-0.5">{item.description}</p>
                )}
              </td>
              <td className="px-4 py-3 border-b border-slate-200">
                <span className="text-[10.5px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100 whitespace-nowrap">
                  {itemTypeTranslation[item.type] || item.type}
                </span>
              </td>
              <td className="px-4 py-3 text-center border-b border-slate-200 text-slate-700">
                {item.quantity}
              </td>
              <td className="px-4 py-3 text-right border-b border-slate-200 text-slate-700">
                {formatRupiah(item.price)}
              </td>
              <td className="px-4 py-3 text-right border-b border-slate-200 font-semibold text-slate-800">
                {formatRupiah(item.subtotal)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ===== SUMMARY ===== */}
      <div className="flex justify-end mb-7 print:pt-16 avoid-break">
        <div className="w-72 space-y-1.5">
          <div className="flex justify-between py-1.5 border-b border-slate-200">
            <span className="text-slate-500">Subtotal</span>
            <span className="font-medium text-slate-800">{formatRupiah(invoice.subtotal)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between py-1.5 border-b border-slate-200">
              <span className="text-slate-500">Discount</span>
              <span className="font-medium text-red-500">- {formatRupiah(invoice.discount)}</span>
            </div>
          )}
          {invoice.tax > 0 && (
            <div className="flex justify-between py-1.5 border-b border-slate-200">
              <span className="text-slate-500">Tax</span>
              <span className="font-medium text-slate-800">{formatRupiah(invoice.tax)}</span>
            </div>
          )}
          <div className="flex justify-between py-2.5 border-b-2 border-slate-800 mt-2">
            <span className="font-bold text-slate-800 text-[14px]">Total</span>
            <span className="font-black text-slate-900 text-[15px]">
              {formatRupiah(invoice.grandTotal)}
            </span>
          </div>

          {/* DP Section */}
          {invoice.paymentType === "DP" && (
            <>
              <div className="flex justify-between py-1.5 border-b border-slate-200 bg-blue-50 px-2 rounded">
                <span className="text-blue-700 font-medium">
                  Deposit Paid
                  {invoice.dpDate && (
                    <span className="text-[11px] text-blue-400 ml-1">({formatDate(invoice.dpDate)})</span>
                  )}
                </span>
                <span className="font-bold text-blue-700">
                  - {formatRupiah(invoice.dpAmount)}
                </span>
              </div>
              {invoice.paidFull && (
                <div className="flex justify-between py-1.5 border-b border-slate-200 bg-green-50 px-2 rounded">
                  <span className="text-green-700 font-medium">
                    Remaining Balance Paid
                    {invoice.paidRemainingDate && (
                      <span className="text-[11px] text-green-500 ml-1">({formatDate(invoice.paidRemainingDate)})</span>
                    )}
                  </span>
                  <span className="font-bold text-green-700">
                    - {formatRupiah(invoice.paidRemainingAmount ?? invoice.remainingAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2.5 mt-1 rounded-lg px-2 bg-slate-100">
                <span className="font-bold text-slate-800 text-[13px]">
                  {invoice.paidFull ? "Balance Due" : "Balance Due"}
                </span>
                <span
                  className={`font-black text-[14px] ${
                    invoice.paidFull ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {invoice.paidFull ? "Rp 0" : formatRupiah(invoice.remainingAmount)}
                </span>
              </div>
              {invoice.paidFull && (
                <div className="text-center py-1.5 bg-green-100 rounded-lg border border-green-300 mt-1">
                  <span className="text-green-800 font-bold text-[11px] uppercase tracking-wider">
                    ✓ PAID IN FULL
                  </span>
                </div>
              )}
            </>
          )}

          {/* Full payment paid */}
          {invoice.paymentType === "Full" && invoice.status === "Paid" && (
            <div className="flex justify-between py-1.5">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-bold text-green-600">{formatRupiah(invoice.grandTotal)}</span>
            </div>
          )}
          {invoice.paymentType === "Full" && invoice.status !== "Paid" && (
            <div className="flex justify-between py-1.5">
              <span className="font-bold text-slate-800">Balance Due</span>
              <span className="font-black text-red-600">{formatRupiah(invoice.grandTotal)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ===== EXPENSE SECTION ===== */}
      {showExpense && invoice.expenses && invoice.expenses.length > 0 && (
        <div className="mt-7 mb-4 print:pt-16 avoid-break">
          <div className="flex items-center gap-3 mb-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Operational Expense Details
            </p>
            <div className="flex-1 h-px bg-slate-200" />
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-700 text-slate-700">
                <th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest">Description</th>
                <th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest w-36">Category</th>
                <th className="text-left px-3 py-2 text-[11px] font-bold uppercase tracking-widest w-24">Date</th>
                <th className="text-right px-3 py-2 text-[11px] font-bold uppercase tracking-widest w-36">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.expenses.map((exp, i) => (
                <tr key={exp.id} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                  <td className="px-3 py-2.5 border-b border-slate-100">
                    <p className="text-[12.5px] font-medium text-slate-700">{exp.name}</p>
                    {exp.notes && <p className="text-[11px] text-slate-400 mt-0.5">{exp.notes}</p>}
                  </td>
                  <td className="px-3 py-2.5 border-b border-slate-100">
                    <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-100">
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 border-b border-slate-100 text-[12px] text-slate-500">{formatDate(exp.date)}</td>
                  <td className="px-3 py-2.5 border-b border-slate-100 text-right font-semibold text-slate-700">
                    {formatRupiah(exp.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Expense summary row */}
          <div className="flex justify-end mt-3 gap-12 pr-3">
            <span className="text-[12px] text-slate-500 font-medium">Total Operational Expenses</span>
            <span className="text-[13px] font-bold text-amber-700">{formatRupiah(invoice.totalExpense)}</span>
          </div>
          <div className="flex justify-end mt-1.5 gap-12 pr-3 pb-3 border-b-2 border-slate-700">
            <span className="text-[12px] text-slate-500 font-medium">Net Profit</span>
            <span className="text-[13px] font-bold text-green-700">{formatRupiah(invoice.netProfit)}</span>
          </div>
        </div>
      )}

      {/* ===== BOTTOM SECTION (NOTES + FOOTER) ===== */}
      <div className="mt-auto print:pt-16 avoid-break">
        <div className="grid grid-cols-2 gap-6 pt-5 border-t-2 border-slate-800">
          <div>
            {invoice.notes && (
              <>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Notes
                </p>
                <p className="text-[12.5px] text-slate-600 leading-relaxed">{invoice.notes}</p>
              </>
            )}
            <div className="mt-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                Payment Terms
              </p>
              <p className="text-[12px] text-slate-500">
                Payment should be made before the due date. Thank you for choosing Infinity Go Bali.
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
              Payment Information
            </p>
            <p className="font-bold text-slate-800 text-[13.5px]">BCA</p>
            <p className="font-semibold text-slate-700 text-[13px]">4040619343</p>
            <p className="text-slate-600 text-[12.5px]">A/N PT. Anugerah Wisata kencana</p>
            <p className="text-slate-600 text-[12.5px] mt-0.5">Swift code: CENAIDJA</p>
            <p className="text-slate-500 text-[11.5px] mt-1.5 leading-snug">
              Kartika plaza street no.89
              <br />
              Kuta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
