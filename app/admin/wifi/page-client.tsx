"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, Wifi as WifiIcon, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea, CurrencyInput } from "@/components/admin/FormFields";
import { formatRupiah, Wifi } from "@/lib/admin-data";
import Image from "next/image";
import { saveWifi, deleteWifi } from "../actions";
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

const defaultForm: Partial<Wifi> = {
  name: "", type: "Portable", locations: ["Bali"], price: 0, discount: 0,
  features: [], description: "", imageUrl: "", status: "Active",
};

export default function WifiClient({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState<any[]>(initialData);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Wifi | null>(null);
  const [form, setForm] = useState<Partial<Wifi>>(defaultForm);
  const [featuresText, setFeaturesText] = useState("");
  const [uploading, setUploading] = useState(false);

  const filtered = items.filter((p) => {
    return p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.type.toLowerCase().includes(search.toLowerCase()) ||
      (p.locations || []).some((loc: string) => loc.toLowerCase().includes(search.toLowerCase()));
  });

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setFeaturesText("");
    setModalOpen(true);
  };

  const openEdit = (wifi: Wifi) => {
    setEditing(wifi);
    setForm({ ...wifi });
    setFeaturesText(wifi.features.join(", "));
    setModalOpen(true);
  };

  const handleSave = async () => {
    const wifi = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name || "",
      type: form.type || "Portable",
      locations: form.locations || ["Bali"],
      price: form.price || 0,
      discount: form.discount || 0,
      description: form.description || "",
      features: featuresText.split(",").map((f) => f.trim()).filter(Boolean),
      imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600",
      status: form.status || "Active",
    };
    
    const tempId = editing?.id || Math.random().toString();
    if (editing) setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...wifi } : p)));
    else setItems((prev) => [{ ...wifi, id: tempId }, ...prev]);
    
    setModalOpen(false);
    
    try {
      await saveWifi(wifi);
    } catch (error: any) {
      alert(error.message || "Gagal menyimpan data");
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const idToDelete = deleteId;
    setItems((p) => p.filter((wifi) => wifi.id !== idToDelete));
    setDeleteId(null);
    await deleteWifi(idToDelete);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Layanan Wifi</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{filtered.length} layanan tersedia</p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={openCreate}>Tambah Wifi</Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari layanan wifi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((wifi) => (
          <div key={wifi.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-44">
              <Image
                src={wifi.imageUrl || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600"}
                alt={wifi.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute top-3 right-3">
                <StatusBadge status={wifi.status} />
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              <h3 className="text-[14px] font-semibold text-slate-800 leading-tight">{wifi.name}</h3>
              <div className="flex items-center gap-3 text-[12px] text-slate-500">
                <span className="flex items-center gap-1"><WifiIcon size={12} /> {wifi.type}</span>
                <span className="flex items-center gap-1"><MapPin size={12} /> {(wifi.locations || []).join(", ") || "Bali"}</span>
              </div>
              <p className="text-[12.5px] text-slate-500 line-clamp-2">{wifi.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {wifi.features.slice(0, 3).map((f: string) => (
                  <span key={f} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{f}</span>
                ))}
                {wifi.features.length > 3 && (
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    +{wifi.features.length - 3} lainnya
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="flex flex-col">
                {(wifi.discount || 0) > 0 && (
                  <span className="text-[12px] text-slate-400 line-through">
                    {formatRupiah(wifi.price)}
                  </span>
                )}
                <p className="text-[15px] font-bold text-blue-600 flex items-center gap-1.5">
                  {formatRupiah(wifi.price - (wifi.price * (wifi.discount || 0) / 100))}
                  {(wifi.discount || 0) > 0 && (
                    <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                      Hemat {wifi.discount}%
                    </span>
                  )}
                </p>
              </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(wifi)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(wifi.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Wifi" : "Tambah Wifi"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Nama Layanan" placeholder="Nama wifi..." value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} id="wifi-name" />
          </div>
          <Input label="Tipe" placeholder="Portable, Router, dll" value={form.type || ""} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))} id="wifi-type" />
          <CurrencyInput label="Harga (Rp)" value={form.price || 0} onChange={(val) => setForm((p) => ({ ...p, price: val }))} id="wifi-price" />
          <div className="flex flex-col gap-1">
            <Input label="Diskon (%) opsional" type="number" min="0" max="100" value={form.discount || ""} onChange={(e) => setForm((p) => ({ ...p, discount: Number(e.target.value) }))} id="wifi-discount" />
          </div>
          <Select
            label="Status"
            id="wifi-status"
            options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]}
            value={form.status || "Active"}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))}
          />
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Lokasi (Bisa pilih lebih dari satu)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg max-h-40 overflow-y-auto">
              {locationOptions.map(opt => {
                const checked = (form.locations || []).includes(opt.value);
                return (
                  <label key={opt.value} className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer hover:text-slate-900">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const current = form.locations || [];
                        const updated = e.target.checked
                          ? [...current, opt.value]
                          : current.filter(val => val !== opt.value);
                        setForm(prev => ({ ...prev, locations: updated }));
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500/20"
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </div>
          <div className="sm:col-span-2">
            <Textarea label="Deskripsi" placeholder="Deskripsi layanan..." rows={3} value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} id="wifi-desc" />
          </div>
          <div className="sm:col-span-2">
            <Input label="Fitur (pisahkan dengan koma)" placeholder="Unlimited Kuota, Baterai 12 jam" value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} id="wifi-features" />
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
                id="wifi-image-upload"
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
