"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Trash2, Eye, Download, Save, CreditCard, DollarSign } from "lucide-react";
import { Input, Select, Textarea } from "@/components/admin/FormFields";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import InvoicePrint from "@/components/admin/InvoicePrint";
import { InvoiceItem, ItemType, PaymentMethod, PaymentType, Invoice, formatRupiah } from "@/lib/admin-data";

function generateId() { return Math.random().toString(36).slice(2, 9); }

const currentYear = new Date().getFullYear();

function generateInvoiceNumber() {
  const seq = String(Math.floor(Math.random() * 900) + 100).padStart(3, "0");
  return `INV-${currentYear}-${seq}`;
}

const itemTypeOptions = [
  { value: "Paket Tour", label: "Paket Tour" },
  { value: "Akomodasi", label: "Akomodasi" },
  { value: "Kendaraan", label: "Kendaraan" },
  { value: "Custom", label: "Custom" },
];

const statusOptions = [
  { value: "Draft", label: "Draft" },
  { value: "Pending", label: "Pending" },
  { value: "DP", label: "DP (Down Payment)" },
  { value: "Paid", label: "Paid / Lunas" },
  { value: "Cancelled", label: "Cancelled" },
];

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: "Cash", label: "Cash" },
  { value: "Bank Transfer", label: "Bank Transfer" },
  { value: "Credit Card", label: "Credit Card" },
  { value: "E-Wallet", label: "E-Wallet" },
];

