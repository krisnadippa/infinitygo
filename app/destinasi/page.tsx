"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { MapPin, Clock, Star, Check, ArrowRight, Menu, X, Home, Car, Users } from "lucide-react";
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

const CITIES = ["Semua", "Bali", "Jakarta", "Labuan Bajo", "Yogyakarta"];

const PACKAGES = [
  { id: 1, title: "Explore Nusa Penida & Lembongan", location: "Bali", duration: "1 Hari", price: "Rp 850.000", rating: 4.9, reviews: 124, image: "/images/bali.jpg", highlights: ["Snorkeling Trip", "Island Hopping", "Makan Siang"] },
  { id: 2, title: "Ubud Cultural & Nature Retreat", location: "Bali", duration: "2H1M", price: "Rp 1.250.000", rating: 4.8, reviews: 89, image: "/images/bali.jpg", highlights: ["Monkey Forest", "Terasering", "Kunjungan Pura"] },
  { id: 3, title: "Jakarta Historical City Tour", location: "Jakarta", duration: "1 Hari", price: "Rp 450.000", rating: 4.7, reviews: 56, image: "/images/jakarta.jpg", highlights: ["Monumen Nasional", "Kota Tua", "Museum Nasional"] },
  { id: 4, title: "Kepulauan Seribu Weekend Getaway", location: "Jakarta", duration: "2H1M", price: "Rp 1.100.000", rating: 4.9, reviews: 210, image: "/images/jakarta.jpg", highlights: ["Resort Pulau", "Water Sports", "BBQ Dinner"] },
  { id: 5, title: "Sailing Komodo Premium Boat", location: "Labuan Bajo", duration: "3H2M", price: "Rp 3.500.000", rating: 5.0, reviews: 342, image: "/images/labuanbajo.jpg", highlights: ["Komodo Dragons", "Pulau Padar", "Pink Beach"] },
  { id: 6, title: "Labuan Bajo Sunset & Snorkeling", location: "Labuan Bajo", duration: "1 Hari", price: "Rp 1.200.000", rating: 4.8, reviews: 112, image: "/images/labuanbajo.jpg", highlights: ["Pulau Kanawa", "Manta Point", "Makan Malam"] },
  { id: 7, title: "Borobudur Sunrise & Prambanan", location: "Yogyakarta", duration: "1 Hari", price: "Rp 750.000", rating: 4.9, reviews: 421, image: "/images/yogyakarta.jpg", highlights: ["Sunrise View", "Pemandu Kuil", "Sarapan Lokal"] },
  { id: 8, title: "Lava Tour Merapi & Cave Tubing", location: "Yogyakarta", duration: "1 Hari", price: "Rp 650.000", rating: 4.8, reviews: 278, image: "/images/yogyakarta.jpg", highlights: ["Petualangan Jeep", "Goa Pindul", "Oleh-oleh Khas"] },
];

