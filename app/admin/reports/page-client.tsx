"use client";

import { useState } from "react";
import { Download, Filter } from "lucide-react";
import Button from "@/components/admin/Button";
import { StatusBadge } from "@/components/admin/Badge";
import { formatRupiah } from "@/lib/admin-data";

export default function ReportsClient({ initialInvoices }: { initialInvoices: any[] }) {
  const [invoices] = useState<any[]>(initialInvoices);
  const [dateFrom, setDateFrom] = useState("2026-05-01");
  const [dateTo, setDateTo] = useState("2026-05-31");
  const [statusFilter, setStatusFilter] = useState("All");

  const paidInvoices = invoices.filter((i) => ["PAID", "Paid", "Lunas"].includes(i.status));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Report</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Laporan keuangan dan performa bisnis</p>
        </div>
        <Button icon={<Download size={15} />} variant="outline">Export Report</Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: formatRupiah(totalRevenue), color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
          { label: "Total Expense", value: formatRupiah(totalExpense), color: "text-red-500", bg: "bg-red-50", border: "border-red-100" },
          { label: "Net Profit", value: formatRupiah(netProfit), color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
          { label: "Profit Margin", value: `${profitMargin}%`, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
        ].map((card) => (
          <div key={card.label} className={`${card.bg} rounded-2xl border ${card.border} p-5`}>
            <p className="text-[12px] text-slate-500 mb-1">{card.label}</p>
            <p className={`text-[20px] font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-[14.5px] font-semibold text-slate-800">Detail Invoice</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Invoice", "Customer", "Revenue", "Expense", "Net Profit", "Margin", "Status"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map((inv) => {
                const margin = inv.grandTotal > 0 ? Math.round((inv.netProfit / inv.grandTotal) * 100) : 0;
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-[13px] font-medium text-blue-600">{inv.invoiceNumber}</td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-700">{inv.customerName}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-green-600">{formatRupiah(inv.grandTotal)}</td>
                    <td className="px-5 py-3.5 text-[13px] text-red-500">{inv.totalExpense > 0 ? formatRupiah(inv.totalExpense) : "—"}</td>
                    <td className="px-5 py-3.5 text-[13px] font-semibold text-blue-700">{inv.netProfit > 0 ? formatRupiah(inv.netProfit) : "—"}</td>
                    <td className="px-5 py-3.5 text-[13px] text-purple-600 font-medium">{inv.netProfit > 0 ? `${margin}%` : "—"}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={inv.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
