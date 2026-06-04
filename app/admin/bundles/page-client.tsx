"use client";

import { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, Search, MapPin, Tag } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea, CurrencyInput } from "@/components/admin/FormFields";
import { formatRupiah, Bundle } from "@/lib/admin-data";
import Image from "next/image";
import { saveBundle, deleteBundle } from "../actions";
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

const defaultForm: Partial<Bundle> = {
  name: "", description: "", imageUrl: "", originalPrice: 0, discount: 0, discountedPrice: 0, locations: ["Bali"], includedItems: [], status: "Active",
};

export default function BundleClient({ 
  initialData, 
  packages, 
  accommodations, 
  vehicles, 
  wifis, 
  mice 
}: { 
  initialData: any[],
  packages: any[],
  accommodations: any[],
  vehicles: any[],
  wifis: any[],
  mice: any[]
}) {
  const [items, setItems] = useState<any[]>(initialData);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Bundle | null>(null);
  const [form, setForm] = useState<Partial<Bundle>>(defaultForm);
  
  // State for item selection
  const [selectedType, setSelectedType] = useState<string>("TourPackage");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [includedItemsList, setIncludedItemsList] = useState<any[]>([]);

  // Auto calculate discounted price
  useEffect(() => {
    if (form.originalPrice !== undefined && form.discount !== undefined) {
      const discountAmount = form.originalPrice * (form.discount / 100);
      setForm(prev => ({ ...prev, discountedPrice: Math.round(form.originalPrice! - discountAmount) }));
    }
  }, [form.originalPrice, form.discount]);

  const filtered = items.filter((p) => {
    return p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.locations || []).some((loc: string) => loc.toLowerCase().includes(search.toLowerCase()));
  });

  const getOptionsForType = (type: string) => {
    switch (type) {
      case "TourPackage": return packages;
      case "Accommodation": return accommodations;
      case "Vehicle": return vehicles;
      case "Wifi": return wifis;
      case "Mice": return mice;
      default: return [];
    }
  };

  const handleAddItem = () => {
    if (!selectedItemId) return;
    const options = getOptionsForType(selectedType);
    const item = options.find(o => o.id === selectedItemId);
    if (item) {
      const newItem = {
        id: item.id,
        type: selectedType,
        name: item.name,
        imageUrl: item.imageUrl || item.image || ""
      };
      // Check if already added
      if (!includedItemsList.find(i => i.id === newItem.id)) {
        setIncludedItemsList([...includedItemsList, newItem]);
      }
      setSelectedItemId("");
    }
  };

  const handleRemoveItem = (id: string) => {
    setIncludedItemsList(includedItemsList.filter(i => i.id !== id));
  };

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setIncludedItemsList([]);
    setSelectedType("TourPackage");
    setSelectedItemId("");
    setModalOpen(true);
  };

  const openEdit = (bundle: Bundle) => {
    setEditing(bundle);
    setForm({ ...bundle });
    
    // Parse includedItems from stringified JSON or legacy string
    const parsedList = (bundle.includedItems || []).map(itemString => {
      try {
        const obj = JSON.parse(itemString);
        if (obj.name && obj.type) return obj;
      } catch (e) {
        // Legacy string item
      }
      return { id: Math.random().toString(), type: "Custom", name: itemString, imageUrl: "" };
    });
    
    setIncludedItemsList(parsedList);
    setModalOpen(true);
  };

  const handleSave = async () => {
    // stringify the objects to store in String[]
    const serializedItems = includedItemsList.map(item => JSON.stringify(item));
    
    // determine bundle image: use the first item's image if available
    const bundleImage = includedItemsList.find(i => i.imageUrl)?.imageUrl || "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600";

    const bundle = {
      ...(editing ? { id: editing.id } : {}),
      name: form.name || "",
      description: form.description || "",
      imageUrl: bundleImage,
      originalPrice: form.originalPrice || 0,
      discount: form.discount || 0,
      discountedPrice: form.discountedPrice || 0,
      locations: form.locations || ["Bali"],
      includedItems: serializedItems,
      status: form.status || "Active",
    };
    
    const tempId = editing?.id || Math.random().toString();
    if (editing) setItems((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...bundle } : p)));
    else setItems((prev) => [{ ...bundle, id: tempId }, ...prev]);
    
    setModalOpen(false);
    
    try {
      const saved = await saveBundle(bundle);
      if (saved && !editing) {
        setItems((prev) => prev.map((item) => (item.id === tempId ? saved : item)));
      }
    } catch (error: any) {
      alert(error.message || "Gagal menyimpan data");
      window.location.reload();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const idToDelete = deleteId;
    setItems((p) => p.filter((b) => b.id !== idToDelete));
    setDeleteId(null);
    try {
      await deleteBundle(idToDelete);
    } catch (error: any) {
      alert(error.message || "Gagal menghapus data");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Paket Bundling (Voucher)</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{filtered.length} bundling tersedia</p>
        </div>
        <Button icon={<PlusCircle size={15} />} onClick={openCreate}>Tambah Bundling</Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari bundling..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((bundle) => {
          // Parse for display
          const displayItems = (bundle.includedItems || []).map((itemString: string) => {
            try { return JSON.parse(itemString); } catch { return { name: itemString }; }
          });
          
          return (
            <div key={bundle.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-row">
              <div className="relative w-1/3 min-w-[120px] flex-shrink-0">
                <Image
                  src={bundle.imageUrl || "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=600"}
                  alt={bundle.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 33vw, 20vw"
                />
                <div className="absolute top-2 left-2 bg-[#40B5AD] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">
                  PROMO
                </div>
              </div>
              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between border-l-2 border-dashed border-slate-200 bg-slate-50/50">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-[15px] font-bold text-slate-800 leading-tight mb-1 line-clamp-2 pr-2">{bundle.name}</h3>
                    <StatusBadge status={bundle.status} />
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2">
                    <MapPin size={10} className="text-[#40B5AD]" />
                    <span>{(bundle.locations || []).join(", ") || "Bali"}</span>
                  </div>
                  <ul className="space-y-1 mb-2">
                    {displayItems.slice(0, 3).map((item: any, idx: number) => (
                      <li key={idx} className="text-[11px] text-slate-700 flex items-start gap-1">
                        <span className="text-[#40B5AD] font-bold">•</span>
                        <span className="leading-tight truncate">{item.name}</span>
                      </li>
                    ))}
                    {displayItems.length > 3 && (
                      <li className="text-[10px] text-slate-400 italic pl-3">+ {displayItems.length - 3} layanan lainnya</li>
                    )}
                  </ul>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-slate-200/60 mt-auto">
                  <div className="flex flex-col">
                    {bundle.discount > 0 && (
                      <span className="text-[11px] text-slate-400 line-through decoration-red-400/50 decoration-2">
                        {formatRupiah(bundle.originalPrice)}
                      </span>
                    )}
                    <p className="text-[15px] font-bold text-[#40B5AD] flex items-center gap-1.5">
                      {formatRupiah(bundle.discountedPrice)}
                      {bundle.discount > 0 && (
                        <span className="text-[9px] bg-red-50 text-red-600 border border-red-100 px-1 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          -{bundle.discount}%
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(bundle)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => setDeleteId(bundle.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Bundling" : "Tambah Bundling"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input label="Nama Bundling" placeholder="Contoh: Paket Tour + Wifi Pocket" value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} id="bundle-name" />
          </div>
          
          <CurrencyInput label="Harga Asli (Total semua layanan)" value={form.originalPrice || 0} onChange={(val) => setForm((p) => ({ ...p, originalPrice: val }))} id="bundle-original-price" />
          <Input label="Diskon (%)" type="number" min="0" max="100" value={form.discount === 0 ? "" : form.discount} onChange={(e) => setForm((p) => ({ ...p, discount: Number(e.target.value) }))} id="bundle-discount" />
          
          <div className="sm:col-span-2 bg-slate-50 p-3 rounded-lg border border-slate-200 flex justify-between items-center">
            <span className="text-[13px] font-medium text-slate-600">Harga Akhir Setelah Diskon:</span>
            <span className="text-[16px] font-bold text-[#40B5AD]">{formatRupiah(form.discountedPrice || 0)}</span>
          </div>

          <Select
            label="Status"
            id="bundle-status"
            options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]}
            value={form.status || "Active"}
            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))}
          />
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Lokasi Berlaku (Bisa pilih lebih dari satu)</label>
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
                      className="rounded border-slate-300 text-[#40B5AD] focus:ring-[#40B5AD]/20"
                    />
                    {opt.label}
                  </label>
                );
              })}
            </div>
          </div>
          
          <div className="sm:col-span-2">
            <Textarea label="Deskripsi Singkat" placeholder="Promo menarik jalan-jalan dengan koneksi kencang..." rows={2} value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} id="bundle-desc" />
          </div>
          
          <div className="sm:col-span-2 border border-slate-200 rounded-lg p-4 bg-slate-50">
            <label className="block text-[13px] font-bold text-slate-800 mb-3"><Tag size={14} className="inline mr-1 text-[#40B5AD]"/> Pilih Item yang Termasuk</label>
            
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="flex-1">
                <Select
                  label=""
                  id="item-type-select"
                  options={[
                    { value: "TourPackage", label: "Paket Tour" },
                    { value: "Accommodation", label: "Akomodasi" },
                    { value: "Vehicle", label: "Kendaraan" },
                    { value: "Wifi", label: "Wifi" },
                    { value: "Mice", label: "MICE" },
                  ]}
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value);
                    setSelectedItemId("");
                  }}
                />
              </div>
              <div className="flex-1">
                <Select
                  label=""
                  id="item-id-select"
                  options={[
                    { value: "", label: "-- Pilih Layanan --" },
                    ...getOptionsForType(selectedType).map(o => ({ value: o.id, label: o.name }))
                  ]}
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                />
              </div>
              <Button onClick={handleAddItem} disabled={!selectedItemId} className="sm:mt-1 h-9 bg-slate-800 hover:bg-slate-700">Tambah</Button>
            </div>

            {includedItemsList.length > 0 ? (
              <div className="space-y-2">
                {includedItemsList.map(item => (
                  <div key={item.id} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3">
                      {item.imageUrl ? (
                        <div className="w-10 h-10 rounded-md overflow-hidden relative flex-shrink-0 bg-slate-100">
                          <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                          <Tag size={16} />
                        </div>
                      )}
                      <div>
                        <p className="text-[13px] font-semibold text-slate-800 leading-tight">{item.name}</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{item.type}</p>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-white rounded-lg border border-slate-200 border-dashed">
                <p className="text-[12px] text-slate-400">Belum ada layanan yang ditambahkan</p>
              </div>
            )}
            <p className="text-[11px] text-slate-500 mt-3 text-center">Gambar voucher bundling akan diambil secara otomatis dari gambar layanan yang Anda pilih.</p>
          </div>
          
          <div className="sm:col-span-2 flex gap-3 pt-2">
            <Button className="flex-1 bg-[#40B5AD] hover:bg-[#349690] text-white border-transparent" onClick={handleSave}>Simpan Bundling</Button>
            <Button variant="outline" className="flex-1" onClick={() => setModalOpen(false)}>Batal</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Hapus Bundling" size="sm">
        <p className="text-[13.5px] text-slate-600 mb-5">Yakin ingin menghapus voucher bundling ini? Tindakan ini tidak dapat dibatalkan.</p>
        <div className="flex gap-3">
          <Button variant="danger" className="flex-1" onClick={handleDelete}>Hapus</Button>
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
