"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { MapPin, Clock, Star, Check, ArrowRight, Menu, X } from "lucide-react";
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

  const filteredPackages = selectedCity === "Semua" 
    ? PACKAGES 
    : PACKAGES.filter(pkg => pkg.location === selectedCity);

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
          <div className="flex items-center gap-4">
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
            <div className="flex flex-col gap-4 p-4">
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
                  className="text-lg font-semibold text-slate-800 hover:text-[#40B5AD] transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <NavbarButton 
                onClick={() => setIsMobileMenuOpen(false)}
                variant="gradient" 
                className="w-full text-center mt-4" 
                href="/kontak"
              >
                Pesan Sekarang
              </NavbarButton>
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
                        <span className="font-bold text-[#40B5AD] text-xl">{pkg.price}</span>
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

        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white pt-20 pb-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
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
