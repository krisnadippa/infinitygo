"use client";

import { useState } from "react";
import { Search, Eye, Edit2, Trash2, Download, PlusCircle, ChevronUp, ChevronDown, DollarSign } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import StatusModal from "@/components/admin/StatusModal";
import { formatRupiah, formatCurrency, Invoice, formatDate } from "@/lib/admin-data";
import Link from "next/link";
import { deleteInvoice } from "../../actions";

type SortField = "invoiceNumber" | "customerName" | "invoiceDate" | "grandTotal" | "totalExpense" | "netProfit" | "status" | "createdAt";

export default function InvoiceListClient({ initialData }: { initialData: any[] }) {
  const [invoices, setInvoices] = useState<any[]>(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 10;
  
  // Modals state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await deleteInvoice(deleteId);
      setInvoices((prev) => prev.filter((inv) => inv.id !== deleteId));
      setDeleteId(null);
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Berhasil",
        message: "Invoice telah berhasil dihapus dari sistem."
      });
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menghapus data. Silakan coba lagi."
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = invoices
    .filter((inv) => {
      const matchSearch =
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "All" || inv.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      // Handle date fields sorting chronologically
      if (sortField === "createdAt" || sortField === "invoiceDate") {
        const aTime = aVal ? new Date(aVal).getTime() : 0;
        const bTime = bVal ? new Date(bVal).getTime() : 0;
        return sortDir === "asc" ? aTime - bTime : bTime - aTime;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDir === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const SortIcon = ({ field }: { field: SortField }) => (
    <span className="inline-flex flex-col ml-1">
      <ChevronUp size={10} className={sortField === field && sortDir === "asc" ? "text-blue-600" : "text-slate-300"} />
      <ChevronDown size={10} className={sortField === field && sortDir === "desc" ? "text-blue-600" : "text-slate-300"} />
    </span>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Invoice List</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{filtered.length} invoices found</p>
        </div>
        <Link href="/admin/invoice/create">
          <Button icon={<PlusCircle size={15} />}>Create Invoice</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search invoice or customer..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            {["All", "Paid", "DP", "Pending", "Draft", "Cancelled"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {[
                  { label: "Invoice", field: "invoiceNumber" as SortField },
                  { label: "Customer", field: "customerName" as SortField },
                  { label: "Date", field: "invoiceDate" as SortField },
                  { label: "Revenue", field: "grandTotal" as SortField },
                  { label: "Expense", field: "totalExpense" as SortField },
                  { label: "Net Profit", field: "netProfit" as SortField },
                  { label: "Status", field: "status" as SortField },
                ].map(({ label, field }) => (
                  <th
                    key={field}
                    className="text-left px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 cursor-pointer hover:text-slate-600 select-none whitespace-nowrap"
                    onClick={() => toggleSort(field)}
                  >
                    {label} <SortIcon field={field} />
                  </th>
                ))}
                <th className="text-left px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-[13.5px] text-slate-400">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                paginated.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <Link href={`/admin/invoice/${inv.id}`} className="text-[13px] font-semibold text-blue-600 hover:underline">{inv.invoiceNumber}</Link>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[11.5px] text-slate-400">{inv.paymentMethod}</p>
                        {inv.paymentType === "DP" && (
                          <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-200 font-medium">
                            {inv.paidFull ? "Paid" : `Balance Due ${formatCurrency(inv.remainingAmount, inv.currency)}`}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-slate-700">{inv.customerName}</p>
                      <p className="text-[11.5px] text-slate-400">{inv.customerPhone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-600 whitespace-nowrap">{formatDate(inv.invoiceDate)}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-semibold text-slate-800">{formatCurrency(inv.grandTotal, inv.currency)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-rose-600 font-medium">
                        {inv.totalExpense > 0 ? formatCurrency(inv.totalExpense, inv.currency) : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className={`text-[13px] font-semibold ${inv.netProfit > 0 ? "text-green-600" : "text-slate-400"}`}>
                        {inv.netProfit > 0 ? formatCurrency(inv.netProfit, inv.currency) : "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={inv.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/admin/invoice/${inv.id}`} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors" title="View & Print">
                          <Eye size={14} />
                        </Link>
                        <Link href={`/admin/invoice/create?id=${inv.id}`} className="p-1.5 rounded-lg hover:bg-amber-50 text-slate-400 hover:text-amber-600 transition-colors" title="Edit">
                          <Edit2 size={14} />
                        </Link>
                        <Link href={`/admin/invoice/expense?id=${inv.id}`} className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors" title="Add Expense">
                          <DollarSign size={14} />
                        </Link>
                        <Link href={`/admin/invoice/${inv.id}`} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Print Invoice">
                          <Download size={14} />
                        </Link>
                        <button onClick={() => setDeleteId(inv.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
            <p className="text-[12.5px] text-slate-400">
              Page {page} of {totalPages} ({filtered.length} total)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-[12.5px] border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 text-[12.5px] rounded-lg transition-colors ${
                    p === page ? "bg-blue-600 text-white" : "hover:bg-slate-50 text-slate-600 border border-slate-200"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-[12.5px] border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Status & Delete Modals */}
      <StatusModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        type="delete"
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete Now"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        loading={loading}
      />

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
