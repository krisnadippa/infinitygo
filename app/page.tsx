"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Car, Home, Wifi, Star, Menu, X, ArrowRight, Phone, Mail, Globe, ChevronRight, Users, Calendar, ChevronDown, User, ArrowUpRight, ShoppingBag, ShoppingCart } from "lucide-react";
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

const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } } };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } };

export default function Page() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const services = [
    { Icon: Globe,  label: "Tur & Paket",       desc: "Nikmati perjalanan tanpa beban bersama guide profesional kami di seluruh destinasi Bali." },
    { Icon: Car,    label: "Sewa Kendaraan",     desc: "Armada mobil & motor terawat siap mengantar Anda menjelajahi setiap sudut Bali." },
    { Icon: Home,   label: "Hotel & Villa",      desc: "Pilihan akomodasi terbaik mulai dari villa private hingga resort bintang lima." },
    { Icon: Wifi,   label: "Wifi Portable",      desc: "Tetap terhubung di seluruh penjuru Bali dengan internet super cepat." },
    { Icon: Users,  label: "MICE",                desc: "Solusi Meetings, Incentives, Conferences & Exhibitions profesional di Bali." },
  ];

  const destinations = [
    { name: "Pulau Bali",      tag: "Bali",        img: "/images/bali.jpg" },
    { name: "Kota Jakarta",    tag: "Jakarta",     img: "/images/jakarta.jpg" },
    { name: "Labuan Bajo",     tag: "Nusa Tenggara", img: "/images/labuanbajo.jpg" },
    { name: "Yogyakarta",      tag: "Jawa Tengah", img: "/images/yogyakarta.jpg" },
    { name: "Eksplor Lainnya", tag: "Indonesia",   img: "/images/destinasi1.jpg" },
  ];

  const accommodations = [
    { name: "Alaya Resort",    cat: "Villa Private",  img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800&auto=format&fit=crop" },
    { name: "Hanging Gardens", cat: "Jungle Resort",  img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop" },
    { name: "The Layar",       cat: "Beachfront",     img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop" },
  ];

  const testimonials = [
    { name: "Sarah Andini",    role: "Jakarta",   stars: 5, text: "Pengalaman luar biasa! Tim Infinity Go sangat profesional dalam mengatur jadwal wisata kami." },
    { name: "Budi Santoso",    role: "Surabaya",  stars: 5, text: "Sewa kendaraannya sangat mudah dan kondisinya prima. Pasti akan menggunakan jasa ini lagi!" },
    { name: "Diana Pratiwi",   role: "Bandung",   stars: 5, text: "Villa yang direkomendasikan sangat indah dan sesuai ekspektasi. Terima kasih Infinity Go!" },
    { name: "Andi Rahmat",     role: "Medan",     stars: 4, text: "Pelayanan sangat ramah dan responsif. Liburan keluarga kami menjadi sangat berkesan." },
    { name: "Maya Kusuma",     role: "Semarang",  stars: 5, text: "Guide kami sangat berpengetahuan tentang budaya Bali. Sangat direkomendasikan!" },
    { name: "Reza Firmansyah", role: "Yogyakarta",stars: 4, text: "Proses booking mudah dan transparan, tidak ada biaya tersembunyi. Sangat memuaskan." },
  ];

  const navLinks = ["Layanan", "Destinasi", "Akomodasi", "Testimoni", "Kontak"];

  const { ref: svcRef, inView: svcIn } = useInView();
  const { ref: destRef, inView: destIn } = useInView();
  const { ref: accomRef, inView: accomIn } = useInView();
  const { ref: testiRef, inView: testiIn } = useInView();

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

      {/* ── HERO ── */}
      <section className="relative pt-12 md:pt-16 px-4 md:px-6 pb-6">
        <div className="relative h-[85vh] min-h-[600px] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden">
          <Image
            src="/images/hero.png"
            alt="Infinity Go Travel"
            fill className="object-cover" priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-20 max-w-4xl">
            {/* Top Badge Button */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
              className="mb-8 self-start"
            >
              <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full cursor-pointer hover:bg-white/20 transition-all group shadow-2xl">
                <span className="bg-[#40B5AD] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">NEW</span>
                <span className="text-white text-xs font-semibold flex items-center gap-2">
                  Choose your destination <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </div>
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
              <button className="group bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-sm flex items-center gap-3 hover:bg-[#40B5AD] hover:text-white transition-all shadow-xl">
                Plan Your Journey 
                <span className="bg-slate-900 text-white group-hover:bg-white group-hover:text-slate-900 p-1.5 rounded-full transition-colors">
                  <ArrowUpRight size={14} />
                </span>
              </button>
              <button className="group bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm flex items-center gap-3 hover:bg-white/20 transition-all">
                Explore Destinations
                <span className="bg-white/20 group-hover:bg-white group-hover:text-slate-900 p-1.5 rounded-full transition-colors">
                  <ArrowUpRight size={14} />
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

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
            {services.map(({ Icon, label, desc }) => (
              <a key={label} href="/layanan">
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
          <div className="text-center mb-12">
            <span className="text-[#40B5AD] text-xs font-bold tracking-widest uppercase block mb-3">Penginapan Pilihan</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3636] mb-4">Akomodasi Terbaik di Bali</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Temukan rumah kedua Anda di Bali. Kami menghadirkan villa private, resort mewah, dan hotel berbintang dengan harga terbaik.
            </p>
          </div>

          <motion.div ref={accomRef as React.RefObject<HTMLDivElement>} variants={stagger} initial="hidden" animate={accomIn ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accommodations.map(({ name, cat, img }) => (
              <motion.div key={name} variants={fadeUp} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100">
                <div className="relative h-56 overflow-hidden">
                  <Image src={img} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute top-3 left-3">
                    <span className="bg-white/90 backdrop-blur-sm text-[#1a3636] text-xs font-bold px-3 py-1.5 rounded-full">{cat}</span>
                  </div>
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800">{name}</h3>
                    <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1"><MapPin size={11} /> Bali, Indonesia</p>
                  </div>
                  <a href="/kontak" className="bg-[#40B5AD]/10 hover:bg-[#40B5AD] text-[#40B5AD] hover:text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">
                    Pesan
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONI ── */}
      <section id="testimoni" className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="text-center mb-12">
            <span className="text-[#40B5AD] text-xs font-bold tracking-widest uppercase block mb-3">Testimoni</span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a3636] mb-4">Apa Kata Wisatawan</h2>
            <p className="text-slate-500 max-w-lg mx-auto text-sm leading-relaxed">Ribuan wisatawan telah mempercayakan liburan impian mereka kepada Infinity Go.</p>
          </div>

          <motion.div ref={testiRef as React.RefObject<HTMLDivElement>} variants={stagger} initial="hidden" animate={testiIn ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, stars, text }) => (
              <motion.div key={name} variants={fadeUp} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: stars }).map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
                  {Array.from({ length: 5 - stars }).map((_, i) => <Star key={i} size={14} className="text-slate-200 fill-slate-200" />)}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">&ldquo;{text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#40B5AD]/20 flex items-center justify-center text-[#40B5AD] font-bold text-sm flex-shrink-0">{name[0]}</div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{name}</p>
                    <p className="text-slate-400 text-xs">{role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-4 md:px-6 mb-16">
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
      <footer className="bg-white pt-20 pb-10">
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