export default function CreateInvoicePage() {
  const [invoiceNumber] = useState(generateInvoiceNumber());
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<Invoice["status"]>("Pending");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("Bank Transfer");
  const [paymentType, setPaymentType] = useState<PaymentType>("Full");
  const [dpAmount, setDpAmount] = useState(0);
  const [dpDate, setDpDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: generateId(), type: "Paket Tour", name: "", description: "", quantity: 1, price: 0, subtotal: 0 },
  ]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [saved, setSaved] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setInvoiceDate(today);
    setDpDate(today);
  }, []);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: generateId(), type: "Paket Tour", name: "", description: "", quantity: 1, price: 0, subtotal: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, [field]: value };
        if (field === "quantity" || field === "price") {
          updated.subtotal = updated.quantity * updated.price;
        }
        return updated;
      })
    );
  };

  const subtotal = items.reduce((sum, i) => sum + i.subtotal, 0);
  const grandTotal = subtotal - discount + tax;
  const remainingAmount = paymentType === "DP" ? Math.max(0, grandTotal - dpAmount) : 0;

  // Auto-set status when payment type changes
  const handlePaymentTypeChange = (type: PaymentType) => {
    setPaymentType(type);
    if (type === "DP") {
      setStatus("DP");
    } else {
      setStatus("Pending");
    }
  };

  const buildInvoice = (): Invoice => ({
    id: generateId(),
    invoiceNumber,
    customerName,
    customerPhone,
    customerEmail,
    invoiceDate,
    dueDate,
    status: paymentType === "Full" && status === "DP" ? "Pending" : status,
    paymentMethod,
    paymentType,
    dpAmount: paymentType === "DP" ? dpAmount : 0,
    dpDate: paymentType === "DP" ? dpDate : "",
    remainingAmount,
    paidFull: paymentType === "Full" ? status === "Paid" : false,
    notes,
    items,
    subtotal,
    discount,
    tax,
    grandTotal,
    expenses: [],
    totalExpense: 0,
    netProfit: 0,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePrint = () => {
    setPreviewOpen(true);
    // Allow modal to open then trigger print
    setTimeout(() => window.print(), 500);
  };

  const previewInvoice = buildInvoice();

  return (
    <div className="space-y-6 print:space-y-0">
      <div className="print:hidden space-y-6">
        <div>
        <h1 className="text-[20px] font-bold text-slate-800">Create Invoice</h1>
        <p className="text-[13px] text-slate-500 mt-0.5">Buat invoice baru untuk customer</p>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-[13px] text-green-700 font-medium">
          Invoice {invoiceNumber} berhasil disimpan.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="xl:col-span-2 space-y-5">
          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-[14px] font-semibold text-slate-800 mb-4">Informasi Invoice & Customer</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Invoice Number</label>
                <input type="text" value={invoiceNumber} readOnly
                  className="w-full px-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" />
              </div>
              <Input label="Customer Name" placeholder="Nama lengkap customer" value={customerName} onChange={(e) => setCustomerName(e.target.value)} id="customer-name" />
              <Input label="Nomor HP / WhatsApp" placeholder="+62812345678" type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} id="customer-phone" />
              <Input label="Email Customer" placeholder="customer@email.com" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} id="customer-email" />
              <Input label="Tanggal Invoice" type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} id="invoice-date" />
              <Input label="Jatuh Tempo" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} id="due-date" />
              <Select label="Metode Pembayaran" id="payment-method" options={paymentOptions} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} />
              <Select label="Status" id="invoice-status" options={statusOptions} value={status} onChange={(e) => setStatus(e.target.value as Invoice["status"])} />
              <div className="sm:col-span-2">
                <Textarea label="Catatan" placeholder="Catatan tambahan untuk customer..." rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} id="invoice-notes" />
              </div>
            </div>
          </div>

          {/* Invoice items */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[14px] font-semibold text-slate-800">Item Invoice</h2>
              <Button variant="outline" size="sm" icon={<PlusCircle size={14} />} onClick={addItem}>
                Tambah Item
              </Button>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wide">Item {index + 1}</span>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[12.5px] font-medium text-slate-700 mb-1">Tipe</label>
                      <select value={item.type} onChange={(e) => updateItem(item.id, "type", e.target.value as ItemType)}
                        className="w-full px-3 py-2.5 text-[13px] border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                        {itemTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <label className="block text-[12.5px] font-medium text-slate-700 mb-1">Nama Item</label>
                      <input type="text" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} placeholder="Nama layanan atau produk"
                        className="w-full px-3 py-2.5 text-[13px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[12.5px] font-medium text-slate-700 mb-1">Deskripsi</label>
                      <input type="text" value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} placeholder="Deskripsi singkat"
                        className="w-full px-3 py-2.5 text-[13px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-medium text-slate-700 mb-1">Qty</label>
                      <input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-[13px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    </div>
                    <div>
                      <label className="block text-[12.5px] font-medium text-slate-700 mb-1">Harga (Rp)</label>
                      <input type="number" min={0} value={item.price || ""} onChange={(e) => updateItem(item.id, "price", Number(e.target.value))}
                        className="w-full px-3 py-2.5 text-[13px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <p className="text-[13px] font-semibold text-slate-700">
                      Subtotal: <span className="text-blue-600">{formatRupiah(item.subtotal)}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Type - DP Toggle */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-[14px] font-semibold text-slate-800 mb-4">Jenis Pembayaran</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => handlePaymentTypeChange("Full")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  paymentType === "Full"
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentType === "Full" ? "bg-blue-600" : "bg-slate-100"}`}>
                  <DollarSign size={18} className={paymentType === "Full" ? "text-white" : "text-slate-400"} />
                </div>
                <div className="text-left">
                  <p className={`text-[13.5px] font-semibold ${paymentType === "Full" ? "text-blue-700" : "text-slate-700"}`}>
                    Bayar Penuh
                  </p>
                  <p className="text-[12px] text-slate-400">Langsung lunas</p>
                </div>
              </button>
              <button
                onClick={() => handlePaymentTypeChange("DP")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  paymentType === "DP"
                    ? "border-amber-500 bg-amber-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${paymentType === "DP" ? "bg-amber-500" : "bg-slate-100"}`}>
                  <CreditCard size={18} className={paymentType === "DP" ? "text-white" : "text-slate-400"} />
                </div>
                <div className="text-left">
                  <p className={`text-[13.5px] font-semibold ${paymentType === "DP" ? "text-amber-700" : "text-slate-700"}`}>
                    Down Payment (DP)
                  </p>
                  <p className="text-[12px] text-slate-400">Bayar sebagian dahulu</p>
                </div>
              </button>
            </div>

            {paymentType === "DP" && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Jumlah DP (Rp)</label>
                  <input
                    type="number"
                    min={0}
                    value={dpAmount || ""}
                    onChange={(e) => setDpAmount(Number(e.target.value))}
                    placeholder="Masukkan jumlah DP"
                    className="w-full px-3 py-2.5 text-[13.5px] border border-amber-300 rounded-lg bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400/30 focus:border-amber-400"
                  />
                </div>
                <Input label="Tanggal DP Dibayar" type="date" value={dpDate} onChange={(e) => setDpDate(e.target.value)} id="dp-date" />
                {grandTotal > 0 && dpAmount > 0 && (
                  <div className="col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-3 grid grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-[10.5px] text-amber-600 font-medium uppercase tracking-wide mb-0.5">Total Invoice</p>
                      <p className="text-[13px] font-bold text-amber-800">{formatRupiah(grandTotal)}</p>
                    </div>
                    <div className="text-center border-x border-amber-200">
                      <p className="text-[10.5px] text-amber-600 font-medium uppercase tracking-wide mb-0.5">DP Dibayar</p>
                      <p className="text-[13px] font-bold text-blue-700">{formatRupiah(dpAmount)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10.5px] text-amber-600 font-medium uppercase tracking-wide mb-0.5">Sisa Tagihan</p>
                      <p className="text-[13px] font-bold text-red-600">{formatRupiah(remainingAmount)}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-[14px] font-semibold text-slate-800 mb-4">Ringkasan Invoice</h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-[13px] text-slate-500">Subtotal</span>
                <span className="text-[13px] font-semibold text-slate-800">{formatRupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-[13px] text-slate-500">Diskon</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-slate-400">Rp</span>
                  <input type="number" min={0} value={discount || ""} onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-28 px-2 py-1 text-[13px] border border-slate-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-[13px] text-slate-500">Pajak (Rp)</span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-slate-400">Rp</span>
                  <input type="number" min={0} value={tax || ""} onChange={(e) => setTax(Number(e.target.value))}
                    className="w-28 px-2 py-1 text-[13px] border border-slate-300 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[14px] font-bold text-slate-800">Grand Total</span>
                <span className="text-[16px] font-bold text-blue-600">{formatRupiah(grandTotal)}</span>
              </div>

              {paymentType === "DP" && (
                <>
                  <div className="border-t border-slate-100 pt-3 mt-1 space-y-2">
                    <div className="flex justify-between items-center py-1.5 bg-blue-50 rounded-lg px-2">
                      <span className="text-[12.5px] text-blue-700 font-medium">DP Dibayar</span>
                      <span className="text-[12.5px] font-bold text-blue-700">- {formatRupiah(dpAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center py-1.5 bg-red-50 rounded-lg px-2">
                      <span className="text-[12.5px] text-red-600 font-medium">Sisa Tagihan</span>
                      <span className="text-[13px] font-bold text-red-600">{formatRupiah(remainingAmount)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2.5">
            <Button className="w-full" onClick={handleSave} icon={<Save size={15} />}>Simpan Invoice</Button>
            <Button variant="outline" className="w-full" icon={<Eye size={15} />} onClick={() => setPreviewOpen(true)}>Preview Invoice</Button>
            <Button variant="secondary" className="w-full" icon={<Download size={15} />} onClick={handlePrint}>Cetak / Download</Button>
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
            <p className="text-[12px] text-blue-700 font-medium mb-1">Informasi</p>
            <p className="text-[12px] text-blue-600">
              Setelah disimpan, tambahkan expense/modal dari menu Invoice - Expense. Untuk invoice DP, admin bisa mencatat pelunasan dari menu Invoice List.
            </p>
          </div>
        </div>
      </div>
      </div>

      {/* Preview Modal */}
      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Preview Invoice" size="xl">
        <div className="overflow-auto max-h-[75vh] print:max-h-none print:overflow-visible">
          <InvoicePrint invoice={previewInvoice} />
        </div>
        <div className="flex gap-3 pt-4 border-t border-slate-100 mt-4 print:hidden">
          <Button className="flex-1" icon={<Download size={15} />} onClick={() => window.print()}>Cetak / Download PDF</Button>
          <Button variant="outline" className="flex-1" onClick={() => setPreviewOpen(false)}>Tutup</Button>
        </div>
      </Modal>
    </div>
  );
}
