"use client";

import { useState } from "react";
import { Download, Filter } from "lucide-react";
import Button from "@/components/admin/Button";
import { StatusBadge } from "@/components/admin/Badge";
import { formatRupiah } from "@/lib/admin-data";

export default function ReportsClient({ initialInvoices }: { initialInvoices: any[] }) {
  const [dateFrom, setDateFrom] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
  });
  const [dateTo, setDateTo] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const lastDay = new Date(y, m + 1, 0).getDate();
    const mm = String(m + 1).padStart(2, '0');
    return `${y}-${mm}-${String(lastDay).padStart(2, '0')}`;
  });
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter logic
  const filteredInvoices = initialInvoices.filter((inv) => {
    const invDate = new Date(inv.invoiceDate).toISOString().split("T")[0];
    const matchDate = invDate >= dateFrom && invDate <= dateTo;
    const matchStatus = statusFilter === "All" || 
                       inv.status.toLowerCase() === statusFilter.toLowerCase() ||
                       (statusFilter === "Paid" && ["PAID", "Lunas"].includes(inv.status));
    return matchDate && matchStatus;
  });

  const paidInvoices = filteredInvoices.filter((i) => ["PAID", "Paid", "Lunas"].includes(i.status));
  const totalRevenue = paidInvoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalExpense = paidInvoices.reduce((s, i) => s + i.totalExpense, 0);
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

  // Mock chart data for now, but use current stats for May
  const monthlyChartData = [
    { month: "Jan", revenue: 45000000, expense: 22000000 },
    { month: "Feb", revenue: 52000000, expense: 28000000 },
    { month: "Mar", revenue: 38000000, expense: 18000000 },
    { month: "Apr", revenue: 67000000, expense: 35000000 },
    { month: "May", revenue: totalRevenue, expense: totalExpense },
  ];

  const activeData = monthlyChartData.filter((d) => d.revenue > 0);
  const maxRev = Math.max(...activeData.map((d) => d.revenue));

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Report</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Laporan keuangan dan performa bisnis</p>
        </div>
        <Button icon={<Download size={15} />} variant="outline" onClick={handleExportPDF}>Export Report (PDF)</Button>
      </div>

      {/* Header for PDF only */}
      <div className="hidden print:block mb-8">
        <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">INFINITY GO BALI</h1>
            <p className="text-sm text-slate-600">Laporan Keuangan & Performa Bisnis</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Periode:</p>
            <p className="text-sm font-semibold">{dateFrom} s/d {dateTo}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 no-print">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">Dari Tanggal</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2 text-[13px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">Sampai Tanggal</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="px-3 py-2 text-[13px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-[12.5px] font-medium text-slate-600 mb-1.5">Status Invoice</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-[13px] border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
              {["All", "Paid", "Pending", "Draft", "Cancelled"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <Button icon={<Filter size={14} />}>Terapkan Filter</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatRupiah(totalRevenue), color: "text-emerald-600", bg: "bg-emerald-50/50", border: "border-emerald-100" },
          { label: "Total Expense", value: formatRupiah(totalExpense), color: "text-rose-500", bg: "bg-rose-50/50", border: "border-rose-100" },
          { label: "Net Profit", value: formatRupiah(netProfit), color: "text-blue-600", bg: "bg-blue-50/50", border: "border-blue-100" },
          { label: "Profit Margin", value: `${profitMargin}%`, color: "text-violet-600", bg: "bg-violet-50/50", border: "border-violet-100" },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} rounded-2xl border ${card.border} p-4 print:bg-white print:border-slate-200`}>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">{card.label}</p>
            <p className={`text-[17px] sm:text-[18px] font-extrabold truncate ${card.color}`} title={card.value}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart - Hide in print for cleaner look */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 no-print">
        <h3 className="text-[14.5px] font-semibold text-slate-800 mb-5">Monthly Revenue Chart 2026</h3>
        <div className="flex items-end gap-3 h-44">
          {activeData.map((item, i) => {
            const height = maxRev > 0 ? (item.revenue / maxRev) * 100 : 0;
            return (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                <p className="text-[10px] text-slate-400">{formatRupiah(item.revenue).replace("Rp\u00a0", "Rp").replace(".000.000", " Jt")}</p>
                <div className="w-full flex items-end justify-center h-36">
                  <div
                    className="w-full bg-blue-600 rounded-t-lg hover:bg-blue-500 transition-colors"
                    style={{ height: `${height}%`, minHeight: "4px" }}
                    title={formatRupiah(item.revenue)}
                  />
                </div>
                <span className="text-[10.5px] text-slate-400">{item.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Invoice breakdown table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[14.5px] font-semibold text-slate-800">Detail Invoice</h3>
        </div>
        <div className="overflow-x-auto hide-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Inv", "Customer", "Revenue", "Expense", "Profit", "Margin", "Status"].map((h) => (
                  <th key={h} className="text-left px-2 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => {
                const margin = inv.grandTotal > 0 ? Math.round((inv.netProfit / inv.grandTotal) * 100) : 0;
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-2 py-2.5 text-[11.5px] font-medium text-blue-600 whitespace-nowrap">{inv.invoiceNumber}</td>
                    <td className="px-2 py-2.5 text-[11.5px] text-slate-700 max-w-[120px] truncate" title={inv.customerName}>{inv.customerName}</td>
                    <td className="px-2 py-2.5 text-[11.5px] font-semibold text-emerald-600 whitespace-nowrap">{formatRupiah(inv.grandTotal).replace(",00", "")}</td>
                    <td className="px-2 py-2.5 text-[11.5px] text-rose-500 whitespace-nowrap">{inv.totalExpense > 0 ? formatRupiah(inv.totalExpense).replace(",00", "") : "—"}</td>
                    <td className="px-2 py-2.5 text-[11.5px] font-bold text-blue-700 whitespace-nowrap">{inv.netProfit > 0 ? formatRupiah(inv.netProfit).replace(",00", "") : "—"}</td>
                    <td className="px-2 py-2.5 text-[11.5px] text-violet-600 font-bold">{inv.netProfit > 0 ? `${margin}%` : "—"}</td>
                    <td className="px-2 py-2.5 whitespace-nowrap"><StatusBadge status={inv.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .lg\\:ml-64 { margin-left: 0 !important; }
          main { padding: 0 !important; }
        }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}
