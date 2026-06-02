"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { MapPin, Clock, Star, Check, ArrowRight, Menu, X, Home, Car, Users, X as XIcon } from "lucide-react";
import { IconBrandX, IconBrandFacebook, IconBrandLinkedin, IconBrandInstagram } from "@tabler/icons-react";
import { 
  Navbar, 
  NavBody, 
  NavItems, 
  MobileNav, 
  NavbarLogo, 
  NavbarButton, 
  MobileNavHeader, 
  MobileNavToggle, 
  MobileNavMenu 
} from "@/components/ui/resizable-navbar";
import { LanguageSwitcher } from "@/components/language-switcher";

const CITIES = ["Semua", "Bali", "Jakarta", "Labuan Bajo", "Yogyakarta", "Malang", "Malaysia", "China", "Vietnam", "Thailand"];
import { formatRupiah, TourPackage, Accommodation, Vehicle } from "@/lib/admin-data";

const typeBadgeColors: Record<string, string> = {
  Hotel: "bg-blue-50 text-blue-700 border-blue-200",
  Villa: "bg-purple-50 text-purple-700 border-purple-200",
  "Guest House": "bg-teal-50 text-teal-700 border-teal-200",
  Resort: "bg-amber-50 text-amber-700 border-amber-200",
};

const vehicleTypeColors: Record<string, string> = {
  Car: "bg-blue-50 text-blue-700 border-blue-200",
  "Mini Bus": "bg-purple-50 text-purple-700 border-purple-200",
  Bus: "bg-amber-50 text-amber-700 border-amber-200",
  Motorcycle: "bg-teal-50 text-teal-700 border-teal-200",
};

