"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Check, ShieldCheck, Menu, X } from "lucide-react";
import { IconBrandX, IconBrandFacebook, IconBrandLinkedin, IconBrandInstagram, IconMapSearch, IconHome, IconCar, IconWifi, IconUsers } from "@tabler/icons-react";
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

const servicesData = [
  {
    id: "agen-tour",
    title: "Agen Tour",
    description: "Pilihan perjalanan wisata terbaik di Bali. Nikmati pengalaman liburan tanpa repot dengan paket tour lengkap kami, dipandu oleh tim profesional.",
    image: "/images/layanan.jpg",
    icon: <IconMapSearch size={28} className="text-white" />,
    features: [
      "Pemandu Profesional", "Transportasi Nyaman", 
      "Harga Kompetitif", "Jadwal Fleksibel"
    ],
    packages: ["Paket Harian (12 Jam)", "Paket Keluarga", "Paket Honeymoon", "Private Group"]
  },
  {
    id: "reservasi",
    title: "Reservasi Villa & Hotel",
    description: "Temukan akomodasi impian untuk liburan Anda. Kami bekerja sama dengan properti terbaik di Bali untuk memastikan kenyamanan Anda.",
    image: "/images/layanan.jpg",
    icon: <IconHome size={28} className="text-white" />,
    features: [
      "Harga Rate Terbaik", "Pilihan Beragam", 
      "Proses Cepat & Mudah", "Layanan Bantuan 24/7"
    ],
    packages: ["Villa Private 1-4 Kamar", "Resort Mewah", "Hotel Bintang 4 & 5", "Budget Hotel"]
  },
  {
    id: "transportasi",
    title: "Transportasi",
    description: "Solusi mobilitas yang aman dan nyaman selama di Bali. Tersedia sewa mobil dengan sopir atau lepas kunci.",
    image: "/images/layanan.jpg",
    icon: <IconCar size={28} className="text-white" />,
    features: [
      "Armada Terawat", "Sopir Berpengalaman", 
      "Asuransi Kendaraan", "Tepat Waktu"
    ],
    packages: ["Sewa Mobil Premium", "Sewa Minibus (Hiace)", "Sewa Motor", "Airport Transfer"]
  },
  {
    id: "wifi",
    title: "Wifi Portabel",
    description: "Pastikan Anda selalu terhubung dengan internet kecepatan tinggi di mana pun Anda berada selama menjelajahi Bali.",
    image: "/images/layanan.jpg",
    icon: <IconWifi size={28} className="text-white" />,
    features: [
      "Koneksi Stabil 4G/5G", "Bisa Banyak Device", 
      "Baterai Tahan Lama", "Pengiriman ke Hotel"
    ],
    packages: ["Sewa Harian", "Sewa Mingguan", "Sewa Bulanan", "Paket Rombongan"]
  },
  {
    id: "mice",
    title: "MICE",
    description: "Solusi profesional untuk kebutuhan Meeting, Incentive, Convention, dan Exhibition instansi atau perusahaan Anda di Bali.",
    image: "/images/layanan.jpg",
    icon: <IconUsers size={28} className="text-white" />,
    features: [
      "Perencanaan Matang", "Venue Representatif", 
      "Peralatan Lengkap", "Tim Eksekusi Handal"
    ],
    packages: ["Corporate Meeting", "Company Outing", "Gala Dinner", "Exhibition & Event"]
  }
];

export default function LayananPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const handleServicePackageClick = (serviceTitle: string, packageName: string) => {
    const waNumber = "628977857823";
    const text = `Halo tim Infinity Go,\n\nSaya tertarik untuk memesan/bertanya mengenai layanan berikut:\n\n🏷 *Kategori Layanan:* ${serviceTitle}\n📌 *Pilihan Paket:* ${packageName}\n\nMohon informasi lebih lanjut mengenai harga dan ketersediaannya. Terima kasih!`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

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
        <div className="relative h-[60vh] min-h-[400px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-lg">
          <Image
            src="/images/layanan.jpg"
            alt="Layanan Infinity Go"
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
              Layanan Kami
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white text-sm md:text-lg max-w-2xl mx-auto drop-shadow-md"
            >
              Solusi Perjalanan Terbaik Liburan Tak Terlupakan di Bali
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── SERVICES LIST ── */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col gap-24 md:gap-32">
            {servicesData.map((service, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={service.id} className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-10 md:gap-20 items-center`}>
                  
                  {/* Image Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7 }}
                    className="w-full md:w-1/2"
                  >
                    <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-slate-200">
                      <Image src={service.image} alt={service.title} fill className="object-cover" />
                      {/* Cyan Badge Icon (bottom left) */}
                      <div className="absolute bottom-6 left-6 w-14 h-14 bg-[#40B5AD]/90 backdrop-blur-md rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                        {service.icon}
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Side */}
                  <motion.div 
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="w-full md:w-1/2"
                  >
                    <div className="inline-block border border-[#40B5AD] text-[#40B5AD] px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-wide bg-[#40B5AD]/5">
                      Layanan Kami
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5">{service.title}</h2>
                    <p className="text-slate-500 leading-relaxed mb-8">
                      {service.description}
                    </p>

                    {/* Fitur Unggulan Box */}
                    <div className="border border-slate-100 bg-white rounded-2xl p-6 mb-8 shadow-sm">
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-full bg-[#40B5AD]/10 flex items-center justify-center text-[#40B5AD]">
                          <ShieldCheck size={18} />
                        </div>
                        <h4 className="font-bold text-slate-800 text-sm">Fitur Unggulan</h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                        {service.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <Check size={16} className="text-[#40B5AD] flex-shrink-0" />
                            <span className="text-sm text-slate-600 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Paket Tersedia Box */}
                    <div className="bg-gradient-to-br from-[#40B5AD] to-[#2c8e87] rounded-2xl p-6 shadow-lg shadow-[#40B5AD]/20">
                      <h4 className="font-bold text-white text-sm mb-5">Paket Tersedia (Klik untuk Pesan)</h4>
                      <div className="flex flex-wrap gap-3">
                        {service.packages.map((pkg, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleServicePackageClick(service.title, pkg)}
                            className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg text-xs font-semibold border border-white/10 text-white cursor-pointer hover:bg-white hover:text-[#40B5AD] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                          >
                            {pkg}
                          </div>
                        ))}
                      </div>
                    </div>

                  </motion.div>
                </div>
              );
            })}
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
                Infinity Go adalah mitra perjalanan terpercaya Anda di Bali. Layanan premium, pengalaman tak terlupakan untuk petualangan Anda.
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
