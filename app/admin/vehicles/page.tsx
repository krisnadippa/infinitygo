"use client";

import { useState } from "react";
import { PlusCircle, Edit2, Trash2, Search, Users, Check, X as XIcon } from "lucide-react";
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

const defaultForm: Partial<Vehicle> = {
  name: "", type: "Car", brand: "", capacity: 4, pricePerDay: 0,
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
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<Partial<Vehicle>>(defaultForm);

  const filtered = items.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(defaultForm); setModalOpen(true); };
  const openEdit = (v: Vehicle) => { setEditing(v); setForm({ ...v }); setModalOpen(true); };

  const handleSave = () => {
    const veh: Vehicle = {
      id: editing?.id || generateId(),
      name: form.name || "",
      type: form.type as Vehicle["type"] || "Car",
      brand: form.brand || "",
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="relative max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Cari kendaraan..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-[13.5px] border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {["Kendaraan", "Tipe", "Kapasitas", "Harga/Hari", "Driver", "Status", "Aksi"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-[11.5px] font-semibold uppercase tracking-wide text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((veh) => (
                <tr key={veh.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                        <Image src={veh.image} alt={veh.name} fill className="object-cover" sizes="56px" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-slate-700">{veh.name}</p>
                        <p className="text-[11.5px] text-slate-400">{veh.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11.5px] px-2.5 py-0.5 rounded-full border font-medium ${typeColors[veh.type]}`}>{veh.type}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-[13px] text-slate-600">
                      <Users size={13} className="text-slate-400" /> {veh.capacity}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-[13px] font-semibold text-slate-800">{formatRupiah(veh.pricePerDay)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    {veh.driverIncluded
                      ? <span className="flex items-center gap-1 text-[12.5px] text-green-600 font-medium"><Check size={13} /> Ya</span>
                      : <span className="flex items-center gap-1 text-[12.5px] text-slate-400"><XIcon size={13} /> Tidak</span>}
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={veh.status} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(veh)} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteId(veh.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Kendaraan" : "Tambah Kendaraan"} size="lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2"><Input label="Nama Kendaraan" placeholder="Contoh: Toyota Innova Reborn" value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} id="veh-name" /></div>
          <Select label="Tipe Kendaraan" id="veh-type" options={typeOptions} value={form.type || "Car"} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as Vehicle["type"] }))} />
          <Input label="Brand" placeholder="Toyota, Honda, dll" value={form.brand || ""} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} id="veh-brand" />
          <Input label="Kapasitas Penumpang" type="number" value={form.capacity || ""} onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))} id="veh-capacity" />
          <Input label="Harga per Hari (Rp)" type="number" value={form.pricePerDay || ""} onChange={(e) => setForm((p) => ({ ...p, pricePerDay: Number(e.target.value) }))} id="veh-price" />
          <Select label="Driver Included" id="veh-driver" options={[{ value: "true", label: "Ya" }, { value: "false", label: "Tidak" }]} value={String(form.driverIncluded || false)} onChange={(e) => setForm((p) => ({ ...p, driverIncluded: e.target.value === "true" }))} />
          <Select label="Status" id="veh-status" options={[{ value: "Active", label: "Active" }, { value: "Inactive", label: "Inactive" }]} value={form.status || "Active"} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as "Active" | "Inactive" }))} />
          <div className="sm:col-span-2"><Textarea label="Deskripsi" rows={3} value={form.description || ""} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} id="veh-desc" /></div>
          <div className="sm:col-span-2"><Input label="URL Gambar" placeholder="https://..." value={form.image || ""} onChange={(e) => setForm((p) => ({ ...p, image: e.target.value }))} id="veh-image" /></div>
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
