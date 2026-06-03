"use client";

import { useState } from "react";
import { Save, Bell, Lock, Globe, User } from "lucide-react";
import { Input, Select } from "@/components/admin/FormFields";
import Button from "@/components/admin/Button";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "general">("profile");

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: <User size={15} /> },
    { id: "security" as const, label: "Security", icon: <Lock size={15} /> },
    { id: "notifications" as const, label: "Notifications", icon: <Bell size={15} /> },
    { id: "general" as const, label: "General", icon: <Globe size={15} /> },
  ];

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Settings</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Pengaturan akun dan sistem</p>
        </div>
        <Button icon={<Save size={15} />} onClick={handleSave}>Simpan Perubahan</Button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-[13px] text-green-700 font-medium">
          Pengaturan berhasil disimpan.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 px-2 pt-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-t-lg transition-colors mr-1 ${
                activeTab === tab.id ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5 max-w-2xl">
          {activeTab === "profile" && (
            <>
              <h2 className="text-[14px] font-semibold text-slate-800 mb-4">Profil Admin</h2>
              <div className="flex items-center gap-5 mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-2xl">A</div>
                <div>
                  <p className="text-[13.5px] font-medium text-slate-700">Admin Infinity Go</p>
                  <p className="text-[12.5px] text-slate-400">infinitygo.travel@gmail.com</p>
                  <button className="text-[12px] text-blue-600 mt-1 hover:underline">Ganti Foto</button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nama Lengkap" defaultValue="Admin Infinity Go" id="settings-name" />
                <Input label="Email" type="email" defaultValue="infinitygo.travel@gmail.com" id="settings-email" />
                <Input label="Nomor Telepon" defaultValue="+6281234567890" id="settings-phone" />
                <Input label="Jabatan" defaultValue="Administrator" id="settings-role" />
              </div>
            </>
          )}
          {activeTab === "security" && (
            <>
              <h2 className="text-[14px] font-semibold text-slate-800 mb-4">Keamanan</h2>
              <div className="space-y-4">
                <Input label="Password Lama" type="password" placeholder="••••••••" id="settings-old-pass" />
                <Input label="Password Baru" type="password" placeholder="••••••••" id="settings-new-pass" />
                <Input label="Konfirmasi Password" type="password" placeholder="••••••••" id="settings-confirm-pass" />
              </div>
            </>
          )}
          {activeTab === "notifications" && (
            <>
              <h2 className="text-[14px] font-semibold text-slate-800 mb-4">Notifikasi</h2>
              <div className="space-y-3">
                {[
                  { label: "Invoice baru dibuat", id: "notif-invoice" },
                  { label: "Invoice lunas (Paid)", id: "notif-paid" },
                  { label: "Invoice melewati due date", id: "notif-overdue" },
                  { label: "Expense ditambahkan", id: "notif-expense" },
                  { label: "Laporan bulanan", id: "notif-report" },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 border-b border-slate-100">
                    <label htmlFor={item.id} className="text-[13.5px] text-slate-700">{item.label}</label>
                    <input type="checkbox" id={item.id} defaultChecked className="w-4 h-4 accent-blue-600 cursor-pointer" />
                  </div>
                ))}
              </div>
            </>
          )}
          {activeTab === "general" && (
            <>
              <h2 className="text-[14px] font-semibold text-slate-800 mb-4">Pengaturan Umum</h2>
              <div className="space-y-4">
                <Input label="Nama Bisnis" defaultValue="Infinity Go Admin" id="settings-biz-name" />
                <Select label="Mata Uang" id="settings-currency" options={[{ value: "IDR", label: "IDR - Rupiah Indonesia" }, { value: "USD", label: "USD - US Dollar" }]} />
                <Select label="Bahasa" id="settings-lang" options={[{ value: "id", label: "Bahasa Indonesia" }, { value: "en", label: "English" }]} />
                <Select label="Timezone" id="settings-tz" options={[{ value: "Asia/Makassar", label: "WITA - Asia/Makassar" }, { value: "Asia/Jakarta", label: "WIB - Asia/Jakarta" }]} />
                <Input label="Invoice Prefix" defaultValue="INV" helper="Digunakan untuk nomor invoice otomatis, contoh: INV-2026-001" id="settings-inv-prefix" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
