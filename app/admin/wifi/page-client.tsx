"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, Wifi as WifiIcon, MapPin, X as XIcon } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea, CurrencyInput } from "@/components/admin/FormFields";
import { formatRupiah, Wifi } from "@/lib/admin-data";
import Image from "next/image";
import { saveWifi, deleteWifi } from "../actions";
import { uploadImage } from "../upload-action";

function compressImage(base64Str: string, maxWidth = 1200, maxHeight = 1200, quality = 0.75): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", quality);
      resolve(compressed);
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}

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
                src={(wifi.imageUrl ? wifi.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600"}
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
            <label className="block text-[13px] font-medium text-slate-700 mb-2">
              Upload Gambar (Maksimal 5)
            </label>
            
            {/* Image Preview & Upload Grid */}
            <div className="flex flex-wrap gap-3 mb-3 items-center">
              {(form.imageUrl ? form.imageUrl.split(',').map(u => u.trim()).filter(Boolean) : []).map((url, index) => (
                <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group flex-shrink-0">
                  <Image src={url} alt={`Preview ${index + 1}`} fill className="object-cover" sizes="80px" />
                  <button
                    type="button"
                    onClick={() => {
                      const current = form.imageUrl ? form.imageUrl.split(',').map(u => u.trim()).filter(Boolean) : [];
                      const updated = current.filter((_, idx) => idx !== index);
                      setForm((p) => ({ ...p, imageUrl: updated.join(',') }));
                    }}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-md transition-colors flex items-center justify-center cursor-pointer z-10"
                  >
                    <XIcon size={12} className="stroke-[3]" />
                  </button>
                </div>
              ))}

              {/* Styled Upload Card as "+" Button */}
              {!(form.imageUrl ? form.imageUrl.split(',').map(u => u.trim()).filter(Boolean).length >= 5 : false) && (
                <label className="flex flex-col items-center justify-center w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-colors cursor-pointer relative flex-shrink-0">
                  <PlusCircle size={20} className="text-slate-400" />
                  <span className="text-[10px] text-slate-400 mt-1 font-semibold">Tambah</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (files && files.length > 0) {
                        const current = form.imageUrl ? form.imageUrl.split(',').map(u => u.trim()).filter(Boolean) : [];
                        const remainingSlots = 5 - current.length;
                        
                        if (files.length > remainingSlots) {
                          alert(`Maksimal 5 gambar diperbolehkan. Anda hanya bisa memilih ${remainingSlots} gambar lagi.`);
                          e.target.value = ""; // reset input
                          return;
                        }

                        setUploading(true);
                        const uploadedUrls: string[] = [];
                        for (let i = 0; i < files.length; i++) {
                          const file = files[i];
                          try {
                            const base64 = await new Promise<string>((resolve, reject) => {
                              const reader = new FileReader();
                              reader.onloadend = () => resolve(reader.result as string);
                              reader.onerror = reject;
                              reader.readAsDataURL(file);
                            });
                            
                            // Compress client-side
                            const compressedBase64 = await compressImage(base64);
                            
                            const res = await uploadImage(compressedBase64);
                            if (res.success && res.url) {
                              uploadedUrls.push(res.url);
                            } else {
                              alert(res.error || `Gagal upload gambar: ${file.name}`);
                            }
                          } catch (err) {
                            alert(`Gagal membaca/mengompresi file: ${file.name}`);
                          }
                        }
                        if (uploadedUrls.length > 0) {
                          setForm((p: any) => ({ ...p, imageUrl: [...current, ...uploadedUrls].join(',') }));
                        }
                        setUploading(false);
                        e.target.value = ""; // reset input
                      }
                    }}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            {uploading && <p className="text-[11px] text-blue-600 mt-1 animate-pulse">Mengunggah ke Cloudinary...</p>}
            <p className="text-[11px] text-slate-400 mt-1">
              Klik kotak "+" di atas untuk mengunggah gambar (.jpg, .png). Maksimal 5 gambar terpilih ({form.imageUrl ? form.imageUrl.split(',').map(u => u.trim()).filter(Boolean).length : 0}/5).
            </p>
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
