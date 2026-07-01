"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Check, Plus } from "lucide-react";
import { formatRupiah, Bundle } from "@/lib/admin-data";

interface BundlingVoucherSectionProps {
  bundles: Bundle[];
  // Data array untuk me-resolve gambar dan detail tambahan secara dinamis
  packages: any[];
  accommodations: any[];
  vehicles: any[];
  wifis: any[];
  mice: any[];
  selectedCity?: string;
  hideHeader?: boolean;
  onBundleClick?: (bundle: Bundle) => void;
}

export default function BundlingVoucherSection({
  bundles = [],
  packages = [],
  accommodations = [],
  vehicles = [],
  wifis = [],
  mice = [],
  selectedCity = "Semua",
  hideHeader = false,
  onBundleClick,
}: BundlingVoucherSectionProps) {
  const matchesCity = (location: string, city: string) => {
    if (city === "Semua") return true;
    const l = location.toLowerCase();
    const c = city.toLowerCase();
    if (l.includes(c)) return true;
    if (
      city === "Bali" &&
      (l.includes("ubud") ||
        l.includes("kuta") ||
        l.includes("seminyak") ||
        l.includes("badung") ||
        l.includes("gianyar") ||
        l.includes("nusa dua") ||
        l.includes("singaraja") ||
        l.includes("lovina") ||
        l.includes("bedugul"))
    )
      return true;
    return false;
  };

  const filteredBundles = bundles.filter(
    (b) =>
      selectedCity === "Semua" ||
      (b.locations || []).some((loc) => matchesCity(loc, selectedCity))
  );

  if (filteredBundles.length === 0) return null;

  const handleBundleClick = (bundle: Bundle) => {
    if (onBundleClick) {
      onBundleClick(bundle);
      return;
    }
    const waNumber = "628977857823";
    const text = `Halo tim Infinity Go,\n\nSaya tertarik dengan Promo Bundling berikut:\n\n🎟 *Paket:* ${
      bundle.name
    }\n📍 *Lokasi:* ${(bundle.locations || []).join(", ") || "Bali"}\n💰 *Harga Promo:* ${formatRupiah(
      bundle.discountedPrice
    )}\n\nMohon informasi lebih lanjut. Terima kasih!`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="w-full font-outfit">
      {!hideHeader && (
        <div className="flex items-center gap-3 mb-8">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#40B5AD] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#40B5AD]"></span>
          </span>
          <h3 className="text-2xl font-bold text-slate-900">
            Promo Bundling Spesial {selectedCity !== "Semua" ? `di ${selectedCity}` : ""}
          </h3>
        </div>
      )}

      <div className="grid grid-cols-1 gap-10">
        {filteredBundles.map((bundle) => {
          // Parse items for display
          const displayItems = (bundle.includedItems || []).map((itemString: string) => {
            try {
              return JSON.parse(itemString);
            } catch {
              return { name: itemString };
            }
          });

          return (
            <motion.div
              layout="position"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              key={bundle.id}
              className="relative w-full rounded-[2rem] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 border border-slate-100/50 flex flex-col xl:flex-row overflow-hidden group"
            >
              {/* Outer Left Cutout (Kupon Kiri) */}
              <div className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-slate-50 rounded-full border-r border-slate-100 z-10 shadow-inner"></div>

              {/* Main Content Area (Kiri) */}
              <div className="flex-1 p-6 md:p-8 xl:pl-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-[#40B5AD]/10 text-[#40B5AD] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Paket Bundling
                  </span>
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                    Special Offer
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 xl:flex xl:flex-row xl:flex-wrap items-stretch gap-3 sm:gap-6 xl:gap-8">
                  {displayItems.length > 0 ? (
                    displayItems.map((item: any, idx: number) => {
                      let match: any = null;
                      if (item.id) {
                        if (item.type === "TourPackage") {
                          match = packages?.find((x) => x.id === item.id);
                        } else if (item.type === "Accommodation") {
                          match = accommodations?.find((x) => x.id === item.id);
                        } else if (item.type === "Vehicle") {
                          match = vehicles?.find((x) => x.id === item.id);
                        } else if (item.type === "Wifi") {
                          match = wifis?.find((x) => x.id === item.id);
                        } else if (item.type === "Mice") {
                          match = mice?.find((x) => x.id === item.id);
                        }
                      }

                      if (!match) {
                        const p = packages?.find((x) => x.name === item.name);
                        const a = accommodations?.find((x) => x.name === item.name);
                        const v = vehicles?.find((x) => x.name === item.name);
                        const w = wifis?.find((x) => x.name === item.name);
                        const m = mice?.find((x) => x.name === item.name);
                        match = p || a || v || w || m;
                      }

                      let finalImageRaw = match?.imageUrl || match?.image || item.imageUrl || item.image;
                      let finalImage = (finalImageRaw ? finalImageRaw.split(',')[0].trim() : "") || "";
                      let displayName = match?.name || item.name;
                      let desc = match?.description || "Layanan eksklusif Infinity Go.";
                      let location = match?.location || (match?.locations ? match.locations[0] : null) || "Tersedia";

                      return (
                        <div key={idx} className="flex items-center xl:gap-8 gap-3 sm:gap-6 w-full xl:w-auto">
                          {/* Katalog Card */}
                          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm w-full xl:w-[240px] flex-shrink-0 overflow-hidden flex flex-col group/card hover:-translate-y-1 hover:shadow-lg hover:border-slate-200 transition-all duration-300">
                            {/* Image Header */}
                            <div className="relative h-20 sm:h-32 w-full flex-shrink-0 bg-slate-100 overflow-hidden">
                              {finalImage ? (
                                <Image
                                  src={finalImage}
                                  alt={displayName}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                  <Check size={24} />
                                </div>
                              )}
                              <div className="absolute top-2 left-2 flex gap-1">
                                <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                                  {item.type || "Layanan"}
                                </span>
                              </div>
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-3 sm:p-4 flex-1 flex flex-col bg-white">
                              <h4 className="text-[12px] sm:text-[14px] font-bold text-slate-800 leading-tight mb-1 group-hover/card:text-[#40B5AD] transition-colors line-clamp-2">
                                {displayName}
                              </h4>
                              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-500 mb-1.5">
                                <MapPin size={10} className="text-[#40B5AD]" />
                                <span className="line-clamp-1">{location}</span>
                              </div>
                              <p className="hidden sm:block text-[11.5px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
                                {desc}
                              </p>
                              <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-2 sm:pt-3">
                                <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">Included</span>
                                <button className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-50 flex items-center justify-center text-[#40B5AD] group-hover/card:bg-[#40B5AD] group-hover/card:text-white transition-colors">
                                  <ArrowRight size={10} />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Plus Separator (Hanya tampil di desktop jika bukan item terakhir) */}
                          {idx < displayItems.length - 1 && (
                            <div className="hidden xl:flex flex-shrink-0 w-8 h-8 rounded-full bg-white shadow-[0_2px_8px_rgb(0,0,0,0.06)] border border-slate-100 items-center justify-center text-slate-300 font-bold text-lg z-10">
                              <Plus size={16} />
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic py-10 w-full">
                      Detail layanan belum ditambahkan
                    </div>
                  )}
                </div>
              </div>

              {/* Dashed Line Separator for Desktop/Tablet */}
              <div className="hidden xl:flex flex-col items-center justify-center relative w-0 z-10">
                <div className="absolute top-0 h-8 w-px border-l-2 border-dashed border-slate-200"></div>
                <div className="h-full w-px border-l-2 border-dashed border-slate-200 z-10"></div>
                <div className="absolute bottom-0 h-8 w-px border-l-2 border-dashed border-slate-200"></div>
              </div>

              {/* Dashed Line Separator for Mobile */}
              <div className="xl:hidden flex flex-row items-center justify-center relative h-0 w-full z-10">
                <div className="w-full h-px border-t-2 border-dashed border-slate-200 z-10 mx-6"></div>
              </div>

              {/* Outer Right Cutout (Kupon Kanan) */}
              <div className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-12 h-12 bg-slate-50 rounded-full border-l border-slate-100 z-10 shadow-inner"></div>

              {/* Right Side: Summary & Pricing */}
              <div className="p-6 md:p-8 xl:pr-12 xl:w-[380px] min-w-[320px] flex flex-col justify-center items-center xl:items-start bg-slate-50/30 z-20">
                <div className="w-full">
                  <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{bundle.name}</h3>
                  <p className="text-[13px] text-slate-500 mb-6 leading-relaxed">
                    {bundle.description || "Dapatkan harga spesial dengan memesan paket bundling eksklusif ini."}
                  </p>

                  <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm mb-6 w-full">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[12px] text-slate-500">Harga Normal</span>
                      <span className="text-[13px] text-slate-400 line-through font-medium">
                        {formatRupiah(bundle.originalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-50">
                      <span className="text-[12px] text-[#40B5AD] font-bold">Hemat Promo</span>
                      <span className="text-[12px] bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-bold">
                        {formatRupiah(bundle.originalPrice - bundle.discountedPrice)} (-{bundle.discount}%)
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[11px] text-slate-400 mb-0.5">Total Harga Bundling</span>
                      <span className="text-[28px] font-black text-slate-800 leading-none" translate="no">
                        {formatRupiah(bundle.discountedPrice)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBundleClick(bundle)}
                    className="w-full bg-[#40B5AD] hover:bg-[#329891] text-white px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg font-bold text-[14px] group/btn"
                  >
                    Pesan Sekarang <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
