"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, MapPin, Users } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea, CurrencyInput } from "@/components/admin/FormFields";
import { formatRupiah, Mice } from "@/lib/admin-data";
import Image from "next/image";
import { saveMice, deleteMice } from "../actions";
import { uploadImage } from "../upload-action";

const locationOptions = [
  { value: "Bali", label: "Bali" },
  { value: "Jakarta", label: "Jakarta" },
  { value: "Labuan Bajo", label: "Labuan Bajo" },
  { value: "Yogyakarta", label: "Yogyakarta" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "China", label: "China" },
  { value: "Vietnam", label: "Vietnam" },
  { value: "Thailand", label: "Thailand" },
  { value: "Malang", label: "Malang" },
];

const defaultForm: Partial<Mice> = {
  name: "", location: "Bali", capacity: 50, price: 0, discount: 0,
  facilities: [], description: "", imageUrl: "", status: "Active",
};

export default function MiceClient({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState<any[]>(initialData);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Mice | null>(null);
  const [form, setForm] = useState<Partial<Mice>>(defaultForm);
  const [facilitiesText, setFacilitiesText] = useState("");
  const [uploading, setUploading] = useState(false);

  const filtered = items.filter((p) => {
    return p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
  });

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setFacilitiesText("");
    setModalOpen(true);
  };

  const openEdit = (mice: Mice) => {
    setEditing(mice);
    setForm({ ...mice });
    setFacilitiesText(mice.facilities.join(", "));
    setModalOpen(true);
  };

  const handleSave = async () => {
    const mice = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name || "",
      location: form.location || "Bali",
      capacity: form.capacity || 50,
      price: form.price || 0,
      discount: form.discount || 0,
      description: form.description || "",
      facilities: facilitiesText.split(",").map((f) => f.trim()).filter(Boolean),
      imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600",
      status: form.status || "Active",
    };
    
    const tempId = editing?.id || Math.random().toString();
    if (editing) setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...mice } : p)));
    else setItems((prev) => [{ ...mice, id: tempId }, ...prev]);
    
    setModalOpen(false);
    
    try {
      await saveMice(mice);
    } catch (error: any) {
      alert(error.message || "Gagal menyimpan data");
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const idToDelete = deleteId;
    setItems((p) => p.filter((mice) => mice.id !== idToDelete));
    setDeleteId(null);
    await deleteMice(idToDelete);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Layanan MICE</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{filtered.length} layanan tersedia</p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={openCreate}>Tambah MICE</Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari layanan MICE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((mice) => (
          <div key={mice.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-44">
              <Image
                src={mice.imageUrl || "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600"}
                alt={mice.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute top-3 right-3">
                <StatusBadge status={mice.status} />
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              <h3 className="text-[14px] font-semibold text-slate-800 leading-tight">{mice.name}</h3>
              <div className="flex items-center gap-3 text-[12px] text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={12} /> {mice.location}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {mice.capacity} Pax</span>
              </div>
              <p className="text-[12.5px] text-slate-500 line-clamp-2">{mice.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {mice.facilities.slice(0, 3).map((f: string) => (
                  <span key={f} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{f}</span>
                ))}
                {mice.facilities.length > 3 && (
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    +{mice.facilities.length - 3} lainnya
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="flex flex-col">
                {(mice.discount || 0) > 0 && (
                  <span className="text-[12px] text-slate-400 line-through">
                    {formatRupiah(mice.price)}
                  </span>
                )}
                <p className="text-[15px] font-bold text-blue-600 flex items-center gap-1.5">
                  {formatRupiah(mice.price - (mice.price * (mice.discount || 0) / 100))}
                  {(mice.discount || 0) > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                      Hemat {mice.discount}%
                    </span>
                  )}
                </p>
              </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(mice)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(mice.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit MICE" : "Tambah MICE"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Nama Layanan" placeholder="Nama MICE..." value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} id="mice-name" />
          </div>
          <Select label="Lokasi" id="mice-location" options={locationOptions} value={form.location || "Bali"} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          <Input label="Kapasitas (Pax)" type="number" min="1" value={form.capacity || ""} onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))} id="mice-capacity" />
          <CurrencyInput label="Harga (Rp)" value={form.price || 0} onChange={(val) => setForm((p) => ({ ...p, price: val }))} id="mice-price" />
          <div className="flex flex-col gap-1">
            <Input label="Diskon (%) opsional" type="number" min="0" max="100" value={form.discount || ""} onChange={(e) => setForm((p) => ({ ...p, discount: Number(e.target.value) }))} id="mice-discount" />
          </div>
          <Select
            label="Status"
            id="mice-status"
            options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]}
            value={form.status || "Active"}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))}
          />
          <div className="sm:col-span-2">
            <Textarea label="Deskripsi" placeholder="Deskripsi layanan..." rows={3} value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} id="mice-desc" />
          </div>
          <div className="sm:col-span-2">
            <Input label="Fasilitas (pisahkan dengan koma)" placeholder="Projector, Sound System, dll" value={facilitiesText} onChange={(e) => setFacilitiesText(e.target.value)} id="mice-facilities" />
          </div>
          <div className="sm:col-span-2">
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
                id="mice-image-upload"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setUploading(true);
                    const reader = new FileReader();
                    reader.onloadend = async () => {
                      const base64 = reader.result as string;
                      const res = await uploadImage(base64);
                      if (res.success && res.url) {
                        setForm((p) => ({ ...p, imageUrl: res.url }));
                      } else {
                        alert(res.error || "Gagal upload gambar");
                      }
                      setUploading(false);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-[13px] text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[12.5px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer disabled:opacity-50"
              />
            </div>
            {uploading && <p className="text-[11px] text-blue-600 mt-1 animate-pulse">Mengunggah ke Cloudinary...</p>}
          </div>
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <Button className="flex-1" onClick={handleSave}>Simpan</Button>
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Layanan" size="sm">
        <p className="text-[13.5px] text-slate-600 mb-5">Yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Hapus</Button>
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
