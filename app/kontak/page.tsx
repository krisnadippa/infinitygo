"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ChevronDown, MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
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

export default function KontakPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telepon: "",
    subjek: "",
    pesan: ""
  });

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const waNumber = "628977857823";
    const text = `Halo Infinity Go, saya ingin bertanya.\n\n*Nama:* ${formData.nama}\n*Email:* ${formData.email}\n*Telepon:* ${formData.telepon}\n*Subjek:* ${formData.subjek}\n\n*Pesan:*\n${formData.pesan}`;
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
            src="/images/contact1.jpg"
            alt="Kontak Infinity Go"
            fill 
            className="object-cover" 
            priority
            quality={100}
          />
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            >
              Hubungi Kami
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white text-sm md:text-lg max-w-2xl mx-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
            >
              Kami siap membantu merencanakan liburan impian Anda di Bali
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── CONTACT INFO CARDS ── */}
      <section className="relative z-20 py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-[#40B5AD]/10 flex items-center justify-center mb-6 text-[#40B5AD]">
              <MapPin size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Alamat</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Jl. Nuansa Udayana 1 No.5, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-[#40B5AD]/10 flex items-center justify-center mb-6 text-[#40B5AD]">
              <Phone size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Telepon</h3>
            <p className="text-lg font-semibold text-[#40B5AD] mb-1">+62 897-7857-823</p>
            <p className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">WhatsApp Available</p>
          </motion.div>

          {/* Card 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-[#40B5AD]/10 flex items-center justify-center mb-6 text-[#40B5AD]">
              <Mail size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Email</h3>
            <a href="mailto:halo@infinitygobali.com" className="text-sm text-slate-500 hover:text-[#40B5AD] transition-colors break-all">
              halo@infinitygobali.com
            </a>
          </motion.div>

          {/* Card 4 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center flex flex-col items-center hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-16 h-16 rounded-full bg-[#40B5AD]/10 flex items-center justify-center mb-6 text-[#40B5AD]">
              <Clock size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">Jam Operasional</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Senin - Jumat: 08:00 - 20:00<br/>
              Sabtu - Minggu: 09:00 - 18:00<br/>
              Emergency: 24/7
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── MAIN CONTENT (Form & Map) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-slate-100">
              <div className="inline-block bg-[#40B5AD]/10 text-[#40B5AD] px-4 py-1.5 rounded-full text-xs font-bold mb-6 tracking-wide">
                Tim Kami
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">Ada Pertanyaan?</h2>
              <p className="text-slate-500 mb-8">
                Isi formulir di bawah dan kami akan menghubungi Anda sesegera mungkin.
              </p>

              <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nama" className="block text-sm font-semibold text-slate-700 mb-2">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    id="nama"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    required
                    placeholder="Masukkan nama Anda"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/50 focus:border-[#40B5AD] transition-all bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/50 focus:border-[#40B5AD] transition-all bg-slate-50/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="telepon" className="block text-sm font-semibold text-slate-700 mb-2">Telepon *</label>
                    <input 
                      type="tel" 
                      id="telepon"
                      name="telepon"
                      value={formData.telepon}
                      onChange={handleChange}
                      required
                      placeholder="+62 823 **** ****"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/50 focus:border-[#40B5AD] transition-all bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subjek" className="block text-sm font-semibold text-slate-700 mb-2">Subjek *</label>
                  <select
                    id="subjek"
                    name="subjek"
                    value={formData.subjek}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/50 focus:border-[#40B5AD] transition-all bg-slate-50/50 text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Pilih Subjek</option>
                    <option value="Pertanyaan Paket Tour">Pertanyaan Paket Tour</option>
                    <option value="Reservasi Hotel/Villa">Reservasi Hotel/Villa</option>
                    <option value="Sewa Mobil">Sewa Mobil</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="pesan" className="block text-sm font-semibold text-slate-700 mb-2">Pesan *</label>
                  <textarea 
                    id="pesan"
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Ceritakan kepada kami tentang rencana perjalanan Anda..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/50 focus:border-[#40B5AD] transition-all bg-slate-50/50 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#52a6a5] hover:bg-[#3e8e8d] text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#52a6a5]/30 group"
                >
                  Kirim Pesan
                  <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: CTA & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp CTA */}
            <div className="bg-[#67b6b5] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20 transform translate-x-4 -translate-y-4">
                <MessageCircle size={100} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Butuh Bantuan Segera?</h3>
                <p className="text-white/80 text-sm mb-6 leading-relaxed">
                  Hubungi kami melalui WhatsApp untuk respons yang lebih cepat.
                </p>
                <a 
                  href="https://wa.me/628977857823" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#52a6a5] font-bold px-6 py-3 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <MessageCircle size={20} />
                  Chat Via WhatsApp
                </a>
              </div>
            </div>

            {/* Google Map */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex flex-col">
              <div className="h-[250px] w-full relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4060.9865130981952!2d115.18273837501617!3d-8.795020791257263!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8c71888bd5788975%3A0xfcb0f6d4a2fe8715!2sInfinity%20Go%20-%20Bali%20Indonesia%20Tour%20%26%20Travel!5e1!3m2!1sid!2sid!4v1778569669132!5m2!1sid!2sid" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={false} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-slate-800 mb-2">Kunjungi Kantor Kami</h4>
                <p className="text-sm text-slate-500 leading-relaxed flex items-start gap-2">
                  <MapPin size={16} className="text-[#40B5AD] shrink-0 mt-0.5" />
                  Jl. Nuansa Udayana 1 No.5, Jimbaran, Kec. Kuta Sel., Kabupaten Badung, Bali
                </p>
              </div>
            </div>

            {/* Jam Operasional */}
            <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock size={20} className="text-[#40B5AD]" />
                Jam Operasional
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/10 text-sm">
                  <span className="text-slate-300">Senin - Jumat</span>
                  <span className="font-semibold">08:00 - 20:00</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10 text-sm">
                  <span className="text-slate-300">Sabtu - Minggu</span>
                  <span className="font-semibold">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Emergency Support</span>
                  <span className="font-semibold text-[#40B5AD]">24/7</span>
                </div>
              </div>
            </div>

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
