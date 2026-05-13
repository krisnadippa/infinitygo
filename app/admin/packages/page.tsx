"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, MapPin, Clock } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea } from "@/components/admin/FormFields";
import { dummyTourPackages, TourPackage, formatRupiah } from "@/lib/admin-data";
import Image from "next/image";

function generateId() { return Math.random().toString(36).slice(2, 9); }

const defaultForm: Partial<TourPackage> = {
  name: "", location: "", duration: "", price: 0,
  description: "", facilities: [], image: "", status: "Active",
};

export default function PackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>(dummyTourPackages);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<TourPackage | null>(null);
  const [form, setForm] = useState<Partial<TourPackage>>(defaultForm);
  const [facilitiesText, setFacilitiesText] = useState("");

  const filtered = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setFacilitiesText("");
    setModalOpen(true);
  };

  const openEdit = (pkg: TourPackage) => {
    setEditing(pkg);
    setForm({ ...pkg });
    setFacilitiesText(pkg.facilities.join(", "));
    setModalOpen(true);
  };

  const handleSave = () => {
    const pkg: TourPackage = {
      id: editing?.id || generateId(),
      name: form.name || "",
      location: form.location || "",
      duration: form.duration || "",
      price: form.price || 0,
      description: form.description || "",
      facilities: facilitiesText.split(",").map((f) => f.trim()).filter(Boolean),
      image: form.image || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
      status: form.status || "Active",
    };
    if (editing) {
      setPackages((prev) => prev.map((p) => (p.id === editing.id ? pkg : p)));
    } else {
      setPackages((prev) => [...prev, pkg]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setPackages((prev) => prev.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Paket Tour</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{filtered.length} paket tersedia</p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={openCreate}>Tambah Paket</Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari paket tour..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-44">
              <Image
                src={pkg.image}
                alt={pkg.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
              <div className="absolute top-3 right-3">
                <StatusBadge status={pkg.status} />
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              <h3 className="text-[14px] font-semibold text-slate-800 leading-tight">{pkg.name}</h3>
              <div className="flex items-center gap-3 text-[12px] text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={12} /> {pkg.location}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {pkg.duration}</span>
              </div>
              <p className="text-[12.5px] text-slate-500 line-clamp-2">{pkg.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {pkg.facilities.slice(0, 3).map((f) => (
                  <span key={f} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{f}</span>
                ))}
                {pkg.facilities.length > 3 && (
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    +{pkg.facilities.length - 3} lainnya
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <p className="text-[15px] font-bold text-blue-600">{formatRupiah(pkg.price)}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEdit(pkg)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(pkg.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Paket Tour" : "Tambah Paket Tour"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Nama Paket" placeholder="Nama paket tour" value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} id="pkg-name" />
          </div>
          <Input label="Lokasi" placeholder="Contoh: Ubud, Gianyar" value={form.location || ""} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} id="pkg-location" />
          <Input label="Durasi" placeholder="Contoh: 3 Hari 2 Malam" value={form.duration || ""} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} id="pkg-duration" />
          <Input label="Harga (Rp)" type="number" value={form.price || ""} onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))} id="pkg-price" />
          <Select
            label="Status"
            id="pkg-status"
            options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]}
            value={form.status || "Active"}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))}
          />
          <div className="sm:col-span-2">
            <Textarea label="Deskripsi" placeholder="Deskripsi paket tour..." rows={3} value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} id="pkg-desc" />
          </div>
          <div className="sm:col-span-2">
            <Input label="Fasilitas (pisahkan dengan koma)" placeholder="Guide lokal, Transport AC, Sarapan" value={facilitiesText} onChange={(e) => setFacilitiesText(e.target.value)} id="pkg-facilities" />
          </div>
          <div className="sm:col-span-2">
            <Input label="URL Gambar" placeholder="https://..." value={form.image || ""} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} id="pkg-image" />
          </div>
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <Button className="flex-1" onClick={handleSave}>Simpan</Button>
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Paket Tour" size="sm">
        <p className="text-[13.5px] text-slate-600 mb-5">Yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={() => handleDelete(deleteId!)}>Hapus</Button>
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