export default function DestinasiClient({
  initialPackages,
  initialAccommodations,
  initialVehicles
}: {
  initialPackages: TourPackage[];
  initialAccommodations: Accommodation[];
  initialVehicles: Vehicle[];
}) {
  const [packages] = useState<TourPackage[]>(initialPackages);
  const [accommodations] = useState<Accommodation[]>(initialAccommodations);
  const [vehicles] = useState<Vehicle[]>(initialVehicles);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Semua");

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const handlePackageClick = (pkg: TourPackage) => {
    const waNumber = "628977857823";
    const text = `Halo tim Infinity Go,\n\nSaya tertarik untuk memesan/bertanya mengenai paket tour berikut:\n\n📌 *Paket:* ${pkg.name}\n📍 *Lokasi:* ${pkg.location}\n⏱ *Durasi:* ${pkg.duration}\n💰 *Harga:* ${formatRupiah(pkg.price)}\n\nMohon informasi ketersediaan dan detail jadwalnya. Terima kasih!`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleAccommodationClick = (acc: Accommodation) => {
    const waNumber = "628977857823";
    const text = `Halo tim Infinity Go,\n\nSaya ingin memesan/bertanya mengenai akomodasi berikut:\n\n🏨 *Nama:* ${acc.name}\n📍 *Lokasi:* ${acc.location}\n🛏 *Tipe:* ${acc.type}\n💰 *Harga:* ${formatRupiah(acc.pricePerNight)}\n\nMohon informasi ketersediaan kamar. Terima kasih!`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleVehicleClick = (veh: Vehicle) => {
    const waNumber = "628977857823";
    const text = `Halo tim Infinity Go,\n\nSaya ingin menyewa kendaraan berikut:\n\n🚗 *Nama:* ${veh.name}\n📍 *Lokasi:* ${veh.location}\n👥 *Kapasitas:* ${veh.capacity}\n💰 *Harga:* ${formatRupiah(veh.pricePerDay)} / Hari\n\nMohon informasi ketersediaannya. Terima kasih!`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const matchesCity = (location: string, city: string) => {
    if (city === "Semua") return true;
    const l = location.toLowerCase();
    const c = city.toLowerCase();
    if (l.includes(c)) return true;
    if (city === "Bali" && (l.includes("ubud") || l.includes("kuta") || l.includes("seminyak") || l.includes("badung") || l.includes("gianyar") || l.includes("nusa dua") || l.includes("singaraja") || l.includes("lovina") || l.includes("bedugul"))) return true;
    return false;
  };

  const filteredPackages = packages.filter(pkg => matchesCity(pkg.location, selectedCity));
  const filteredAccommodations = accommodations.filter(acc => matchesCity(acc.location, selectedCity));
  const filteredVehicles = vehicles.filter(veh => matchesCity(veh.location, selectedCity));

  return (
    <div className="min-h-screen bg-slate-50 font-outfit">
      {/* ── NAVBAR ── */}
      <Navbar className="top-0">
        <NavBody className="max-w-[1400px]">
          <NavbarLogo />
          <NavItems 
            items={[
              { name: "Beranda", link: "/" },
              { name: "Layanan", link: "/layanan" },
              { name: "Destinasi", link: "/destinasi" },
              { name: "Galeri", link: "/galeri" },
              { name: "Testimoni", link: "/#testimoni" },
              { name: "Kontak", link: "/kontak" },
            ]} 
            className="text-slate-600"
          />
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSwitcher />
            <NavbarButton variant="gradient" href="/kontak">
              Pesan Sekarang
            </NavbarButton>
            <div className="md:hidden">
              <MobileNavToggle 
                isOpen={isMobileMenuOpen} 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              />
            </div>
          </div>
        </NavBody>
        <MobileNav visible={scrolled || isMobileMenuOpen}>
          <MobileNavHeader>
            <NavbarLogo scrolled={scrolled || isMobileMenuOpen} />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            <div className="flex flex-col h-full py-2">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <span className="font-medium text-slate-500 text-sm">Pengaturan Bahasa:</span>
                <LanguageSwitcher />
              </div>
              <div className="flex flex-col gap-6">
                {[
                  { name: "Beranda", link: "/" },
                  { name: "Layanan", link: "/layanan" },
                  { name: "Destinasi", link: "/destinasi" },
                  { name: "Galeri", link: "/galeri" },
                  { name: "Testimoni", link: "/#testimoni" },
                  { name: "Kontak", link: "/kontak" },
                ].map((item, idx) => (
                  <a
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-bold text-slate-800 hover:text-[#40B5AD] transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
              <div className="mt-auto pt-10">
                <NavbarButton 
                  onClick={() => setIsMobileMenuOpen(false)}
                  variant="gradient" 
                  className="w-full text-center py-4 text-base shadow-lg shadow-[#40B5AD]/25" 
                  href="/kontak"
                >
                  Pesan Sekarang
                </NavbarButton>
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* ── HERO SECTION ── */}
      <section className="px-4 md:px-10 pt-20 md:pt-24">
        <div className="relative h-[60vh] min-h-[400px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-lg bg-slate-900">
          <Image
            src="/images/destinasi1.jpg"
            alt="Destinasi Infinity Go"
            fill 
            className="object-cover" 
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-black/40" />
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-md"
            >
              Paket Tour & Destinasi
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white text-sm md:text-lg max-w-2xl mx-auto drop-shadow-md"
            >
              Jelajahi keajaiban Indonesia. Pilih paket perjalanan impian Anda ke berbagai lokasi memukau.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── FILTER & PACKAGE LIST ── */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          
          {/* City Filter */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Paket Tersedia</h2>
              <p className="text-slate-500 text-sm">Filter berdasarkan kota tujuan Anda.</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-end gap-2.5 w-full md:w-auto max-w-2xl">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-5 py-2 rounded-full text-[13.5px] font-semibold whitespace-nowrap transition-all duration-300 ${
                    selectedCity === city 
                      ? "bg-[#40B5AD] text-white shadow-md shadow-[#40B5AD]/30 -translate-y-[1px]" 
                      : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-800 border border-slate-200"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Packages Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence>
              {filteredPackages.map((pkg) => (
                <motion.div
                  layout="position"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={pkg.id}
                  onClick={() => handlePackageClick(pkg)}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
                >
                  <div className="relative h-44 w-full flex-shrink-0">
                    <Image
                      src={pkg.imageUrl || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600"}
                      alt={pkg.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-4 space-y-2.5 flex flex-col flex-1">
                    <h3 className="text-[14px] font-semibold text-slate-800 leading-tight group-hover:text-[#40B5AD] transition-colors">{pkg.name}</h3>
                    <div className="flex items-center gap-3 text-[12px] text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-[#40B5AD]" /> <span className="line-clamp-1">{pkg.location}</span></span>
                      <span className="flex items-center gap-1 flex-shrink-0"><Clock size={12} className="text-[#40B5AD]" /> {pkg.duration}</span>
                    </div>
                    <p className="text-[12.5px] text-slate-500 line-clamp-2">{pkg.description}</p>
                    <div className="flex flex-wrap gap-1.5 flex-1 content-start">
                      {pkg.facilities.slice(0, 3).map((f) => (
                        <span key={f} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{f}</span>
                      ))}
                      {pkg.facilities.length > 3 && (
                        <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                          +{pkg.facilities.length - 3} lainnya
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                      <div className="flex flex-col">
                        {(pkg.discount || 0) > 0 && (
                          <span className="text-[12px] text-slate-400 line-through">
                            {formatRupiah(pkg.price)}
                          </span>
                        )}
                        <p className="text-[15px] font-bold text-[#40B5AD] notranslate flex flex-wrap items-center gap-1.5" translate="no">
                          {formatRupiah(pkg.price - (pkg.price * (pkg.discount || 0) / 100))}
                          {(pkg.discount || 0) > 0 && (
                            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                              Hemat {pkg.discount}%
                            </span>
                          )}
                        </p>
                      </div>
                      <button className="w-8 h-8 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredPackages.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500 text-lg">Maaf, paket tour untuk destinasi ini sedang tidak tersedia.</p>
            </div>
          )}

          {/* ── ACCOMMODATIONS SECTION ── */}
          {filteredAccommodations.length > 0 && (
            <div id="akomodasi" className="mt-20 scroll-mt-28">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Akomodasi Pilihan</h2>
                <p className="text-slate-500 text-sm">Temukan penginapan terbaik untuk melengkapi liburan Anda di {selectedCity === "Semua" ? "berbagai destinasi" : selectedCity}.</p>
              </div>
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence>
                  {filteredAccommodations.map((acc) => (
                    <motion.div
                      layout="position" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                      key={acc.id} onClick={() => handleAccommodationClick(acc)}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col sm:flex-row hover:-translate-y-1"
                    >
                      <div className="relative h-48 sm:h-auto sm:w-36 flex-shrink-0">
                        <Image src={acc.imageUrl || "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600"} alt={acc.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 144px" />
                      </div>
                      <div className="p-4 flex-1 flex flex-col space-y-2">
                        <h3 className="text-[14px] font-semibold text-slate-800 leading-tight group-hover:text-[#40B5AD] transition-colors">{acc.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${typeBadgeColors[acc.type]}`}>{acc.type}</span>
                          <span className="flex items-center gap-1 text-[12px] text-slate-400"><MapPin size={11} className="text-[#40B5AD]" /> <span className="line-clamp-1">{acc.location}</span></span>
                        </div>
                        <p className="text-[12px] text-slate-500 line-clamp-2">{acc.description}</p>
                        <div className="flex flex-wrap gap-1 flex-1 content-start">
                          {acc.facilities.slice(0, 3).map((f) => <span key={f} className="text-[10.5px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{f}</span>)}
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                          <div>
                            {(acc.discount || 0) > 0 && (
                              <span className="text-[12px] text-slate-400 line-through">
                                {formatRupiah(acc.pricePerNight)}
                              </span>
                            )}
                            <p className="text-[13px] font-bold text-[#40B5AD] notranslate flex flex-wrap items-center gap-1.5" translate="no">
                              {formatRupiah(acc.pricePerNight - (acc.pricePerNight * (acc.discount || 0) / 100))}
                              {(acc.discount || 0) > 0 && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                                  Hemat {acc.discount}%
                                </span>
                              )}
                            </p>
                            <p className="text-[10.5px] text-slate-400">per malam</p>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

          {/* ── VEHICLES SECTION ── */}
          {filteredVehicles.length > 0 && (
            <div className="mt-20">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Sewa Kendaraan</h2>
                <p className="text-slate-500 text-sm">Armada kendaraan terawat untuk mobilitas Anda di {selectedCity === "Semua" ? "berbagai destinasi" : selectedCity}.</p>
              </div>
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                <AnimatePresence>
                  {filteredVehicles.map((veh) => (
                    <motion.div
                      layout="position" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                      key={veh.id} onClick={() => handleVehicleClick(veh)}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
                    >
                      <div className="relative h-44 w-full flex-shrink-0">
                        <Image src={veh.imageUrl || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600"} alt={veh.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                      <div className="p-4 space-y-2.5 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-[14px] font-semibold text-slate-800 leading-tight group-hover:text-[#40B5AD] transition-colors">{veh.name}</h3>
                            <p className="text-[11.5px] text-slate-500 mt-0.5 font-medium">{veh.brand}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-[12px] text-slate-500">
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-[#40B5AD]" /> <span className="line-clamp-1">{veh.location}</span></span>
                          <span className="flex items-center gap-1 flex-shrink-0"><Users size={12} className="text-[#40B5AD]" /> {veh.capacity} org</span>
                        </div>
                        
                        <p className="text-[12.5px] text-slate-500 line-clamp-2">{veh.description}</p>
                        
                        <div className="flex flex-wrap gap-1.5 pt-1 flex-1 content-start">
                          <span className={`text-[10.5px] px-2 py-0.5 rounded-full border font-medium ${vehicleTypeColors[veh.type]}`}>
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
                        
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-auto">
                          <div>
                            {(veh.discount || 0) > 0 && (
                              <span className="text-[12px] text-slate-400 line-through">
                                {formatRupiah(veh.pricePerDay)}
                              </span>
                            )}
                            <p className="text-[15px] font-bold text-[#40B5AD] notranslate flex flex-wrap items-center gap-1.5" translate="no">
                              {formatRupiah(veh.pricePerDay - (veh.pricePerDay * (veh.discount || 0) / 100))}
                              {(veh.discount || 0) > 0 && (
                                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                                  Hemat {veh.discount}%
                                </span>
                              )}
                            </p>
                            <p className="text-[10.5px] text-slate-400">per hari</p>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          )}

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white pt-20 pb-6 border-t border-slate-100 relative overflow-hidden">
        {/* Giant Faded Background Text Watermark */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end select-none pointer-events-none z-0 w-full">
          <span className="text-[14vw] font-black tracking-tight bg-gradient-to-b from-slate-900/[0.08] via-slate-900/[0.04] to-slate-900/[0.01] bg-clip-text text-transparent leading-[0.8] whitespace-nowrap">
            INFINITY GO
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
            {/* Logo & Description */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-6">
                <div className="relative w-10 h-10">
                  <Image src="/images/logo.png" alt="Infinity Go" fill className="object-contain" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-slate-900">Infinity Go</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Infinity Go adalah mitra perjalanan terpercaya Anda. Layanan premium, pengalaman tak terlupakan untuk petualangan Anda.
              </p>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-2">
              <h4 className="text-slate-900 font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Support Center</a></li>
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">FAQs</a></li>
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Troubleshooting</a></li>
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Feedback</a></li>
              </ul>
            </div>
            <div className="lg:col-span-2">
              <h4 className="text-slate-900 font-bold mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div className="lg:col-span-2">
              <h4 className="text-slate-900 font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Compliance</a></li>
              </ul>
            </div>

            {/* Newsletter & Socials */}
            <div className="lg:col-span-3 flex flex-col gap-8">
              <div className="relative flex items-center bg-white border border-slate-200 rounded-full p-2 shadow-sm w-full">
                <input 
                  type="email" 
                  placeholder="Type your email address" 
                  className="bg-transparent border-none focus:ring-0 text-sm px-4 py-2 w-full outline-none"
                />
                <button className="bg-slate-900 text-white px-8 py-3 rounded-full text-xs font-bold hover:bg-slate-800 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <div className="flex items-center gap-4">
                <a href="#" className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-[#40B5AD] hover:text-white transition-all shadow-sm"><IconBrandX size={16} /></a>
                <a href="#" className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-[#40B5AD] hover:text-white transition-all shadow-sm"><IconBrandFacebook size={16} /></a>
                <a href="#" className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-[#40B5AD] hover:text-white transition-all shadow-sm"><IconBrandLinkedin size={16} /></a>
                <a href="#" className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-[#40B5AD] hover:text-white transition-all shadow-sm"><IconBrandInstagram size={16} /></a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-sm">Copyright © Infinity Go {new Date().getFullYear()}</p>
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Terms Of Use</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
