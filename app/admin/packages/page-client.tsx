"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, MapPin, Clock, X as XIcon } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea, CurrencyInput } from "@/components/admin/FormFields";
import { TourPackage, formatRupiah } from "@/lib/admin-data";
import Image from "next/image";
import { saveTourPackage, deleteTourPackage } from "../actions";
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

const defaultForm: Partial<TourPackage> = {
  name: "", location: "Bali", duration: "", price: 0, priceSharing: 0, priceRules: "[]", discount: 0,
  facilities: [], description: "", imageUrl: "", status: "Active",
};

export default function PackagesClient({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState<any[]>(initialData);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<TourPackage | null>(null);
  const [form, setForm] = useState<Partial<TourPackage>>(defaultForm);
  const [facilitiesText, setFacilitiesText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newRuleMin, setNewRuleMin] = useState<number | "">("");
  const [newRulePrice, setNewRulePrice] = useState<number>(0);

  const filtered = items.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase());
    const matchLocation = filterLocation === "All" || p.location === filterLocation;
    return matchSearch && matchLocation;
  });

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

  const handleSave = async () => {
    const pkg = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name || "",
      location: form.location || "Bali",
      duration: form.duration || "",
      price: form.price || 0,
      priceSharing: 0,
      priceRules: form.priceRules || "[]",
      discount: form.discount || 0,
      description: form.description || "",
      facilities: facilitiesText.split(",").map((f) => f.trim()).filter(Boolean),
      imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600",
      status: form.status || "Active",
    };
    
    // Optimistic UI update
    const tempId = editing?.id || Math.random().toString();
    if (editing) setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...pkg } : p)));
    else setItems((prev) => [{ ...pkg, id: tempId }, ...prev]);
    
    setModalOpen(false);
    
    // Server Action
    try {
      await saveTourPackage(pkg);
      alert("Paket tour berhasil disimpan!");
    } catch (error: any) {
      alert(error.message || "Gagal menyimpan data");
      // Revert optimistic update if needed or refresh
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const idToDelete = deleteId;
    setItems((p) => p.filter((pkg) => pkg.id !== idToDelete));
    setDeleteId(null);
    try {
      await deleteTourPackage(idToDelete);
      alert("Paket tour berhasil dihapus!");
    } catch (e: any) {
      alert("Gagal menghapus paket tour");
      window.location.reload();
    }
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

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari paket tour..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-44">
              <Image
                src={(pkg.imageUrl ? pkg.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600"}
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
                {pkg.facilities.slice(0, 3).map((f: string) => (
                  <span key={f} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{f}</span>
                ))}
                {pkg.facilities.length > 3 && (
                  <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    +{pkg.facilities.length - 3} lainnya
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <div className="flex flex-col">
                <div className="text-[12.5px] text-slate-500 font-medium">
                  <span>Harga Mulai: </span>
                  <span className={pkg.discount ? "line-through text-slate-400 mr-1" : "font-semibold text-blue-600"}>
                    {formatRupiah(pkg.price)}
                  </span>
                  {!!pkg.discount && (
                    <span className="font-semibold text-blue-600">
                      {formatRupiah(pkg.price - (pkg.price * pkg.discount / 100))}
                    </span>
                  )}
                </div>
                {(() => {
                  let rulesList: any[] = [];
                  try {
                    rulesList = typeof pkg.priceRules === 'string' ? JSON.parse(pkg.priceRules) : (pkg.priceRules || []);
                  } catch(e) {}
                  if (rulesList.length > 0) {
                    return (
                      <div className="mt-1 pt-1 border-t border-slate-100 space-y-0.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Tingkatan Harga:</p>
                        {rulesList.map((r: any, idx: number) => (
                          <div key={idx} className="text-[11.5px] text-slate-500 flex justify-between">
                            <span>&ge; {r.minParticipants} Orang:</span>
                            <span className="font-semibold text-blue-600">
                              {pkg.discount 
                                ? formatRupiah(r.price - (r.price * pkg.discount / 100))
                                : formatRupiah(r.price)} / pax
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
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
          <Select label="Lokasi" id="pkg-location" options={locationOptions} value={form.location || "Bali"} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          <Input label="Durasi" placeholder="Contoh: 3 Hari 2 Malam" value={form.duration || ""} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} id="pkg-duration" />
          <CurrencyInput label="Harga Standar / 1 Orang (Rp)" value={form.price || 0} onChange={(val) => setForm((p) => ({ ...p, price: val }))} id="pkg-price" />
          
          <div className="flex flex-col gap-1">
            <Input label="Diskon (%) opsional" type="number" min="0" max="100" value={form.discount || ""} onChange={(e) => setForm((p) => ({ ...p, discount: Number(e.target.value) }))} id="pkg-discount" />
            {!!form.discount && (
              <div className="text-[12px] text-emerald-600 font-medium space-y-0.5">
                {!!form.price && <p>Harga Standar setelah diskon: {formatRupiah(form.price - (form.price * form.discount / 100))}</p>}
              </div>
            )}
          </div>

          {/* Tier-Based Pricing Rules */}
          <div className="sm:col-span-2 border-t border-slate-100 pt-4 mt-2">
            <h4 className="font-bold text-slate-800 text-[13px] uppercase tracking-wider mb-1">Tarif Group & Rombongan (Opsional)</h4>
            <p className="text-[12px] text-slate-500 mb-3">Atur harga per orang yang lebih hemat berdasarkan jumlah peserta (misal: jika &ge; 2 orang atau &ge; 10 orang).</p>
            
            {(() => {
              let rulesList: { minParticipants: number; price: number }[] = [];
              try {
                rulesList = typeof form.priceRules === 'string' ? JSON.parse(form.priceRules) : (form.priceRules || []);
              } catch(e) {}
              
              return (
                <div className="space-y-2 mb-3">
                  {rulesList.map((rule, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                      <div className="text-[13px] font-semibold text-slate-750">
                        Min. {rule.minParticipants} Peserta
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-[13px] font-bold text-blue-600">
                          {formatRupiah(rule.price)} / Orang
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = rulesList.filter((_, i) => i !== idx);
                            setForm(p => ({ ...p, priceRules: JSON.stringify(updated) }));
                          }}
                          className="text-red-500 hover:text-red-750 hover:bg-red-50 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {/* Add New Rule Form */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 items-end border-t border-dashed border-slate-200 mt-2">
                    <div className="flex-1">
                      <Input
                        label="Min. Peserta (Orang)"
                        type="number"
                        min="1"
                        placeholder="Contoh: 2"
                        value={newRuleMin}
                        onChange={(e) => setNewRuleMin(e.target.value === "" ? "" : Number(e.target.value))}
                        id="new-rule-min"
                      />
                    </div>
                    <div className="flex-1">
                      <CurrencyInput
                        label="Harga per Orang (Rp)"
                        value={newRulePrice}
                        onChange={(val) => setNewRulePrice(val)}
                        id="new-rule-price"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="px-4 py-2 text-xs font-bold"
                      onClick={() => {
                        const minVal = Number(newRuleMin);
                        const priceVal = newRulePrice;
                        
                        if (!minVal || minVal < 1 || priceVal < 0) {
                          alert("Harap isi jumlah peserta dan harga dengan benar.");
                          return;
                        }
                        
                        const updated = [...rulesList];
                        const existingIdx = updated.findIndex(r => r.minParticipants === minVal);
                        if (existingIdx > -1) {
                          updated[existingIdx] = { minParticipants: minVal, price: priceVal };
                        } else {
                          updated.push({ minParticipants: minVal, price: priceVal });
                        }
                        updated.sort((a, b) => a.minParticipants - b.minParticipants);
                        
                        setForm(p => ({ ...p, priceRules: JSON.stringify(updated) }));
                        
                        setNewRuleMin("");
                        setNewRulePrice(0);
                      }}
                    >
                      Tambah Aturan
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
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
                          setForm((p) => ({ ...p, imageUrl: [...current, ...uploadedUrls].join(',') }));
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

      {/* Delete confirm */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Paket Tour" size="sm">
        <p className="text-[13.5px] text-slate-600 mb-5">Yakin ingin menghapus paket ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Hapus</Button>
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
