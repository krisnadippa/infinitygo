"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Input, Textarea } from "@/components/admin/FormFields";
import Button from "@/components/admin/Button";

const defaultContent = {
  heroTitle: "Jelajahi Keindahan Bali",
  heroSubtitle: "Layanan perjalanan premium — tour, akomodasi, dan kendaraan terbaik di Pulau Dewata.",
  aboutTitle: "Tentang Infinity Go",
  aboutDescription: "Infinity Go adalah agen perjalanan terpercaya di Bali yang menyediakan layanan wisata lengkap sejak 2018. Kami berkomitmen memberikan pengalaman liburan yang tak terlupakan.",
  contactWhatsapp: "+6281234567890",
  address: "Jl. Nuansa Udayana I No.5, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali 80361",
  instagram: "https://instagram.com/infinitygo.bali",
  facebook: "https://facebook.com/infinitygo",
  bannerImage: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200",
};

export default function ContentPage() {
  const [content, setContent] = useState(defaultContent);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "contact">("hero");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "hero" as const, label: "Hero / Banner" },
    { id: "about" as const, label: "About Section" },
    { id: "contact" as const, label: "Kontak & Sosmed" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[20px] font-bold text-slate-800">Content Management</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Kelola konten website Infinity Go</p>
        </div>
        <Button icon={<Save size={15} />} onClick={handleSave}>Simpan Perubahan</Button>
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-[13px] text-green-700 font-medium">
          Konten berhasil disimpan.
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 px-2 pt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-[13px] font-medium rounded-t-lg transition-colors mr-1 ${
                activeTab === tab.id
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-5">
          {activeTab === "hero" && (
            <>
              <div>
                <h2 className="text-[14px] font-semibold text-slate-800 mb-4">Hero Section</h2>
                <div className="space-y-4">
                  <Input
                    label="Hero Title"
                    value={content.heroTitle}
                    onChange={(e) => setContent((p) => ({ ...p, heroTitle: e.target.value }))}
                    id="hero-title"
                  />
                  <Textarea
                    label="Hero Subtitle"
                    rows={3}
                    value={content.heroSubtitle}
                    onChange={(e) => setContent((p) => ({ ...p, heroSubtitle: e.target.value }))}
                    id="hero-subtitle"
                  />
                  <Input
                    label="Banner Image URL"
                    placeholder="https://..."
                    value={content.bannerImage}
                    onChange={(e) => setContent((p) => ({ ...p, bannerImage: e.target.value }))}
                    id="banner-image"
                  />
                  {content.bannerImage && (
                    <div className="mt-3">
                      <p className="text-[12.5px] text-slate-500 mb-2">Preview Banner</p>
                      <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100">
                        <img src={content.bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {activeTab === "about" && (
            <>
              <h2 className="text-[14px] font-semibold text-slate-800 mb-4">About Section</h2>
              <div className="space-y-4">
                <Input
                  label="About Title"
                  value={content.aboutTitle}
                  onChange={(e) => setContent((p) => ({ ...p, aboutTitle: e.target.value }))}
                  id="about-title"
                />
                <Textarea
                  label="About Description"
                  rows={5}
                  value={content.aboutDescription}
                  onChange={(e) => setContent((p) => ({ ...p, aboutDescription: e.target.value }))}
                  id="about-desc"
                />
              </div>
            </>
          )}

          {activeTab === "contact" && (
            <>
              <h2 className="text-[14px] font-semibold text-slate-800 mb-4">Kontak & Media Sosial</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="WhatsApp Number"
                  placeholder="+62..."
                  value={content.contactWhatsapp}
                  onChange={(e) => setContent((p) => ({ ...p, contactWhatsapp: e.target.value }))}
                  id="contact-wa"
                />
                <div className="sm:col-span-2">
                  <Textarea
                    label="Address"
                    rows={2}
                    value={content.address}
                    onChange={(e) => setContent((p) => ({ ...p, address: e.target.value }))}
                    id="contact-address"
                  />
                </div>
                <Input
                  label="Instagram URL"
                  placeholder="https://instagram.com/..."
                  value={content.instagram}
                  onChange={(e) => setContent((p) => ({ ...p, instagram: e.target.value }))}
                  id="contact-ig"
                />
                <Input
                  label="Facebook URL"
                  placeholder="https://facebook.com/..."
                  value={content.facebook}
                  onChange={(e) => setContent((p) => ({ ...p, facebook: e.target.value }))}
                  id="contact-fb"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
