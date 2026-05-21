"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PlusCircle, Trash2, Edit2, Save, Search, ChevronRight, X } from "lucide-react";
import { Input, Select, Textarea } from "@/components/admin/FormFields";
import Button from "@/components/admin/Button";
import { StatusBadge } from "@/components/admin/Badge";
import Modal from "@/components/admin/Modal";
import StatusModal from "@/components/admin/StatusModal";
import {
  Expense,
  ExpenseCategory,
  formatRupiah,
  Invoice,
  formatDate,
  formatDateInput,
} from "@/lib/admin-data";
import { saveExpense, deleteExpense } from "../../actions";

const categoryOptions: { value: ExpenseCategory; label: string }[] = [
  { value: "Tour Cost", label: "Tour Cost" },
  { value: "Vehicle Cost", label: "Vehicle Cost" },
  { value: "Accommodation Cost", label: "Accommodation Cost" },
  { value: "Driver Fee", label: "Driver Fee" },
  { value: "Operational", label: "Operational" },
  { value: "Other", label: "Other" },
];

function generateId() { return Math.random().toString(36).slice(2, 9); }

// ---------------------------------------------------------------
// Invoice Picker Modal
// ---------------------------------------------------------------
interface InvoicePickerProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  onSelect: (invoice: Invoice) => void;
}