const ACCOMMODATIONS = [
  { id: 1, title: "The Edge Bali Villa", location: "Bali", type: "Villa", price: "Rp 12.500.000", rating: 5.0, reviews: 312, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop", highlights: ["Private Pool", "Ocean View", "Butler Service"] },
  { id: 2, title: "Alaya Resort Ubud", location: "Bali", type: "Resort", price: "Rp 2.850.000", rating: 4.8, reviews: 845, image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop", highlights: ["Spa & Wellness", "Rice Terrace View", "Free Breakfast"] },
  { id: 3, title: "Hotel Kempinski Jakarta", location: "Jakarta", type: "Hotel", price: "Rp 3.500.000", rating: 4.9, reviews: 1250, image: "/images/jakarta.jpg", highlights: ["City Center", "Luxury Dining", "Rooftop Pool"] },
  { id: 4, title: "Ayana Resort Komodo", location: "Labuan Bajo", type: "Resort", price: "Rp 5.200.000", rating: 4.9, reviews: 456, image: "/images/labuanbajo.jpg", highlights: ["Private Beach", "Sunset Deck", "Dive Center"] },
  { id: 5, title: "Amanjiwo Resort", location: "Yogyakarta", type: "Resort", price: "Rp 15.000.000", rating: 5.0, reviews: 210, image: "/images/yogyakarta.jpg", highlights: ["Borobudur View", "Private Pool", "Cultural Tour"] },
];

const VEHICLES = [
  { id: 1, title: "Toyota Alphard", location: "Bali", type: "Mobil Mewah", capacity: "6 Kursi", price: "Rp 2.500.000", image: "/images/layanan.jpg", highlights: ["Termasuk Supir", "BBM Termasuk", "Air Mineral"] },
  { id: 2, title: "Innova Reborn", location: "Bali", type: "Mobil Keluarga", capacity: "7 Kursi", price: "Rp 850.000", image: "/images/layanan.jpg", highlights: ["Termasuk Supir", "AC Dingin", "Bersih & Nyaman"] },
  { id: 3, title: "Honda PCX 160", location: "Bali", type: "Motor", capacity: "2 Penumpang", price: "Rp 150.000", image: "/images/layanan.jpg", highlights: ["Helm SNI", "Jas Hujan", "Kondisi Prima"] },
  { id: 4, title: "Toyota Hiace", location: "Jakarta", type: "Minibus", capacity: "14 Kursi", price: "Rp 1.500.000", image: "/images/layanan.jpg", highlights: ["Termasuk Supir", "Cocok Rombongan", "Toll Exclude"] },
  { id: 5, title: "Mitsubishi Pajero", location: "Labuan Bajo", type: "SUV", capacity: "7 Kursi", price: "Rp 1.200.000", image: "/images/layanan.jpg", highlights: ["Tangguh", "Supir Berpengalaman", "Cocok Ekspedisi"] },
  { id: 6, title: "Avanza / Xenia", location: "Yogyakarta", type: "Mobil Keluarga", capacity: "7 Kursi", price: "Rp 600.000", image: "/images/layanan.jpg", highlights: ["Supir Ramah", "BBM Termasuk", "Jelajah Kota"] },
];

export default function DestinasiPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Semua");

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const handlePackageClick = (pkg: typeof PACKAGES[0]) => {
    const waNumber = "628977857823";
    const text = `Halo tim Infinity Go,\n\nSaya tertarik untuk memesan/bertanya mengenai paket tour berikut:\n\n📌 *Paket:* ${pkg.title}\n📍 *Lokasi:* ${pkg.location}\n⏱ *Durasi:* ${pkg.duration}\n💰 *Harga:* ${pkg.price}\n\nMohon informasi ketersediaan dan detail jadwalnya. Terima kasih!`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleAccommodationClick = (acc: typeof ACCOMMODATIONS[0]) => {
    const waNumber = "628977857823";
    const text = `Halo tim Infinity Go,\n\nSaya ingin memesan/bertanya mengenai akomodasi berikut:\n\n🏨 *Nama:* ${acc.title}\n📍 *Lokasi:* ${acc.location}\n🛏 *Tipe:* ${acc.type}\n💰 *Harga:* ${acc.price}\n\nMohon informasi ketersediaan kamar. Terima kasih!`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleVehicleClick = (veh: typeof VEHICLES[0]) => {
    const waNumber = "628977857823";
    const text = `Halo tim Infinity Go,\n\nSaya ingin menyewa kendaraan berikut:\n\n🚗 *Nama:* ${veh.title}\n📍 *Lokasi:* ${veh.location}\n👥 *Kapasitas:* ${veh.capacity}\n💰 *Harga:* ${veh.price} / Hari\n\nMohon informasi ketersediaannya. Terima kasih!`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const filteredPackages = selectedCity === "Semua" 
    ? PACKAGES 
    : PACKAGES.filter(pkg => pkg.location === selectedCity);

  const filteredAccommodations = selectedCity === "Semua" 
    ? ACCOMMODATIONS 
    : ACCOMMODATIONS.filter(acc => acc.location === selectedCity);

  const filteredVehicles = selectedCity === "Semua" 
    ? VEHICLES 
    : VEHICLES.filter(veh => veh.location === selectedCity);

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
              { name: "Akomodasi", link: "/#akomodasi" },
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
                  { name: "Akomodasi", link: "/#akomodasi" },
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
            
            <div className="flex overflow-x-auto gap-3 pb-4 md:pb-0 w-full md:w-auto scrollbar-hide">
              {CITIES.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    selectedCity === city 
                      ? "bg-[#40B5AD] text-white shadow-lg shadow-[#40B5AD]/30 translate-y-[-2px]" 
                      : "bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-slate-200"
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredPackages.map((pkg) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={pkg.id}
                  onClick={() => handlePackageClick(pkg)}
                  className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1 cursor-pointer"
                >
                  {/* Image Container */}
                  <div className="relative h-56 w-full overflow-hidden">
                    <Image src={pkg.image} alt={pkg.title} fill className="object-cover transition-transform duration-700" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-white/20">
                      <MapPin size={12} className="text-[#40B5AD]" />
                      {pkg.location}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-4 mb-4 text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5"><Clock size={14} className="text-[#40B5AD]" /> {pkg.duration}</div>
                      <div className="flex items-center gap-1.5 text-amber-500"><Star size={14} fill="currentColor" /> {pkg.rating} <span className="text-slate-400 font-normal">({pkg.reviews})</span></div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-900 mb-5 leading-snug group-hover:text-[#40B5AD] transition-colors">{pkg.title}</h3>
                    
                    <div className="mb-8 space-y-3 flex-1">
                      {pkg.highlights.map((hlt, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="w-5 h-5 rounded-full bg-[#40B5AD]/10 flex items-center justify-center flex-shrink-0">
                            <Check size={12} className="text-[#40B5AD]" />
                          </div>
                          <span className="font-medium">{hlt}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Harga Paket</span>
                        <span className="font-bold text-[#40B5AD] text-xl notranslate" translate="no">{pkg.price}</span>
                      </div>
                      <button className="w-12 h-12 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                        <ArrowRight size={20} />
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
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredAccommodations.map((acc) => (
                    <motion.div
                      layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                      key={acc.id} onClick={() => handleAccommodationClick(acc)}
                      className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image src={acc.image} alt={acc.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-white/20">
                          <MapPin size={12} className="text-[#40B5AD]" /> {acc.location}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 mb-4 text-xs font-semibold text-slate-500">
                          <div className="flex items-center gap-1.5"><Home size={14} className="text-[#40B5AD]" /> {acc.type}</div>
                          <div className="flex items-center gap-1.5 text-amber-500"><Star size={14} fill="currentColor" /> {acc.rating} <span className="text-slate-400 font-normal">({acc.reviews})</span></div>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-5 leading-snug group-hover:text-[#40B5AD] transition-colors">{acc.title}</h3>
                        <div className="mb-8 space-y-3 flex-1">
                          {acc.highlights.map((hlt, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                              <div className="w-5 h-5 rounded-full bg-[#40B5AD]/10 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-[#40B5AD]" /></div>
                              <span className="font-medium">{hlt}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Mulai Dari</span>
                            <span className="font-bold text-[#40B5AD] text-xl notranslate" translate="no">{acc.price}</span>
                          </div>
                          <button className="w-12 h-12 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm"><ArrowRight size={20} /></button>
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
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AnimatePresence>
                  {filteredVehicles.map((veh) => (
                    <motion.div
                      layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                      key={veh.id} onClick={() => handleVehicleClick(veh)}
                      className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col hover:-translate-y-1 cursor-pointer"
                    >
                      <div className="relative h-56 w-full overflow-hidden">
                        <Image src={veh.image} alt={veh.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-800 flex items-center gap-1.5 shadow-sm border border-white/20">
                          <MapPin size={12} className="text-[#40B5AD]" /> {veh.location}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-4 mb-4 text-xs font-semibold text-slate-500">
                          <div className="flex items-center gap-1.5"><Car size={14} className="text-[#40B5AD]" /> {veh.type}</div>
                          <div className="flex items-center gap-1.5"><Users size={14} className="text-[#40B5AD]" /> {veh.capacity}</div>
                        </div>
                        <h3 className="font-bold text-lg text-slate-900 mb-5 leading-snug group-hover:text-[#40B5AD] transition-colors">{veh.title}</h3>
                        <div className="mb-8 space-y-3 flex-1">
                          {veh.highlights.map((hlt, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                              <div className="w-5 h-5 rounded-full bg-[#40B5AD]/10 flex items-center justify-center flex-shrink-0"><Check size={12} className="text-[#40B5AD]" /></div>
                              <span className="font-medium">{hlt}</span>
                            </div>
                          ))}
                        </div>
                        <div className="pt-5 border-t border-slate-100 flex items-center justify-between mt-auto">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider mb-0.5">Harga Sewa / Hari</span>
                            <span className="font-bold text-[#40B5AD] text-xl notranslate" translate="no">{veh.price}</span>
                          </div>
                          <button className="w-12 h-12 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm"><ArrowRight size={20} /></button>
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
