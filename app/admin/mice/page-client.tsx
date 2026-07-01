"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, MapPin, Users, X as XIcon } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea, CurrencyInput } from "@/components/admin/FormFields";
import { formatRupiah, Mice } from "@/lib/admin-data";
import Image from "next/image";
import { saveMice, deleteMice } from "../actions";
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
                src={(mice.imageUrl ? mice.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600"}
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
