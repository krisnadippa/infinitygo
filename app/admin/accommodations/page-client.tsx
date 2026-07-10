"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, MapPin, X as XIcon } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea, CurrencyInput } from "@/components/admin/FormFields";
import { formatRupiah, Accommodation } from "@/lib/admin-data";
import Image from "next/image";
import { saveAccommodation, deleteAccommodation } from "../actions";
import { uploadImage } from "../upload-action";

function generateId() { return Math.random().toString(36).slice(2, 9); }

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

const typeOptions = [
  { value: "Hotel", label: "Hotel" },
  { value: "Villa", label: "Villa" },
  { value: "Guest House", label: "Guest House" },
  { value: "Resort", label: "Resort" },
];

const defaultForm: Partial<Accommodation> = {
  name: "", type: "Hotel", location: "Bali", pricePerNight: 0, discount: 0,
  facilities: [], description: "", imageUrl: "", status: "Active",
};

export default function AccommodationsClient({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState<any[]>(initialData);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Accommodation | null>(null);
  const [form, setForm] = useState<Partial<Accommodation>>(defaultForm);
  const [uploading, setUploading] = useState(false);
  const [facilitiesText, setFacilitiesText] = useState("");

  const filtered = items.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase());
    const matchLocation = filterLocation === "All" || a.location === filterLocation;
    return matchSearch && matchLocation;
  });

  const openCreate = () => { setEditing(null); setForm(defaultForm); setFacilitiesText(""); setModalOpen(true); };
  const openEdit = (a: Accommodation) => { setEditing(a); setForm({ ...a }); setFacilitiesText(a.facilities.join(", ")); setModalOpen(true); };

  const handleSave = async () => {
    const acc = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name || "",
      type: form.type as Accommodation["type"] || "Hotel",
      location: form.location || "Bali",
      pricePerNight: form.pricePerNight || 0,
      discount: form.discount || 0,
      facilities: facilitiesText.split(",").map((f) => f.trim()).filter(Boolean),
      description: form.description || "",
      imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
      status: form.status || "Active",
    };
    
    // Optimistic UI update
    const tempId = editing?.id || Math.random().toString();
    if (editing) setItems((prev) => prev.map((a) => (a.id === editing.id ? { ...a, ...acc } : a)));
    else setItems((prev) => [{ ...acc, id: tempId }, ...prev]);
    
    setModalOpen(false);
    
    // Server Action
    try {
      await saveAccommodation(acc as Accommodation);
      alert("Data akomodasi berhasil disimpan!");
    } catch (e: any) {
      alert(e.message || "Gagal menyimpan data akomodasi");
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const idToDelete = deleteId;
    setItems((p) => p.filter((acc) => acc.id !== idToDelete));
    setDeleteId(null);
    try {
      await deleteAccommodation(idToDelete);
      alert("Data akomodasi berhasil dihapus!");
    } catch (e: any) {
      alert("Gagal menghapus data akomodasi");
      window.location.reload();
    }
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Cari akomodasi..." value={search} onChange={(e) => setSearch(e.target.value)}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
        {filtered.map((acc) => (
          <div key={acc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex">
            <div className="relative w-36 flex-shrink-0">
              <Image src={(acc.imageUrl ? acc.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600"} alt={acc.name} fill className="object-cover" sizes="144px" />
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
                {acc.facilities.slice(0, 3).map((f: string) => <span key={f} className="text-[10.5px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{f}</span>)}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex flex-col">
                  {(acc.discount || 0) > 0 && (
                    <span className="text-[12px] text-slate-400 line-through">
                      {formatRupiah(acc.pricePerNight)}
                    </span>
                  )}
                  <p className="text-[13px] font-bold text-blue-600 flex items-center gap-1.5">
                    {formatRupiah(acc.pricePerNight - (acc.pricePerNight * (acc.discount || 0) / 100))}
                    {(acc.discount || 0) > 0 && (
                      <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                        Hemat {acc.discount}%
                      </span>
                    )}
                  </p>
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
          <CurrencyInput label="Harga per Malam (Rp)" value={form.pricePerNight || 0} onChange={(val) => setForm((p) => ({ ...p, pricePerNight: val }))} id="acc-price" />
          <div className="flex flex-col gap-1">
            <Input label="Diskon (%) opsional" type="number" min="0" max="100" value={form.discount || ""} onChange={(e) => setForm((p) => ({ ...p, discount: Number(e.target.value) }))} id="acc-discount" />
            {!!form.discount && !!form.pricePerNight && (
              <p className="text-[12px] text-emerald-600 font-medium">
                Harga setelah diskon: {formatRupiah(form.pricePerNight - (form.pricePerNight * form.discount / 100))}
              </p>
            )}
          </div>
          <Select label="Status" id="acc-status" options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} value={form.status || "Active"} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))} />
          <div className="sm:col-span-2"><Textarea label="Deskripsi" rows={3} value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} id="acc-desc" /></div>
          <div className="sm:col-span-2"><Input label="Fasilitas (pisahkan dengan koma)" placeholder="AC, WiFi, Kolam Renang" value={facilitiesText} onChange={(e) => setFacilitiesText(e.target.value)} id="acc-facilities" /></div>
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
                      setForm((p: any) => ({ ...p, imageUrl: updated.join(',') }));
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
            {uploading && <p className="text-[11px] text-blue-600 mt-1 animate-pulse">Mengunggah...</p>}
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

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Akomodasi" size="sm">
        <p className="text-[13.5px] text-slate-600 mb-5">Yakin ingin menghapus akomodasi ini?</p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Hapus</Button>
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
