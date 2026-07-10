"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, Users, Check, X as XIcon, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea, CurrencyInput } from "@/components/admin/FormFields";
import { Vehicle, formatRupiah } from "@/lib/admin-data";
import Image from "next/image";
import { saveVehicle, deleteVehicle } from "../actions";
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

const typeOptions = [
  { value: "Car", label: "Car" },
  { value: "Mini Bus", label: "Mini Bus" },
  { value: "Bus", label: "Bus" },
  { value: "Motorcycle", label: "Motorcycle" },
];

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

const defaultForm: Partial<Vehicle & { vehicleType: string }> = {
  name: "", vehicleType: "Car", brand: "", locations: ["Bali"], capacity: 4, pricePerDay: 0, discount: 0,
  driverIncluded: false, description: "", imageUrl: "", status: "Active",
};

const typeColors: Record<string, string> = {
  Car: "bg-blue-50 text-blue-700 border-blue-200",
  "Mini Bus": "bg-purple-50 text-purple-700 border-purple-200",
  Bus: "bg-amber-50 text-amber-700 border-amber-200",
  Motorcycle: "bg-teal-50 text-teal-700 border-teal-200",
};

export default function VehiclesClient({ initialData }: { initialData: any[] }) {
  const [items, setItems] = useState<any[]>(initialData);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<Partial<Vehicle>>(defaultForm);
  const [facilitiesText, setFacilitiesText] = useState("");
  const [uploading, setUploading] = useState(false);

  const getDisplayPrice = (veh: any) => {
    let settings: any[] = [];
    try {
      settings = typeof veh.priceSettings === 'string' ? JSON.parse(veh.priceSettings) : (veh.priceSettings || []);
    } catch(e) {}
    
    if (settings.length > 0) {
      const discountedPrices = settings.flatMap((s: any) => {
        const disc = s.discount || 0;
        return [s.priceSelfDrive, s.priceWithDriver]
          .filter(p => p > 0)
          .map(p => p - (p * disc / 100));
      });
      if (discountedPrices.length > 0) {
        return Math.min(...discountedPrices);
      }
    }
    return (veh.pricePerDay || 0) - ((veh.pricePerDay || 0) * (veh.discount || 0) / 100);
  };

  const filtered = items.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.brand.toLowerCase().includes(search.toLowerCase());
    const matchLocation = filterLocation === "All" || (v.locations || []).includes(filterLocation);
    return matchSearch && matchLocation;
  });

  const openCreate = () => { setEditing(null); setForm(defaultForm); setFacilitiesText(""); setModalOpen(true); };
  const openEdit = (v: Vehicle) => { setEditing(v); setForm({ ...v }); setFacilitiesText((v.facilities || []).join(", ")); setModalOpen(true); };

  const handleSave = async () => {
    let settingsList: any[] = [];
    try {
      settingsList = typeof form.priceSettings === 'string' ? JSON.parse(form.priceSettings) : (form.priceSettings || []);
    } catch(e) {}
    
    let calculatedMinPrice = form.pricePerDay || 0;
    if (settingsList.length > 0) {
      const prices = settingsList.flatMap((s: any) => [s.priceSelfDrive, s.priceWithDriver].filter(p => p > 0));
      if (prices.length > 0) {
        calculatedMinPrice = Math.min(...prices);
      }
    }

    const isAnyActive = (form.locations || []).some(loc => {
      const setting = settingsList.find((s: any) => s.location === loc);
      return setting ? setting.isActive !== false : true;
    });
    const calculatedStatus = isAnyActive ? "Active" : "Inactive";

    const veh = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name || "",
      type: (form as any).vehicleType || (form as any).type || "Car",
      vehicleType: (form as any).vehicleType || (form as any).type || "Car",
      brand: form.brand || "",
      locations: form.locations || ["Bali"],
      capacity: form.capacity || 4,
      pricePerDay: calculatedMinPrice,
      discount: form.discount || 0,
      driverIncluded: form.driverIncluded || false,
      description: form.description || "",
      imageUrl: form.imageUrl || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600",
      status: calculatedStatus,
      priceSettings: form.priceSettings || null,
      facilities: facilitiesText.split(",").map((f) => f.trim()).filter(Boolean),
    };

    
    const tempId = editing?.id || Math.random().toString();
    if (editing) setItems((prev) => prev.map((v) => (v.id === editing.id ? { ...v, ...veh } : v)));
    else setItems((prev) => [{ ...veh, id: tempId }, ...prev]);
    
    setModalOpen(false);
    try {
      await saveVehicle(veh as Vehicle);
      alert("Data kendaraan berhasil disimpan!");
    } catch (e: any) {
      alert(e.message || "Gagal menyimpan data kendaraan");
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const idToDelete = deleteId;
    setItems((p) => p.filter((v) => v.id !== idToDelete));
    setDeleteId(null);
    try {
      await deleteVehicle(idToDelete);
      alert("Data kendaraan berhasil dihapus!");
    } catch (e: any) {
      alert("Gagal menghapus data kendaraan");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Kendaraan</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{filtered.length} kendaraan terdaftar</p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={openCreate}>Tambah Kendaraan</Button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Cari kendaraan..." value={search} onChange={(e) => setSearch(e.target.value)}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((veh) => (
          <div key={veh.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-44">
              <Image
                src={(veh.imageUrl ? veh.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600"}
                alt={veh.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
              <div className="absolute top-3 right-3">
                <StatusBadge status={veh.status} />
              </div>
            </div>
            <div className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[14px] font-semibold text-slate-800 leading-tight">{veh.name}</h3>
                  <p className="text-[11.5px] text-slate-500 mt-0.5 font-medium">{veh.brand}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-[12px] text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={12} /> {(veh.locations || []).join(", ") || "Bali"}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {veh.capacity} org</span>
              </div>
              
              <p className="text-[12.5px] text-slate-500 line-clamp-2">{veh.description}</p>
              
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className={`text-[10.5px] px-2 py-0.5 rounded-full border font-medium ${typeColors[veh.type]}`}>
                  {veh.type}
                </span>
                {veh.driverIncluded ? (
                  <span className="flex items-center gap-1 text-[10.5px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100">
                    <Check size={11} /> Plus Driver
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[10.5px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200">
                    <XIcon size={11} /> Lepas Kunci
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 mt-2">
                <div className="flex flex-col">
                  <p className="text-[15px] font-bold text-blue-600 flex items-center gap-1.5">
                    Mulai {formatRupiah(getDisplayPrice(veh))}
                  </p>
                  <p className="text-[10.5px] text-slate-400">per hari</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(veh)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => setDeleteId(veh.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Kendaraan" : "Tambah Kendaraan"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Input label="Nama Kendaraan" placeholder="Contoh: Toyota Innova Reborn" value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} id="veh-name" /></div>
          <Select label="Tipe Kendaraan" id="veh-type" options={typeOptions} value={(form as any).vehicleType || (form as any).type || "Car"} onChange={(e) => setForm((p) => ({ ...p, vehicleType: e.target.value }))} />
          <Input label="Brand" placeholder="Toyota, Honda, dll" value={form.brand || ""} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} id="veh-brand" />
          <Input label="Kapasitas Penumpang" type="number" value={form.capacity || ""} onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))} id="veh-capacity" />
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
          
          {/* Location Pricing Grid */}
          <div className="sm:col-span-2 border-t border-slate-200 pt-5 mt-4">
            <h3 className="text-[14px] font-bold text-slate-800 mb-1">Pengaturan Harga & Diskon per Lokasi</h3>
            <p className="text-[11.5px] text-slate-400 mb-4">Tentukan tarif sewa harian dan diskon khusus untuk masing-masing kota destinasi.</p>
            <div className="space-y-4">
              {(form.locations || []).map((loc) => {
                let settingsList: any[] = [];
                try {
                  settingsList = typeof form.priceSettings === 'string' ? JSON.parse(form.priceSettings) : (form.priceSettings || []);
                } catch(e) {}
                const setting = settingsList.find((s: any) => s.location === loc) || { location: loc, priceWithDriver: 0, priceSelfDrive: 0, discount: 0, isActive: true };
                return (
                  <div key={loc} className="p-4 bg-slate-50/50 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors shadow-sm">
                    {/* Header Row */}
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                          <MapPin size={12} className="stroke-[2.5]" /> {loc}
                        </span>
                        
                        <select
                          value={setting.isActive !== false ? "Active" : "Inactive"}
                          onChange={(e) => {
                            const updatedList = [...settingsList];
                            const idx = updatedList.findIndex((s: any) => s.location === loc);
                            const val = e.target.value === "Active";
                            if (idx > -1) {
                              updatedList[idx] = { ...updatedList[idx], isActive: val };
                            } else {
                              updatedList.push({ location: loc, priceWithDriver: 0, priceSelfDrive: 0, discount: 0, isActive: val });
                            }
                            setForm(p => ({ ...p, priceSettings: JSON.stringify(updatedList) }));
                          }}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border focus:outline-none transition-colors cursor-pointer ${
                            setting.isActive !== false 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                      <span className="text-[11px] text-slate-400 italic">Tarif khusus {loc}</span>
                    </div>
                    {/* Inputs Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <CurrencyInput
                        label="Harga Lepas Kunci (Rp)"
                        value={setting.priceSelfDrive}
                        onChange={(val) => {
                          const updatedList = [...settingsList];
                          const idx = updatedList.findIndex((s: any) => s.location === loc);
                          if (idx > -1) {
                            updatedList[idx] = { ...updatedList[idx], priceSelfDrive: val };
                          } else {
                            updatedList.push({ location: loc, priceWithDriver: 0, priceSelfDrive: val, discount: 0, isActive: true });
                          }
                          setForm(p => ({ ...p, priceSettings: JSON.stringify(updatedList) }));
                        }}
                      />
                      <CurrencyInput
                        label="Harga Dengan Driver (Rp)"
                        value={setting.priceWithDriver}
                        onChange={(val) => {
                          const updatedList = [...settingsList];
                          const idx = updatedList.findIndex((s: any) => s.location === loc);
                          if (idx > -1) {
                            updatedList[idx] = { ...updatedList[idx], priceWithDriver: val };
                          } else {
                            updatedList.push({ location: loc, priceWithDriver: val, priceSelfDrive: 0, discount: 0, isActive: true });
                          }
                          setForm(p => ({ ...p, priceSettings: JSON.stringify(updatedList) }));
                        }}
                      />
                      <Input
                        label="Diskon Lokasi (%)"
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Contoh: 10"
                        value={setting.discount !== undefined ? setting.discount : 0}
                        onChange={(e) => {
                          const updatedList = [...settingsList];
                          const idx = updatedList.findIndex((s: any) => s.location === loc);
                          const val = Number(e.target.value);
                          if (idx > -1) {
                            updatedList[idx] = { ...updatedList[idx], discount: val };
                          } else {
                            updatedList.push({ location: loc, priceWithDriver: 0, priceSelfDrive: 0, discount: val, isActive: true });
                          }
                          setForm(p => ({ ...p, priceSettings: JSON.stringify(updatedList) }));
                        }}
                      />
                    </div>
                  </div>
                );
              })}
              {(form.locations || []).length === 0 && (
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-slate-400">
                  <MapPin size={24} className="stroke-[1.5] mb-1 text-slate-300" />
                  <p className="text-[12px] italic">Pilih minimal satu lokasi di atas untuk mengatur harga.</p>
                </div>
              )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Input label="Fasilitas (pisahkan dengan koma)" placeholder="AC, Air Mineral, Supir, Bensin" value={facilitiesText} onChange={(e) => setFacilitiesText(e.target.value)} id="veh-facilities" />
          </div>
          <div className="sm:col-span-2"><Textarea label="Deskripsi" rows={3} value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} id="veh-desc" /></div>
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

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Kendaraan" size="sm">
        <p className="text-[13.5px] text-slate-600 mb-5">Yakin ingin menghapus kendaraan ini?</p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Hapus</Button>
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
