"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea } from "@/components/admin/FormFields";
import { dummyAccommodations, Accommodation, formatRupiah } from "@/lib/admin-data";
import Image from "next/image";

function generateId() { return Math.random().toString(36).slice(2, 9); }

const locationOptions = [
  { value: "Bali", label: "Bali" },
  { value: "Jakarta", label: "Jakarta" },
  { value: "Labuan Bajo", label: "Labuan Bajo" },
  { value: "Yogyakarta", label: "Yogyakarta" },
];

const typeOptions = [
  { value: "Hotel", label: "Hotel" },
  { value: "Villa", label: "Villa" },
  { value: "Guest House", label: "Guest House" },
  { value: "Resort", label: "Resort" },
];

const defaultForm: Partial<Accommodation> = {
  name: "", type: "Hotel", location: "Bali", pricePerNight: 0,
  facilities: [], description: "", image: "", status: "Active",
};

export default function AccommodationsPage() {
  const [items, setItems] = useState<Accommodation[]>(dummyAccommodations);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Accommodation | null>(null);
  const [form, setForm] = useState<Partial<Accommodation>>(defaultForm);
  const [facilitiesText, setFacilitiesText] = useState("");

  const filtered = items.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.location.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(defaultForm); setFacilitiesText(""); setModalOpen(true); };
  const openEdit = (a: Accommodation) => { setEditing(a); setForm({ ...a }); setFacilitiesText(a.facilities.join(", ")); setModalOpen(true); };

  const handleSave = () => {
    const acc: Accommodation = {
      id: editing?.id || generateId(),
      name: form.name || "",
      type: form.type as Accommodation["type"] || "Hotel",
      location: form.location || "",
      pricePerNight: form.pricePerNight || 0,
      facilities: facilitiesText.split(",").map((f) => f.trim()).filter(Boolean),
      description: form.description || "",
      image: form.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
      status: form.status || "Active",
    };
    if (editing) setItems((prev) => prev.map((a) => (a.id === editing.id ? acc : a)));
    else setItems((prev) => [...prev, acc]);
    setModalOpen(false);
  };

  const typeBadgeColors: Record<string, string> = {
    Hotel: "bg-blue-50 text-blue-700 border-blue-200",
    Villa: "bg-purple-50 text-purple-700 border-purple-200",
    "Guest House": "bg-teal-50 text-teal-700 border-teal-200",
    Resort: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Akomodasi</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{filtered.length} akomodasi tersedia</p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={openCreate}>Tambah Akomodasi</Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Cari akomodasi..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
        {filtered.map((acc) => (
          <div key={acc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex">
            <div className="relative w-36 flex-shrink-0">
              <Image src={acc.image} alt={acc.name} fill className="object-cover" sizes="144px" />
            </div>
            <div className="p-4 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[14px] font-semibold text-slate-800 leading-tight">{acc.name}</h3>
                <StatusBadge status={acc.status} />
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${typeBadgeColors[acc.type]}`}>{acc.type}</span>
                <span className="flex items-center gap-1 text-[12px] text-slate-400"><MapPin size={11} /> {acc.location}</span>
              </div>
              <p className="text-[12px] text-slate-500 line-clamp-2">{acc.description}</p>
              <div className="flex flex-wrap gap-1">
                {acc.facilities.slice(0, 3).map((f) => <span key={f} className="text-[10.5px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{f}</span>)}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div>
                  <p className="text-[13px] font-bold text-blue-600">{formatRupiah(acc.pricePerNight)}</p>
                  <p className="text-[10.5px] text-slate-400">per malam</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => openEdit(acc)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteId(acc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Akomodasi" : "Tambah Akomodasi"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Input label="Nama Akomodasi" placeholder="Nama hotel/villa/resort" value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} id="acc-name" /></div>
          <Select label="Tipe" id="acc-type" options={typeOptions} value={form.type || "Hotel"} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Accommodation["type"] }))} />
          <Select label="Lokasi" id="acc-location" options={locationOptions} value={form.location || "Bali"} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          <Input label="Harga per Malam (Rp)" type="number" value={form.pricePerNight || ""} onChange={(e) => setForm((p) => ({ ...p, pricePerNight: Number(e.target.value) }))} id="acc-price" />
          <Select label="Status" id="acc-status" options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} value={form.status || "Active"} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))} />
          <div className="sm:col-span-2"><Textarea label="Deskripsi" rows={3} value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} id="acc-desc" /></div>
          <div className="sm:col-span-2"><Input label="Fasilitas (pisahkan dengan koma)" placeholder="AC, WiFi, Kolam Renang" value={facilitiesText} onChange={(e) => setFacilitiesText(e.target.value)} id="acc-facilities" /></div>
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Upload Gambar</label>
            <div className="flex items-center gap-4">
              {form.image && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                  <Image src={form.image} alt="Preview" fill className="object-cover" sizes="64px" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id="acc-image-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm((p) => ({ ...p, image: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-[13px] text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[12.5px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Pilih file gambar dari komputer Anda (.jpg, .png)</p>
          </div>
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <Button className="flex-1" onClick={handleSave}>Simpan</Button>
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Akomodasi" size="sm">
        <p className="text-[13.5px] text-slate-600 mb-5">Yakin ingin menghapus akomodasi ini?</p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={() => { setItems((p) => p.filter((a) => a.id !== deleteId)); setDeleteId(null); }}>Hapus</Button>
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
