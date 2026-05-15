"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select } from "@/components/admin/FormFields";
import { GalleryItem } from "@/lib/admin-data";
import Image from "next/image";
import { saveGalleryItem, deleteGalleryItem } from "../actions";
import { uploadImage } from "../upload-action";

function generateId() { return Math.random().toString(36).slice(2, 9); }

const locationOptions = [
  { value: "Bali", label: "Bali" },
  { value: "Jakarta", label: "Jakarta" },
  { value: "Labuan Bajo", label: "Labuan Bajo" },
  { value: "Yogyakarta", label: "Yogyakarta" },
];

const defaultForm: Partial<GalleryItem> = {
  title: "", location: "Bali", imageUrl: "", status: "Active",
};

export default function GalleryClient({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState<any[]>(initialData);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<Partial<GalleryItem>>(defaultForm);
  const [uploading, setUploading] = useState(false);

  const filtered = items.filter((g) => {
    const matchSearch = g.title.toLowerCase().includes(search.toLowerCase());
    const matchLocation = filterLocation === "All" || g.location === filterLocation;
    return matchSearch && matchLocation;
  });

  const openCreate = () => { setEditing(null); setForm(defaultForm); setModalOpen(true); };
  const openEdit = (g: GalleryItem) => { setEditing(g); setForm({ ...g }); setModalOpen(true); };

  const handleSave = async () => {
    const gal = {
      ...(editing ? { id: editing.id } : {}),
      title: form.title || "",
      location: form.location || "Bali",
      imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
      status: form.status || "Active",
    };
    
    const tempId = editing?.id || Math.random().toString();
    if (editing) setItems((prev) => prev.map((v) => (v.id === editing.id ? { ...v, ...gal } : v)));
    else setItems((prev) => [{ ...gal, id: tempId }, ...prev]);
    
    setModalOpen(false);
    await saveGalleryItem(gal as GalleryItem);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const idToDelete = deleteId;
    setItems((p) => p.filter((v) => v.id !== idToDelete));
    setDeleteId(null);
    await deleteGalleryItem(idToDelete);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Galeri</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{filtered.length} foto terdaftar</p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={openCreate}>Tambah Foto</Button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Cari foto..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
        </div>
        <select 
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="px-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 sm:w-48 bg-white"
        >
          <option value="All">Semua Lokasi</option>
          {locationOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map((gal) => (
          <div key={gal.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="relative h-48">
              <Image
                src={gal.imageUrl || "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600"}
                alt={gal.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
              <div className="absolute top-3 right-3">
                <StatusBadge status={gal.status} />
              </div>
            </div>
            <div className="p-4 space-y-2 flex flex-col flex-1">
              <h3 className="text-[14px] font-semibold text-slate-800 leading-tight">{gal.title}</h3>
              <div className="flex items-center gap-2 text-[12px] text-slate-500 flex-1">
                <MapPin size={12} /> {gal.location}
              </div>
              
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 mt-2">
                <button onClick={() => openEdit(gal)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => setDeleteId(gal.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Foto" : "Tambah Foto"} size="sm">
        <div className="space-y-4">
          <Input label="Judul/Caption" placeholder="Contoh: Pemandangan Ubud" value={form.title || ""} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} id="gal-title" />
          <Select label="Lokasi" id="gal-location" options={locationOptions} value={form.location || "Bali"} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          <Select label="Status" id="gal-status" options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} value={form.status || "Active"} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))} />
          
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Upload Gambar</label>
            <div className="flex items-center gap-4">
              {form.imageUrl && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                  <Image src={form.imageUrl} alt="Preview" fill className="object-cover" sizes="64px" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id="gal-image-upload"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploading(true);
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                      const res = await uploadImage(reader.result as string);
                      if (res.success && res.url) setForm((p) => ({ ...p, imageUrl: res.url }));
                      else alert(res.error || "Gagal upload gambar");
                      setUploading(false);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-[13px] text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[12.5px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50"
              />
            </div>
            {uploading && <p className="text-[11px] text-blue-600 mt-1 animate-pulse">Mengunggah...</p>}
            <p className="text-[11px] text-slate-400 mt-1">Pilih file gambar dari komputer Anda (.jpg, .png)</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button className="flex-1" onClick={handleSave}>Simpan</Button>
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Foto" size="sm">
        <p className="text-[13.5px] text-slate-600 mb-5">Yakin ingin menghapus foto ini dari galeri?</p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Hapus</Button>
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
