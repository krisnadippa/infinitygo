"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, Users, Check, X as XIcon, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/admin/Badge";
import Button from "@/components/admin/Button";
import Modal from "@/components/admin/Modal";
import { Input, Select, Textarea } from "@/components/admin/FormFields";
import { dummyVehicles, Vehicle, formatRupiah } from "@/lib/admin-data";
import Image from "next/image";

function generateId() { return Math.random().toString(36).slice(2, 9); }

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
];

const defaultForm: Partial<Vehicle> = {
  name: "", type: "Car", brand: "", location: "Bali", capacity: 4, pricePerDay: 0,
  driverIncluded: false, description: "", image: "", status: "Active",
};

const typeColors: Record<string, string> = {
  Car: "bg-blue-50 text-blue-700 border-blue-200",
  "Mini Bus": "bg-purple-50 text-purple-700 border-purple-200",
  Bus: "bg-amber-50 text-amber-700 border-amber-200",
  Motorcycle: "bg-teal-50 text-teal-700 border-teal-200",
};

export default function VehiclesPage() {
  const [items, setItems] = useState<Vehicle[]>(dummyVehicles);
  const [search, setSearch] = useState("");
  const [filterLocation, setFilterLocation] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<Partial<Vehicle>>(defaultForm);

  const filtered = items.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.brand.toLowerCase().includes(search.toLowerCase());
    const matchLocation = filterLocation === "All" || v.location === filterLocation;
    return matchSearch && matchLocation;
  });

  const openCreate = () => { setEditing(null); setForm(defaultForm); setModalOpen(true); };
  const openEdit = (v: Vehicle) => { setEditing(v); setForm({ ...v }); setModalOpen(true); };

  const handleSave = () => {
    const veh: Vehicle = {
      id: editing?.id || generateId(),
      name: form.name || "",
      type: form.type as Vehicle["type"] || "Car",
      brand: form.brand || "",
      location: form.location || "Bali",
      capacity: form.capacity || 4,
      pricePerDay: form.pricePerDay || 0,
      driverIncluded: form.driverIncluded || false,
      description: form.description || "",
      image: form.image || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600",
      status: form.status || "Active",
    };
    if (editing) setItems((prev) => prev.map((v) => (v.id === editing.id ? veh : v)));
    else setItems((prev) => [...prev, veh]);
    setModalOpen(false);
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
                src={veh.image}
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
                <span className="flex items-center gap-1"><MapPin size={12} /> {veh.location}</span>
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
                <div>
                  <p className="text-[15px] font-bold text-blue-600">{formatRupiah(veh.pricePerDay)}</p>
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
          <Select label="Tipe Kendaraan" id="veh-type" options={typeOptions} value={form.type || "Car"} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Vehicle["type"] }))} />
          <Input label="Brand" placeholder="Toyota, Honda, dll" value={form.brand || ""} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} id="veh-brand" />
          <Select label="Lokasi" id="veh-location" options={locationOptions} value={form.location || "Bali"} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
          <Input label="Kapasitas Penumpang" type="number" value={form.capacity || ""} onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))} id="veh-capacity" />
          <Input label="Harga per Hari (Rp)" type="number" value={form.pricePerDay || ""} onChange={(e) => setForm((p) => ({ ...p, pricePerDay: Number(e.target.value) }))} id="veh-price" />
          <Select label="Driver Included" id="veh-driver" options={[{ value: "true", label: "Ya" }, { value: "false", label: "Tidak" }]} value={String(form.driverIncluded || false)} onChange={(e) => setForm((p) => ({ ...p, driverIncluded: e.target.value === "true" }))} />
          <Select label="Status" id="veh-status" options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} value={form.status || "Active"} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))} />
          <div className="sm:col-span-2"><Textarea label="Deskripsi" rows={3} value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} id="veh-desc" /></div>
          <div className="sm:col-span-2">
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Upload Gambar</label>
            <div className="flex items-center gap-4">
              {form.image && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 flex-shrink-0">
                  <Image src={form.image} alt="Preview" fill className="object-cover" sizes="64px" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                id="veh-image-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setForm((p) => ({ ...p, image: reader.result as string }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="w-full text-[13px] text-slate-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-[12.5px] file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Pilih file gambar dari komputer Anda (.jpg, .png)</p>
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
          <Button variant="danger" className="flex-1" onClick={() => { setItems((p) => p.filter((v) => v.id !== deleteId)); setDeleteId(null); }}>Hapus</Button>
          <Button variant="outline" className="flex-1" onClick={() => setDeleteId(null)}>Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