function InvoicePickerModal({ isOpen, onClose, invoices, onSelect }: InvoicePickerProps) {
  const [search, setSearch] = useState("");

  const filtered = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerPhone || "").includes(search)
  );

  const statusColor: Record<string, string> = {
    Paid: "text-green-600",
    DP: "text-blue-600",
    Pending: "text-amber-600",
    Draft: "text-slate-400",
    Cancelled: "text-red-500",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Pilih Invoice" size="lg">
      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Cari nomor invoice, nama customer, atau nomor HP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
          className="w-full pl-9 pr-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
      </div>

      <p className="text-[12px] text-slate-400 mb-3">{filtered.length} invoice ditemukan</p>

      {/* List */}
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Search size={24} className="mx-auto mb-2 opacity-40" />
            <p className="text-[13.5px]">Tidak ada invoice yang cocok</p>
          </div>
        ) : (
          filtered.map((inv: any) => (
            <button
              key={inv.id}
              onClick={() => { onSelect(inv); onClose(); }}
              className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[12px] font-bold text-blue-700">
                      {inv.invoiceNumber.split("-").pop()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[13.5px] font-semibold text-blue-700">{inv.invoiceNumber}</p>
                      <StatusBadge status={inv.status} />
                      {inv.paymentType === "DP" && !inv.paidFull && (
                        <span className="text-[10.5px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                          Sisa: {formatRupiah(inv.remainingAmount)}
                        </span>
                      )}
                    </div>
                    <p className="text-[12.5px] text-slate-600 mt-0.5 font-medium">{inv.customerName}</p>
                    <p className="text-[11.5px] text-slate-400">
                      {inv.customerPhone ? `${inv.customerPhone} • ` : ""}
                      {formatDate(inv.invoiceDate)}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-[13px] font-bold text-slate-800">{formatRupiah(inv.grandTotal)}</p>
                  <p className="text-[11px] text-slate-400">{inv.items.length} item</p>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 ml-auto mt-1 transition-colors" />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------
// Main Expense Page
// ---------------------------------------------------------------
export default function ExpenseClient({ initialInvoices }: { initialInvoices: any[] }) {
  const [invoices, setInvoices] = useState<any[]>(initialInvoices);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [form, setForm] = useState<Partial<Expense>>({
    name: "",
    category: "Tour Cost",
    amount: 0,
    date: "",
    notes: "",
  });

  // Modals state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({ isOpen: false, type: "success", title: "", message: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const searchParams = useSearchParams();
  const invoiceIdParam = searchParams.get("id");

  useEffect(() => {
    if (invoiceIdParam && invoices.length > 0) {
      const found = invoices.find(inv => inv.id === invoiceIdParam);
      if (found) {
        setSelectedInvoice(found);
      }
    }
  }, [invoiceIdParam, invoices]);

  const expenses = (selectedInvoice?.expenses as Expense[]) || [];
  const totalExpense = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const revenue = Number(selectedInvoice?.grandTotal) || 0;
  const netProfit = revenue - totalExpense;
  const profitMargin = revenue > 0 ? Math.round((netProfit / revenue) * 100) : 0;

  const openAddModal = () => {
    setEditingExpense(null);
    setForm({
      name: "",
      category: "Tour Cost",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setEditingExpense(expense);
    setForm({
      ...expense,
      date: formatDateInput(expense.date)
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name || form.amount === undefined || !selectedInvoice) return;
    
    const expenseData = {
      ...(editingExpense ? { id: editingExpense.id } : {}),
      invoiceId: selectedInvoice.id,
      name: form.name,
      category: (form.category as ExpenseCategory) || "Tour Cost",
      amount: Number(form.amount) || 0,
      date: form.date || new Date().toISOString().split("T")[0],
      notes: form.notes || "",
    };

    // Optimistic UI
    const tempId = editingExpense?.id || `temp-${Math.random().toString(36).slice(2, 9)}`;
    const newExp = { ...expenseData, id: tempId } as Expense;

    const updatedInvoices = invoices.map(inv => {
      if (inv.id !== selectedInvoice.id) return inv;
      const currentExpenses = (inv.expenses as any[]) || [];
      const newExpenses = editingExpense 
        ? currentExpenses.map((e: any) => e.id === editingExpense.id ? newExp : e)
        : [...currentExpenses, newExp];
      return { ...inv, expenses: newExpenses };
    });

    setInvoices(updatedInvoices);
    const newSelected = updatedInvoices.find(inv => inv.id === selectedInvoice.id);
    setSelectedInvoice(newSelected);
    
    setModalOpen(false);
    
    try {
      const saved = await saveExpense(expenseData);
      // Sync the real ID from DB if it was a new expense
      if (saved && !editingExpense) {
        setInvoices(prev => prev.map(inv => {
          if (inv.id !== selectedInvoice.id) return inv;
          return {
            ...inv,
            expenses: (inv.expenses as any[]).map(e => e.id === tempId ? saved : e)
          };
        }));
        setSelectedInvoice((prev: any) => {
          if (!prev || prev.id !== selectedInvoice.id) return prev;
          return {
            ...prev,
            expenses: (prev.expenses as any[]).map(e => e.id === tempId ? saved : e)
          };
        });
      }
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Tersimpan",
        message: "Data pengeluaran telah berhasil disimpan."
      });
    } catch (error: any) {
      console.error("Failed to save expense:", error);
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: error.message || "Terjadi kesalahan saat menyimpan data. Silakan coba lagi."
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !selectedInvoice) return;
    setIsDeleting(true);

    try {
      const updatedInvoices = invoices.map(inv => {
        if (inv.id !== selectedInvoice.id) return inv;
        return { ...inv, expenses: inv.expenses.filter((e: any) => e.id !== deleteId) };
      });

      setInvoices(updatedInvoices);
      setSelectedInvoice(updatedInvoices.find(inv => inv.id === selectedInvoice.id));
      
      await deleteExpense(deleteId, selectedInvoice.id);
      setDeleteId(null);
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Terhapus",
        message: "Data pengeluaran telah berhasil dihapus."
      });
    } catch (error) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Gagal",
        message: "Gagal menghapus data pengeluaran."
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Expense Management</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Kelola modal dan biaya per invoice</p>
        </div>
        {selectedInvoice && (
          <Button icon={<PlusCircle size={15} />} onClick={openAddModal}>
            Tambah Expense
          </Button>
        )}
      </div>

      {/* Invoice selector card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        {!selectedInvoice ? (
          <div className="flex flex-col items-center py-8 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Search size={22} className="text-blue-500" />
            </div>
            <h3 className="text-[15px] font-semibold text-slate-700 mb-1">Pilih Invoice</h3>
            <p className="text-[13px] text-slate-400 mb-5 max-w-sm">
              Pilih invoice terlebih dahulu untuk mengelola expense dan menghitung keuntungan bersih.
            </p>
            <Button icon={<Search size={15} />} onClick={() => setPickerOpen(true)}>
              Cari &amp; Pilih Invoice
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <span className="text-[13px] font-bold text-blue-700">
                    {selectedInvoice.invoiceNumber.split("-").pop()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[14.5px] font-bold text-blue-700">{selectedInvoice.invoiceNumber}</p>
                    <StatusBadge status={selectedInvoice.status} />
                    {selectedInvoice.paymentType === "DP" && !selectedInvoice.paidFull && (
                      <span className="text-[11px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200 font-medium">
                        DP — Sisa {formatRupiah(selectedInvoice.remainingAmount)}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-slate-600 font-medium">{selectedInvoice.customerName}</p>
                  <p className="text-[12px] text-slate-400">
                    {selectedInvoice.customerPhone ? `${selectedInvoice.customerPhone} • ` : ""}
                    {formatDate(selectedInvoice.invoiceDate)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" icon={<Search size={14} />} onClick={() => setPickerOpen(true)}>
                  Ganti Invoice
                </Button>
                <button onClick={() => setSelectedInvoice(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Invoice items summary */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
              <p className="text-[11.5px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Item Invoice</p>
              <div className="space-y-1">
                {(selectedInvoice.items as any[]).map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-[12.5px]">
                    <span className="text-slate-600">{item.name} <span className="text-slate-400">x{item.quantity}</span></span>
                    <span className="font-semibold text-slate-700">{formatRupiah(item.subtotal)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-[13px] border-t border-slate-200 pt-2 mt-1">
                  <span className="font-bold text-slate-700">Total Revenue</span>
                  <span className="font-bold text-green-600">{formatRupiah(selectedInvoice.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedInvoice && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Expense table */}
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h3 className="text-[14.5px] font-semibold text-slate-800">Daftar Expense</h3>
              <span className="text-[12px] text-slate-400">{expenses.length} item</span>
            </div>

            {expenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-slate-400">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <PlusCircle size={20} />
                </div>
                <p className="text-[13.5px] font-medium">Belum ada expense</p>
                <p className="text-[12.5px] mt-1">Klik Tambah Expense untuk memulai</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      {["Nama Expense", "Kategori", "Jumlah", "Tanggal", "Aksi"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {expenses.map((exp: any) => (
                      <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="text-[13px] font-medium text-slate-700">{exp.name}</p>
                          {exp.notes && <p className="text-[11.5px] text-slate-400 mt-0.5 truncate max-w-[200px]">{exp.notes}</p>}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-[12px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-200">{exp.category}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-[13px] font-semibold text-slate-800">{formatRupiah(exp.amount)}</p>
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-slate-600">{formatDate(exp.date)}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEditModal(exp)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                            <button onClick={() => setDeleteId(exp.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Financial summary */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-[14.5px] font-semibold text-slate-800 mb-4">Ringkasan Keuangan</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-100">
                  <span className="text-[13px] text-green-700 font-medium">Invoice Revenue</span>
                  <span className="text-[13px] font-bold text-green-700">{formatRupiah(revenue)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-xl border border-red-100">
                  <span className="text-[13px] text-red-600 font-medium">Total Expense</span>
                  <span className="text-[13px] font-bold text-red-600">{formatRupiah(totalExpense)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="text-[13px] text-blue-700 font-medium">Net Profit</span>
                  <span className={`text-[13px] font-bold ${netProfit >= 0 ? "text-blue-700" : "text-red-600"}`}>{formatRupiah(netProfit)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <span className="text-[13px] text-purple-700 font-medium">Profit Margin</span>
                  <span className={`text-[14px] font-bold ${profitMargin >= 0 ? "text-purple-700" : "text-red-600"}`}>{profitMargin}%</span>
                </div>
              </div>
            </div>

            {/* Category breakdown */}
            {expenses.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-[13px] font-semibold text-slate-700 mb-3">Per Kategori</h3>
                {Object.entries(
                  expenses.reduce((acc, e) => {
                    acc[e.category] = (acc[e.category] || 0) + e.amount;
                    return acc;
                  }, {} as Record<string, number>)
                ).map(([cat, amt]: [string, number]) => (
                  <div key={cat} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                    <p className="text-[12.5px] text-slate-600">{cat}</p>
                    <p className="text-[12.5px] font-semibold text-slate-700">{formatRupiah(amt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Invoice Picker Modal */}
      <InvoicePickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        invoices={invoices}
        onSelect={(inv) => setSelectedInvoice(inv)}
      />

      {/* Add/Edit Expense Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingExpense ? "Edit Expense" : "Tambah Expense"}>
        <div className="space-y-4">
          <Input label="Nama Expense" placeholder="Nama biaya atau modal" value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} id="expense-name" />
          <Select label="Kategori" options={categoryOptions} value={form.category || "Tour Cost"} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as ExpenseCategory }))} id="expense-category" />
          <Input label="Jumlah (Rp)" type="number" placeholder="0" value={form.amount || ""} onChange={(e) => setForm((p) => ({ ...p, amount: Number(e.target.value) }))} id="expense-amount" />
          <Input label="Tanggal" type="date" value={formatDateInput(form.date || "")} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} id="expense-date" />
          <Textarea label="Catatan" placeholder="Catatan tambahan..." rows={3} value={form.notes || ""} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} id="expense-notes" />
          <div className="flex gap-3 pt-2">
            <Button className="flex-1" onClick={handleSave} icon={<Save size={15} />}>Simpan</Button>
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
          </div>
        </div>
      </Modal>

      {/* Status & Delete Modals */}
      <StatusModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        type="delete"
        title="Hapus Pengeluaran"
        message="Apakah Anda yakin ingin menghapus catatan pengeluaran ini?"
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={handleDelete}
        loading={isDeleting}
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
