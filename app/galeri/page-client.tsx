"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { IconBrandX, IconBrandFacebook, IconBrandLinkedin, IconBrandInstagram, IconBrandTiktok } from "@tabler/icons-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
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
import { GalleryItem } from "@/lib/admin-data";

export default function GaleriClient({ initialGallery }: { initialGallery: GalleryItem[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeGallery = initialGallery;

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % activeGallery.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? activeGallery.length - 1 : prev - 1));
  };

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

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
        <div className="relative h-[60vh] min-h-[400px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-lg">
          <Image
            src="/images/galery.jpg"
            alt="Galeri Infinity Go"
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
              Galeri Kami
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white text-sm md:text-lg max-w-2xl mx-auto drop-shadow-md"
            >
              Potret Momen Tak Terlupakan dari Perjalanan Terbaik Bersama Infinity Go
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── GALLERY HORIZONTAL SCROLL ── */}
      <section className="py-20 md:py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[#40B5AD] text-xs font-bold tracking-widest uppercase block mb-3">Dokumentasi</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a3636] mb-4">Momen Indah Bersama Kami</h2>
            </div>
            <div className="flex items-center gap-3 pb-4">
              <button 
                onClick={() => {
                  const el = document.getElementById("gallery-slider");
                  if (el) el.scrollBy({ left: -320, behavior: "smooth" });
                }}
                className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-[#40B5AD] hover:border-[#40B5AD] transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById("gallery-slider");
                  if (el) el.scrollBy({ left: 320, behavior: "smooth" });
                }}
                className="w-12 h-12 rounded-full bg-[#40B5AD] flex items-center justify-center text-white hover:bg-[#349890] transition-all shadow-md"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Slider Container */}
          <div 
            id="gallery-slider"
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0" 
            style={{ scrollbarWidth: "none" }}
          >
            {activeGallery.map((img, i) => (
              <motion.div 
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                onClick={() => openLightbox(i)}
                className="group relative flex-shrink-0 w-[280px] md:w-[360px] aspect-[4/5] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer snap-center"
              >
                <Image
                  src={img.imageUrl || "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600"}
                  alt={img.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-bold text-lg">{img.title}</h3>
                  <p className="text-[#40B5AD] font-medium text-sm mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#40B5AD]"></span>
                    {img.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
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
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-20">
            {/* Logo & Description */}
            <div className="col-span-2 md:col-span-2 lg:col-span-3">
              <div className="flex items-center gap-2 mb-6">
                <div className="relative w-10 h-10">
                  <Image src="/images/logo.png" alt="Infinity Go" fill className="object-contain" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-slate-900">Infinity Go</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                Infinity Go adalah mitra perjalanan terpercaya Anda di Bali. Layanan premium, pengalaman tak terlupakan untuk petualangan Anda.
              </p>
            </div>

            {/* Links Columns */}
            <div className="col-span-1 lg:col-span-2">
              <h4 className="text-slate-900 font-bold mb-6">Layanan</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="/destinasi#paket" className="hover:text-[#40B5AD] transition-colors">Paket Tour</a></li>
                <li><a href="/destinasi#akomodasi" className="hover:text-[#40B5AD] transition-colors">Akomodasi</a></li>
                <li><a href="/destinasi#kendaraan" className="hover:text-[#40B5AD] transition-colors">Sewa Kendaraan</a></li>
                <li><a href="/destinasi#wifi" className="hover:text-[#40B5AD] transition-colors">Wifi Portable</a></li>
              </ul>
            </div>
            <div className="col-span-1 lg:col-span-2">
              <h4 className="text-slate-900 font-bold mb-6">Menu Utama</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="/" className="hover:text-[#40B5AD] transition-colors">Beranda</a></li>
                <li><a href="/layanan" className="hover:text-[#40B5AD] transition-colors">Layanan</a></li>
                <li><a href="/destinasi" className="hover:text-[#40B5AD] transition-colors">Destinasi</a></li>
                <li><a href="/galeri" className="hover:text-[#40B5AD] transition-colors">Galeri</a></li>
                <li><a href="/kontak" className="hover:text-[#40B5AD] transition-colors">Kontak</a></li>
              </ul>
            </div>
            <div className="col-span-1 lg:col-span-2">
              <h4 className="text-slate-900 font-bold mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-[#40B5AD] transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="/#testimoni" className="hover:text-[#40B5AD] transition-colors">Testimoni</a></li>
                <li><a href="/kontak" className="hover:text-[#40B5AD] transition-colors">Hubungi Kami</a></li>
              </ul>
            </div>

            {/* Newsletter & Socials */}
            <div className="col-span-2 md:col-span-2 lg:col-span-3 flex flex-col gap-8">
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
              <div className="flex items-center justify-center md:justify-start gap-4">
                <a href="https://www.instagram.com/go.infinity/" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-[#40B5AD] hover:text-white transition-all shadow-sm"><IconBrandInstagram size={16} /></a>
                <a href="https://www.facebook.com/8infinitygo/?locale=id_ID" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-[#40B5AD] hover:text-white transition-all shadow-sm"><IconBrandFacebook size={16} /></a>
                <a href="https://www.tiktok.com/@infinity.go6" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full border border-slate-200 text-slate-600 hover:bg-[#40B5AD] hover:text-white transition-all shadow-sm"><IconBrandTiktok size={16} /></a>
                <a href="#" onClick={(e) => e.preventDefault()} className="p-2.5 rounded-full border border-slate-200/50 text-slate-300 cursor-not-allowed opacity-40" title="Not available"><IconBrandX size={16} /></a>
                <a href="#" onClick={(e) => e.preventDefault()} className="p-2.5 rounded-full border border-slate-200/50 text-slate-300 cursor-not-allowed opacity-40" title="Not available"><IconBrandLinkedin size={16} /></a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-400 text-sm">Copyright © Infinity Go {new Date().getFullYear()}</p>
            <div className="flex items-center gap-8 text-sm text-slate-400">
              <a href="#" className="hover:text-slate-600 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="hover:text-slate-600 transition-colors">Syarat & Ketentuan</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {lightboxOpen && activeGallery.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-10"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close Button */}
            <button 
              onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}
              className="absolute top-6 right-6 z-50 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all"
            >
              <X size={24} />
            </button>
            
            {/* Left Arrow */}
            <button 
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-10 z-50 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
            >
              <ChevronLeft size={32} />
            </button>

            {/* Image Container */}
            <div 
              className="relative w-full max-w-6xl aspect-square md:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeGallery[currentIndex].imageUrl || "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600"}
                alt={activeGallery[currentIndex].title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Right Arrow */}
            <button 
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-10 z-50 text-white/50 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all"
            >
              <ChevronRight size={32} />
            </button>
            
            {/* Caption */}
            <div className="absolute bottom-8 md:bottom-12 left-0 right-0 text-center pointer-events-none">
              <h3 className="text-white font-bold text-xl md:text-2xl drop-shadow-md">{activeGallery[currentIndex].title}</h3>
              <p className="text-[#40B5AD] font-medium text-sm mt-1 drop-shadow-md">{activeGallery[currentIndex].location}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
