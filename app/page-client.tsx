"use client";

import Image from "next/image";
import Script from "next/script";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Car, Home, Wifi, Star, Menu, X, ArrowRight, Phone, Mail, Globe, ChevronRight, Users, Calendar, ChevronDown, User, ArrowUpRight, ShoppingBag, ShoppingCart, Check, X as XIcon } from "lucide-react";
import { IconBrandX, IconBrandFacebook, IconBrandLinkedin, IconBrandInstagram, IconBrandTiktok } from "@tabler/icons-react";
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
import BundlingVoucherSection from "@/components/BundlingVoucherSection";
import { formatRupiah, TourPackage, Accommodation, Vehicle, Wifi as WifiType, Mice, Bundle } from "@/lib/admin-data";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65 } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };

export default function PageClient({ 
  accommodations, 
  vehicles,
  bundles,
  packages,
  wifis,
  mice,
  selectedCity
}: { 
  accommodations: Accommodation[], 
  vehicles: Vehicle[],
  bundles: Bundle[],
  packages: TourPackage[],
  wifis: WifiType[],
  mice: Mice[],
  selectedCity?: string
}) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleAccommodationClick = () => {
    window.location.href = "/destinasi#akomodasi";
  };

  const services = [
    { Icon: Globe,  label: "Tur & Paket",       desc: "Nikmati perjalanan tanpa beban bersama guide profesional kami di seluruh destinasi Bali.", link: "/layanan#agen-tour" },
    { Icon: Car,    label: "Sewa Kendaraan",     desc: "Armada mobil & motor terawat siap mengantar Anda menjelajahi setiap sudut Bali.", link: "/layanan#transportasi" },
    { Icon: Home,   label: "Hotel & Villa",      desc: "Pilihan akomodasi terbaik mulai dari villa private hingga resort bintang lima.", link: "/layanan#reservasi" },
    { Icon: Wifi,   label: "Wifi Portable",      desc: "Tetap terhubung di seluruh penjuru Bali dengan internet super cepat.", link: "/layanan#wifi" },
    { Icon: Users,  label: "MICE",                desc: "Solusi Meetings, Incentives, Conferences & Exhibitions profesional di Bali.", link: "/layanan#mice" },
  ];

  const destinations = [
    { name: "Pulau Bali",      tag: "Bali",        img: "/images/bali.jpg" },
    { name: "Kota Jakarta",    tag: "Jakarta",     img: "/images/jakarta.jpg" },
    { name: "Labuan Bajo",     tag: "Nusa Tenggara", img: "/images/labuanbajo.jpg" },
    { name: "Yogyakarta",      tag: "Jawa Tengah", img: "/images/yogyakarta.jpg" },
    { name: "Eksplor Lainnya", tag: "Indonesia",   img: "/images/destinasi1.jpg" },
  ];

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

  const { ref: svcRef, inView: svcIn } = useInView();
  const { ref: destRef, inView: destIn } = useInView();
  const { ref: accomRef, inView: accomIn } = useInView();
  const { ref: vehRef, inView: vehIn } = useInView();

  return (
    <div className="min-h-screen bg-white text-slate-800">

      {/* ── NAVBAR ── */}
      <Navbar className="top-0">
        <NavBody className="max-w-[1400px]">
          <NavbarLogo scrolled={scrolled} />
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

      {/* ── HERO ── */}
      <section className="relative pt-12 md:pt-16 px-4 md:px-6 pb-6">
        <div className="relative h-[85vh] min-h-[600px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden">
          <Image
            src="/images/hero11.jpg"
            alt="Infinity Go Travel"
            fill className="object-cover" priority
            unoptimized
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-4xl">
            {/* Top Badge Button */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="mb-8 self-start"
            >
              <a href="/destinasi" className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-all group shadow-2xl">
                <span className="bg-[#40B5AD] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">NEW</span>
                <span className="text-white text-xs font-semibold flex items-center gap-2">
                  Choose your destination <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </a>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-7xl font-bold text-white leading-[1.1] mb-6"
            >
              Discover The World In<br />Luxury And Style.
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
              className="text-slate-200 text-base md:text-lg max-w-xl font-light leading-relaxed mb-10"
            >
              Tailored luxury travel experiences crafted exclusively for discerning adventurers seeking unparalleled journeys worldwide.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a href="/kontak" className="group bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-sm flex items-center gap-3 hover:bg-[#40B5AD] hover:text-white transition-all shadow-xl">
                Plan Your Journey 
                <span className="bg-slate-900 text-white group-hover:bg-white group-hover:text-slate-900 p-1.5 rounded-full transition-colors">
                  <ArrowUpRight size={14} />
                </span>
              </a>
              <a href="/destinasi" className="group bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm flex items-center gap-3 hover:bg-white/20 transition-all">
                Explore Destinations
                <span className="bg-white/20 group-hover:bg-white group-hover:text-slate-900 p-1.5 rounded-full transition-colors">
                  <ArrowUpRight size={14} />
                </span>
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BUNDLING VOUCHERS SECTION (PROMO) ── */}
      {bundles && bundles.length > 0 && (
        <section id="promo" className="pt-8 pb-20 md:pb-28 bg-white relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-1/3 h-[400px] bg-gradient-to-b from-teal-50/50 to-transparent -z-10 rounded-bl-[100px]" />
          
          <div className="max-w-7xl mx-auto px-5 md:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <span className="text-[#40B5AD] text-xs font-bold tracking-widest uppercase block mb-3 flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#40B5AD] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#40B5AD]"></span>
                  </span>
                  Penawaran Terbatas
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-[#1a3636] leading-tight">Promo Spesial<br />Bundling Package</h2>
              </div>
              <div className="flex flex-col md:items-end gap-3">
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Nikmati perjalanan lebih hemat dengan paket bundling layanan lengkap dari kami.</p>
                <a href="/destinasi" className="inline-flex items-center gap-2 mt-2 text-[#40B5AD] font-semibold text-sm hover:gap-3 transition-all">
                  Lihat Semua Promo <ArrowRight size={16} />
                </a>
              </div>
            </div>

            <BundlingVoucherSection 
              bundles={bundles}
              packages={packages}
              accommodations={accommodations}
              vehicles={vehicles}
              wifis={wifis}
              mice={mice}
              selectedCity={selectedCity}
              hideHeader={true}
            />
          </div>
        </section>
      )}

      {/* ── LAYANAN ── */}
      <section id="layanan" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="grid md:grid-cols-2 gap-10 items-start mb-16">
            <div>
              <span className="text-[#40B5AD] text-xs font-bold tracking-widest uppercase block mb-3">Layanan Kami</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a3636] leading-tight">Layanan Terlengkap<br />untuk Liburan Anda</h2>
            </div>
            <div className="md:pt-10">
              <p className="text-slate-500 leading-relaxed">Kami menyediakan layanan lengkap mulai dari tur, transportasi, akomodasi hingga wifi portable. Semua untuk memastikan liburan Anda sempurna dan tak terlupakan di Bali.</p>
              <a href="/layanan" className="inline-flex items-center gap-2 mt-5 text-[#40B5AD] font-semibold text-sm hover:gap-3 transition-all">
                Lihat Semua Layanan <ArrowRight size={16} />
              </a>
            </div>
          </div>

          <motion.div ref={svcRef as React.RefObject<HTMLDivElement>} variants={stagger} initial="hidden" animate={svcIn ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {services.map(({ Icon, label, desc, link }) => (
              <a key={label} href={link}>
                <motion.div variants={fadeUp}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full">
                  <div className="w-12 h-12 rounded-xl bg-[#40B5AD]/10 flex items-center justify-center mb-5 group-hover:bg-[#40B5AD] transition-colors">
                    <Icon size={22} className="text-[#40B5AD] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 text-sm">{label}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                </motion.div>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── DESTINASI ── */}
      <section id="destinasi" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[#40B5AD] text-xs font-bold tracking-widest uppercase block mb-3">Destinasi Populer</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a3636]">Tempat Wisata<br />Terfavorit</h2>
            </div>
            <div className="flex flex-col md:items-end gap-3">
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Jelajahi keindahan Indonesia—dari pesona magis Bali hingga kemegahan bersejarah Yogyakarta.</p>
              <a href="/destinasi" className="inline-flex items-center gap-1.5 text-[#40B5AD] text-sm font-semibold hover:gap-3 transition-all">
                Lihat Semua Paket <ChevronRight size={16} />
              </a>
            </div>
          </div>

          <motion.div ref={destRef as React.RefObject<HTMLDivElement>} variants={stagger} initial="hidden" animate={destIn ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {destinations.map(({ name, tag, img }, i) => (
              <a key={name} href="/destinasi">
                <motion.div variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer h-80 md:h-[440px]">
                  <Image src={img} alt={name} fill className="object-cover transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <span className="text-[#40B5AD] text-xs font-semibold uppercase tracking-wider">{tag}</span>
                    <h3 className="text-white text-xl font-bold mt-1 group-hover:text-[#40B5AD] transition-colors">{name}</h3>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-[#40B5AD] text-white text-xs px-3 py-1.5 rounded-full font-semibold">Jelajahi</div>
                  </div>
                </motion.div>
              </a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── AKOMODASI ── */}
      <section id="akomodasi" className="py-20 md:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[#40B5AD] text-xs font-bold tracking-widest uppercase block mb-3">Penginapan Pilihan</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a3636]">Akomodasi Terbaik</h2>
            </div>
            <div className="flex flex-col md:items-end gap-3">
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Temukan penginapan terbaik untuk melengkapi liburan Anda, mulai dari villa mewah hingga resort indah.</p>
              <a href="/destinasi#akomodasi" className="inline-flex items-center gap-1.5 text-[#40B5AD] text-sm font-semibold hover:gap-3 transition-all">
                Lihat Semua Akomodasi <ChevronRight size={16} />
              </a>
            </div>
          </div>

          <motion.div ref={accomRef as React.RefObject<HTMLDivElement>} variants={stagger} initial="hidden" animate={accomIn ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {accommodations.map((acc) => (
              <motion.div
                variants={fadeUp}
                key={acc.id} 
                onClick={handleAccommodationClick}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col sm:flex-row hover:-translate-y-1"
              >
                <div className="relative h-48 sm:h-auto sm:w-36 flex-shrink-0">
                  <Image src={(acc.imageUrl ? acc.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600"} alt={acc.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 144px" />
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
                      <p className="text-[13px] font-bold text-[#40B5AD] notranslate" translate="no">{formatRupiah(acc.pricePerNight)}</p>
                      <p className="text-[10.5px] text-slate-400">per malam</p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-28 flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-[#40B5AD] text-xs font-bold tracking-widest uppercase block mb-3">Sewa Kendaraan</span>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1a3636]">Kendaraan Pilihan</h2>
            </div>
            <div className="flex flex-col md:items-end gap-3">
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Armada kendaraan terawat untuk mobilitas Anda di berbagai destinasi, aman dan nyaman.</p>
              <a href="/destinasi#kendaraan" className="inline-flex items-center gap-1.5 text-[#40B5AD] text-sm font-semibold hover:gap-3 transition-all">
                Lihat Semua Kendaraan <ChevronRight size={16} />
              </a>
            </div>
          </div>

          <motion.div ref={vehRef as React.RefObject<HTMLDivElement>} variants={stagger} initial="hidden" animate={vehIn ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {vehicles.map((veh) => (
              <motion.div
                variants={fadeUp}
                key={veh.id}
                onClick={() => { window.location.href = "/destinasi#kendaraan" }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
              >
                <div className="relative h-44 w-full flex-shrink-0">
                  <Image src={(veh.imageUrl ? veh.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600"} alt={veh.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div className="p-4 space-y-2.5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-[14px] font-semibold text-slate-800 leading-tight group-hover:text-[#40B5AD] transition-colors">{veh.name}</h3>
                      <p className="text-[11.5px] text-slate-500 mt-0.5 font-medium">{veh.brand}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[12px] text-slate-500">
                    <span className="flex items-center gap-1"><MapPin size={12} className="text-[#40B5AD]" /> <span className="line-clamp-1">{veh.locations ? veh.locations.join(", ") : "Bali"}</span></span>
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
                      <p className="text-[15px] font-bold text-[#40B5AD] notranslate" translate="no">{formatRupiah(veh.pricePerDay)}</p>
                      <p className="text-[10.5px] text-slate-400">per hari</p>
                    </div>
                    <button className="w-8 h-8 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONI ── */}
      <section id="testimoni" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-8">
            <span className="text-[#40B5AD] text-xs font-bold tracking-widest uppercase block">Testimoni</span>
          </div>

          {/* Elfsight Google Reviews Widget */}
          <div className="w-full" style={{ touchAction: "pan-y" }}>
            <div className="elfsight-app-1904e8ff-14c3-4052-b91d-4b4d7c5ee6dd" data-elfsight-app-lazy></div>
          </div>
          
          <Script src="https://elfsightcdn.com/platform.js" strategy="afterInteractive" />
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-4 md:px-6 mb-16" style={{ touchAction: "pan-y" }}>
        <div className="relative h-[400px] md:h-[500px] w-full rounded-[2.5rem] overflow-hidden group">
          <Image
            src="/images/contact.jpg"
            alt="Nature Journey"
            fill className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight"
            >
              Get Ready Your Thrilling<br />Journey Into Nature Today
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="text-white/90 text-sm md:text-lg mb-10 max-w-2xl font-light"
            >
              Excited to plan your next adventure? Let's explore details to make it an unforgettable experience!
            </motion.p>
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-sm hover:bg-[#40B5AD] hover:text-white transition-all shadow-xl"
            >
              Get Started Now
            </motion.button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white pt-20 pb-6 relative overflow-hidden" style={{ touchAction: "pan-y" }}>
        {/* Giant Faded Background Text Watermark */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center items-end select-none pointer-events-none z-0 w-full">
          <span className="text-[14vw] font-black tracking-tight bg-gradient-to-b from-slate-900/[0.08] via-slate-900/[0.04] to-slate-900/[0.01] bg-clip-text text-transparent leading-[0.8] whitespace-nowrap pointer-events-none select-none">
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
    </div>
  );
}
