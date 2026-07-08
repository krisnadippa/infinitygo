"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { MapPin, Clock, Star, Check, ArrowRight, Menu, Home, Car, Users, X as XIcon, Wifi as WifiIcon, Snowflake, Coffee, Bath, Wind, Tv, Shield, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
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

const CITIES = ["Semua", "Bali", "Jakarta", "Labuan Bajo", "Yogyakarta", "Malang", "Malaysia", "China", "Vietnam", "Thailand"];
import { formatRupiah, TourPackage, Accommodation, Vehicle, Wifi, Mice, Bundle } from "@/lib/admin-data";

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

const getFacilityIcon = (facilityName: string) => {
  const name = facilityName.toLowerCase();
  if (name.includes("wifi") || name.includes("internet")) return <WifiIcon size={16} className="text-[#40B5AD] flex-shrink-0" />;
  if (name.includes("ac") || name.includes("air cond") || name.includes("pendingin")) return <Snowflake size={16} className="text-[#40B5AD] flex-shrink-0" />;
  if (name.includes("breakfast") || name.includes("sarapan") || name.includes("makan") || name.includes("snack") || name.includes("kuliner") || name.includes("kopi")) return <Coffee size={16} className="text-[#40B5AD] flex-shrink-0" />;
  if (name.includes("shower") || name.includes("kamar mandi") || name.includes("bath") || name.includes("air hangat") || name.includes("toilet")) return <Bath size={16} className="text-[#40B5AD] flex-shrink-0" />;
  if (name.includes("hairdryer") || name.includes("hair dryer") || name.includes("pengering")) return <Wind size={16} className="text-[#40B5AD] flex-shrink-0" />;
  if (name.includes("tv") || name.includes("televisi") || name.includes("hiburan")) return <Tv size={16} className="text-[#40B5AD] flex-shrink-0" />;
  if (name.includes("safe") || name.includes("brankas") || name.includes("keamanan") || name.includes("guard") || name.includes("supir") || name.includes("driver")) return <Shield size={16} className="text-[#40B5AD] flex-shrink-0" />;
  return null;
};

export default function DestinasiClient({
  initialPackages,
  initialAccommodations,
  initialVehicles,
  initialWifis,
  initialMice,
  initialBundles
}: {
  initialPackages: TourPackage[];
  initialAccommodations: Accommodation[];
  initialVehicles: Vehicle[];
  initialWifis: Wifi[];
  initialMice: Mice[];
  initialBundles: Bundle[];
}) {
  const [packages] = useState<TourPackage[]>(initialPackages);
  const [accommodations] = useState<Accommodation[]>(initialAccommodations);
  const [vehicles] = useState<Vehicle[]>(initialVehicles);
  const [wifis] = useState<Wifi[]>(initialWifis);
  const [mice] = useState<Mice[]>(initialMice);
  const [bundles] = useState<Bundle[]>(initialBundles);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedCity, setSelectedCity] = useState("Semua");
  const [selectedItem, setSelectedItem] = useState<{
    type: "package" | "accommodation" | "vehicle" | "wifi" | "mice" | "bundle";
    data: any;
  } | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [selectedVehLocation, setSelectedVehLocation] = useState<string>("");
  const [selectedDriverOption, setSelectedDriverOption] = useState<"self" | "driver">("self");

  const [bookingStartDate, setBookingStartDate] = useState<string>("");
  const [bookingEndDate, setBookingEndDate] = useState<string>("");
  const [bookingGuests, setBookingGuests] = useState<number | "">(1);

  useEffect(() => {
    setBookingStartDate("");
    setBookingEndDate("");
    setBookingGuests(1);
    setActiveImageIndex(0);
  }, [selectedItem]);

  const getVehiclePriceDetails = (veh: any, loc: string, option: "self" | "driver") => {
    let settings: any[] = [];
    try {
      settings = typeof veh.priceSettings === 'string' ? JSON.parse(veh.priceSettings) : (veh.priceSettings || []);
    } catch(e) {}
    
    const setting = settings.find((s: any) => s.location === loc);
    if (setting) {
      const basePrice = option === "driver" ? setting.priceWithDriver : setting.priceSelfDrive;
      const discount = setting.discount !== undefined ? setting.discount : (veh.discount || 0);
      return { basePrice: basePrice || veh.pricePerDay || 0, discount };
    }
    return { basePrice: veh.pricePerDay || 0, discount: veh.discount || 0 };
  };

  const getVehicleCardPriceDetails = (veh: any) => {
    let settings: any[] = [];
    try {
      settings = typeof veh.priceSettings === 'string' ? JSON.parse(veh.priceSettings) : (veh.priceSettings || []);
    } catch(e) {}
    
    let basePrice = veh.pricePerDay || 0;
    let discount = veh.discount || 0;
    
    if (selectedCity !== "Semua") {
      const setting = settings.find((s: any) => s.location === selectedCity);
      if (setting) {
        basePrice = setting.priceSelfDrive || setting.priceWithDriver || veh.pricePerDay || 0;
        discount = setting.discount !== undefined ? setting.discount : (veh.discount || 0);
      }
    } else {
      if (settings.length > 0) {
        let lowestDiscounted = Infinity;
        let bestSetting = null;
        for (const s of settings) {
          const disc = s.discount !== undefined ? s.discount : (veh.discount || 0);
          const pSelf = s.priceSelfDrive ? s.priceSelfDrive - (s.priceSelfDrive * disc / 100) : Infinity;
          const pDriver = s.priceWithDriver ? s.priceWithDriver - (s.priceWithDriver * disc / 100) : Infinity;
          const minP = Math.min(pSelf, pDriver);
          if (minP < lowestDiscounted) {
            lowestDiscounted = minP;
            bestSetting = { base: s.priceSelfDrive || s.priceWithDriver || veh.pricePerDay || 0, discount: disc };
          }
        }
        if (bestSetting) {
          basePrice = bestSetting.base;
          discount = bestSetting.discount;
        }
      }
    }
    
    return { basePrice, discount };
  };

  const getWifiPriceDetails = (wifi: any, loc: string) => {
    let settings: any[] = [];
    try {
      settings = typeof wifi.priceSettings === 'string' ? JSON.parse(wifi.priceSettings) : (wifi.priceSettings || []);
    } catch(e) {}
    
    const setting = settings.find((s: any) => s.location === loc);
    if (setting) {
      const basePrice = setting.price;
      const discount = setting.discount !== undefined ? setting.discount : (wifi.discount || 0);
      return { basePrice: basePrice || wifi.price || 0, discount };
    }
    return { basePrice: wifi.price || 0, discount: wifi.discount || 0 };
  };

  const getWifiCardPriceDetails = (wifi: any) => {
    let settings: any[] = [];
    try {
      settings = typeof wifi.priceSettings === 'string' ? JSON.parse(wifi.priceSettings) : (wifi.priceSettings || []);
    } catch(e) {}
    
    let basePrice = wifi.price || 0;
    let discount = wifi.discount || 0;
    
    if (selectedCity !== "Semua") {
      const setting = settings.find((s: any) => s.location === selectedCity);
      if (setting) {
        basePrice = setting.price || wifi.price || 0;
        discount = setting.discount !== undefined ? setting.discount : (wifi.discount || 0);
      }
    } else {
      if (settings.length > 0) {
        let lowestDiscounted = Infinity;
        let bestSetting = null;
        for (const s of settings) {
          const disc = s.discount !== undefined ? s.discount : (wifi.discount || 0);
          const p = s.price ? s.price - (s.price * disc / 100) : Infinity;
          if (p < lowestDiscounted) {
            lowestDiscounted = p;
            bestSetting = { base: s.price || wifi.price || 0, discount: disc };
          }
        }
        if (bestSetting) {
          basePrice = bestSetting.base;
          discount = bestSetting.discount;
        }
      }
    }
    
    return { basePrice, discount };
  };


  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedItem]);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 50);
  });

  useEffect(() => {
    if (window.location.hash) {
      const id = decodeURIComponent(window.location.hash.substring(1));
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500); // 500ms delay to ensure elements are fully rendered/mounted
    }
  }, []);

  const handlePackageClick = (pkg: TourPackage) => {
    setSelectedItem({ type: "package", data: pkg });
  };

  const handleBundleClick = (bundle: Bundle) => {
    setSelectedItem({ type: "bundle", data: bundle });
  };

  const handleAccommodationClick = (acc: Accommodation) => {
    setSelectedItem({ type: "accommodation", data: acc });
  };

  const handleVehicleClick = (veh: Vehicle) => {
    setSelectedItem({ type: "vehicle", data: veh });
    
    let settings: any[] = [];
    try {
      settings = typeof veh.priceSettings === 'string' ? JSON.parse(veh.priceSettings) : (veh.priceSettings || []);
    } catch(e) {}
    
    const activeLocs = (veh.locations || []).filter((loc: string) => {
      const setting = settings.find((s: any) => s.location === loc);
      return setting ? setting.isActive !== false : true;
    });

    const hasCurrentCity = activeLocs.includes(selectedCity);
    setSelectedVehLocation(hasCurrentCity ? selectedCity : (activeLocs[0] || "Bali"));
    setSelectedDriverOption("self");
  };

  const handleWifiClick = (wifi: Wifi) => {
    setSelectedItem({ type: "wifi", data: wifi });
    
    let settings: any[] = [];
    try {
      settings = typeof wifi.priceSettings === 'string' ? JSON.parse(wifi.priceSettings) : (wifi.priceSettings || []);
    } catch(e) {}
    
    const activeLocs = (wifi.locations || []).filter((loc: string) => {
      const setting = settings.find((s: any) => s.location === loc);
      return setting ? setting.isActive !== false : true;
    });

    const hasCurrentCity = activeLocs.includes(selectedCity);
    setSelectedVehLocation(hasCurrentCity ? selectedCity : (activeLocs[0] || "Bali"));
  };

  const handleMiceClick = (miceItem: Mice) => {
    setSelectedItem({ type: "mice", data: miceItem });
  };

  const matchesCity = (location: string, city: string) => {
    if (city === "Semua") return true;
    const l = location.toLowerCase();
    const c = city.toLowerCase();
    if (l.includes(c)) return true;
    if (city === "Bali" && (l.includes("ubud") || l.includes("kuta") || l.includes("seminyak") || l.includes("badung") || l.includes("gianyar") || l.includes("nusa dua") || l.includes("singaraja") || l.includes("lovina") || l.includes("bedugul"))) return true;
    return false;
  };

  const isVehicleActiveInCity = (veh: any, city: string) => {
    if (veh.status === "Inactive") return false;
    let settings: any[] = [];
    try {
      settings = typeof veh.priceSettings === 'string' ? JSON.parse(veh.priceSettings) : (veh.priceSettings || []);
    } catch(e) {}

    if (city === "Semua") {
      if (settings.length === 0) return (veh.locations || []).length > 0;
      return settings.some((s: any) => s.isActive !== false);
    }

    const setting = settings.find((s: any) => s.location === city);
    if (setting) {
      return setting.isActive !== false;
    }
    return (veh.locations || []).includes(city);
  };

  const isWifiActiveInCity = (wifi: any, city: string) => {
    if (wifi.status === "Inactive") return false;
    let settings: any[] = [];
    try {
      settings = typeof wifi.priceSettings === 'string' ? JSON.parse(wifi.priceSettings) : (wifi.priceSettings || []);
    } catch(e) {}

    if (city === "Semua") {
      if (settings.length === 0) return (wifi.locations || []).length > 0;
      return settings.some((s: any) => s.isActive !== false);
    }

    const setting = settings.find((s: any) => s.location === city);
    if (setting) {
      return setting.isActive !== false;
    }
    return (wifi.locations || []).includes(city);
  };

  const filteredPackages = packages.filter(pkg => matchesCity(pkg.location, selectedCity));
  const filteredAccommodations = accommodations.filter(acc => matchesCity(acc.location, selectedCity));
  const filteredVehicles = vehicles.filter(veh => 
    veh.status === "Active" &&
    (selectedCity === "Semua" || (veh.locations || []).some(loc => matchesCity(loc, selectedCity))) &&
    isVehicleActiveInCity(veh, selectedCity)
  );
  const filteredWifis = wifis.filter(wifi => 
    wifi.status === "Active" &&
    (selectedCity === "Semua" || (wifi.locations || []).some(loc => matchesCity(loc, selectedCity))) &&
    isWifiActiveInCity(wifi, selectedCity)
  );
  const filteredMice = mice.filter(m => matchesCity(m.location, selectedCity));
  const filteredBundles = bundles.filter(b => selectedCity === "Semua" || (b.locations || []).some(loc => matchesCity(loc, selectedCity)));

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
      <section id="paket-tour" className="py-16 md:py-24 bg-slate-50 scroll-mt-28">
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
                  translate="no"
                  className={`notranslate px-5 py-2 rounded-full text-[13.5px] font-semibold whitespace-nowrap transition-all duration-300 ${
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

          {/* ── BUNDLING VOUCHERS SECTION (PROMO) ── */}
          {filteredBundles.length > 0 && (
            <div className="mb-20">
              <BundlingVoucherSection 
                bundles={bundles}
                packages={packages}
                accommodations={accommodations}
                vehicles={vehicles}
                wifis={wifis}
                mice={mice}
                selectedCity={selectedCity}
                onBundleClick={handleBundleClick}
              />
            </div>
          )}

          {/* Packages Grid */}
          <motion.div 
            layout
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5"
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
                  <div className="relative h-28 sm:h-44 w-full flex-shrink-0">
                    <Image
                      src={(pkg.imageUrl ? pkg.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600"}
                      alt={pkg.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-3 sm:p-4 space-y-2 flex flex-col flex-1">
                    <h3 className="text-[13px] sm:text-[14px] font-semibold text-slate-800 leading-tight group-hover:text-[#40B5AD] transition-colors line-clamp-2">{pkg.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-[11px] sm:text-[12px] text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={11} className="text-[#40B5AD]" /> <span className="line-clamp-1">{pkg.location}</span></span>
                      <span className="flex items-center gap-1 flex-shrink-0"><Clock size={11} className="text-[#40B5AD]" /> {pkg.duration}</span>
                    </div>
                    <p className="text-[11.5px] sm:text-[12.5px] text-slate-500 line-clamp-2">{pkg.description}</p>
                    <div className="hidden sm:flex flex-wrap gap-1.5 flex-1 content-start">
                      {pkg.facilities.slice(0, 3).map((f) => (
                        <span key={f} className="text-[11px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full border border-blue-100">{f}</span>
                      ))}
                      {pkg.facilities.length > 3 && (
                        <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                          +{pkg.facilities.length - 3} lainnya
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 border-t border-slate-100 mt-auto gap-1">
                      <div className="flex flex-col">
                        {(pkg.discount || 0) > 0 && (
                          <span className="text-[11px] sm:text-[12px] text-slate-400 line-through">
                            {formatRupiah(pkg.price)}
                          </span>
                        )}
                        <p className="text-[13px] sm:text-[15px] font-bold text-[#40B5AD] notranslate flex flex-wrap items-center gap-1" translate="no">
                          {formatRupiah(pkg.price - (pkg.price * (pkg.discount || 0) / 100))}
                          {(pkg.discount || 0) > 0 && (
                            <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">
                              -{pkg.discount}%
                            </span>
                          )}
                        </p>
                      </div>
                      <button className="hidden sm:flex w-8 h-8 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white items-center justify-center transition-all shadow-sm">
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
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5">
                <AnimatePresence>
                  {filteredAccommodations.map((acc) => (
                    <motion.div
                      layout="position" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                      key={acc.id} onClick={() => handleAccommodationClick(acc)}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col sm:flex-row hover:-translate-y-1"
                    >
                      <div className="relative h-28 sm:h-auto sm:w-36 flex-shrink-0">
                        <Image src={(acc.imageUrl ? acc.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600"} alt={acc.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 144px" />
                      </div>
                      <div className="p-3 sm:p-4 flex-1 flex flex-col space-y-2">
                        <h3 className="text-[13px] sm:text-[14px] font-semibold text-slate-800 leading-tight group-hover:text-[#40B5AD] transition-colors line-clamp-2">{acc.name}</h3>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2">
                          <span className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full border font-medium w-fit ${typeBadgeColors[acc.type]}`}>{acc.type}</span>
                          <span className="flex items-center gap-1 text-[11px] sm:text-[12px] text-slate-400"><MapPin size={11} className="text-[#40B5AD]" /> <span className="line-clamp-1">{acc.location}</span></span>
                        </div>
                        <p className="text-[11.5px] sm:text-[12px] text-slate-500 line-clamp-2">{acc.description}</p>
                        <div className="hidden sm:flex flex-wrap gap-1 flex-1 content-start">
                          {acc.facilities.slice(0, 3).map((f) => <span key={f} className="text-[10.5px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{f}</span>)}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 border-t border-slate-100 mt-auto gap-1">
                          <div>
                            {(acc.discount || 0) > 0 && (
                              <span className="text-[11px] sm:text-[12px] text-slate-400 line-through">
                                {formatRupiah(acc.pricePerNight)}
                              </span>
                            )}
                            <p className="text-[13px] sm:text-[14px] font-bold text-[#40B5AD] notranslate flex flex-wrap items-center gap-1" translate="no">
                              {formatRupiah(acc.pricePerNight - (acc.pricePerNight * (acc.discount || 0) / 100))}
                              {(acc.discount || 0) > 0 && (
                                <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded-full font-semibold">
                                  -{acc.discount}%
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400">per malam</p>
                          </div>
                          <button className="hidden sm:flex w-8 h-8 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white items-center justify-center transition-all shadow-sm">
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
            <div id="transportasi" className="mt-20 scroll-mt-28">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Sewa Kendaraan</h2>
                <p className="text-slate-500 text-sm">Armada kendaraan terawat untuk mobilitas Anda di {selectedCity === "Semua" ? "berbagai destinasi" : selectedCity}.</p>
              </div>
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                <AnimatePresence>
                  {filteredVehicles.map((veh) => (
                    <motion.div
                      layout="position" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                      key={veh.id} onClick={() => handleVehicleClick(veh)}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
                    >
                      <div className="relative h-28 sm:h-44 w-full flex-shrink-0">
                        <Image src={(veh.imageUrl ? veh.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600"} alt={veh.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                      <div className="p-3 sm:p-4 space-y-2 flex flex-col flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-[13px] sm:text-[14px] font-semibold text-slate-800 leading-tight group-hover:text-[#40B5AD] transition-colors line-clamp-2">{veh.name}</h3>
                            <p className="text-[11px] sm:text-[11.5px] text-slate-500 mt-0.5 font-medium">{veh.brand}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-[11px] sm:text-[12px] text-slate-500">
                          <span className="flex items-center gap-1"><MapPin size={11} className="text-[#40B5AD]" /> <span className="line-clamp-1">{(veh.locations || []).join(", ")}</span></span>
                          <span className="flex items-center gap-1 flex-shrink-0"><Users size={11} className="text-[#40B5AD]" /> {veh.capacity} org</span>
                        </div>
                        
                        <p className="text-[11.5px] sm:text-[12.5px] text-slate-500 line-clamp-2">{veh.description}</p>
                        
                        <div className="flex flex-wrap gap-1 pt-1 flex-1 content-start">
                          <span className={`text-[10px] sm:text-[10.5px] px-2 py-0.5 rounded-full border font-medium ${vehicleTypeColors[veh.type]}`}>
                            {veh.type}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] sm:text-[10.5px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                            Lepas Kunci / Supir
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 border-t border-slate-100 mt-auto gap-1">
                          <div>
                            {(() => {
                              const { basePrice, discount } = getVehicleCardPriceDetails(veh);
                              return (
                                <>
                                  {discount > 0 && (
                                    <span className="text-[11px] sm:text-[12px] text-slate-400 line-through">
                                      {formatRupiah(basePrice)}
                                    </span>
                                  )}
                                  <p className="text-[13px] sm:text-[15px] font-bold text-[#40B5AD] notranslate flex flex-wrap items-center gap-1" translate="no">
                                    {selectedCity === "Semua" ? "Mulai " : ""}{formatRupiah(basePrice - (basePrice * discount / 100))}
                                    {discount > 0 && (
                                      <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded-full font-semibold">
                                        -{discount}%
                                      </span>
                                    )}
                                  </p>
                                </>
                              );
                            })()}
                            <p className="text-[10px] text-slate-400">per hari</p>
                          </div>
                          <button className="hidden sm:flex w-8 h-8 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white items-center justify-center transition-all shadow-sm">
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

          {/* ── WIFI SECTION ── */}
          {filteredWifis.length > 0 && (
            <div id="wifi" className="mt-20 scroll-mt-28">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Layanan Wifi</h2>
                <p className="text-slate-500 text-sm">Tetap terhubung di mana saja selama liburan Anda.</p>
              </div>
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                <AnimatePresence>
                  {filteredWifis.map((wifi) => (
                    <motion.div
                      layout="position" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                      key={wifi.id} onClick={() => handleWifiClick(wifi)}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
                    >
                      <div className="relative h-28 sm:h-44 w-full flex-shrink-0">
                        <Image src={(wifi.imageUrl ? wifi.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600"} alt={wifi.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                      <div className="p-3 sm:p-4 space-y-2 flex flex-col flex-1">
                        <h3 className="text-[13px] sm:text-[14px] font-semibold text-slate-800 leading-tight group-hover:text-[#40B5AD] transition-colors line-clamp-2">{wifi.name}</h3>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-[11px] sm:text-[12px] text-slate-500">
                          <span className="flex items-center gap-1"><WifiIcon size={11} className="text-[#40B5AD]" /> {wifi.type}</span>
                          <span className="flex items-center gap-1"><MapPin size={11} className="text-[#40B5AD]" /> <span className="line-clamp-1">{(wifi.locations || []).join(", ") || "Bali"}</span></span>
                        </div>
                        
                        <p className="text-[11.5px] sm:text-[12.5px] text-slate-500 line-clamp-2">{wifi.description}</p>
                        
                        <div className="hidden sm:flex flex-wrap gap-1.5 pt-1 flex-1 content-start">
                          {wifi.features.slice(0, 3).map((f) => (
                            <span key={f} className="text-[10.5px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{f}</span>
                          ))}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 border-t border-slate-100 mt-auto gap-1">
                          <div>
                            {(() => {
                              const { basePrice, discount } = getWifiCardPriceDetails(wifi);
                              return (
                                <>
                                  {discount > 0 && (
                                    <span className="text-[11px] sm:text-[12px] text-slate-400 line-through">
                                      {formatRupiah(basePrice)}
                                    </span>
                                  )}
                                  <p className="text-[13px] sm:text-[15px] font-bold text-[#40B5AD] notranslate flex flex-wrap items-center gap-1" translate="no">
                                    {selectedCity === "Semua" ? "Mulai " : ""}{formatRupiah(basePrice - (basePrice * discount / 100))}
                                    {discount > 0 && (
                                      <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded-full font-semibold">
                                        -{discount}%
                                      </span>
                                    )}
                                  </p>
                                </>
                              );
                            })()}
                          </div>
                          <button className="hidden sm:flex w-8 h-8 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white items-center justify-center transition-all shadow-sm">
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

          {/* ── MICE SECTION ── */}
          {filteredMice.length > 0 && (
            <div id="mice" className="mt-20 scroll-mt-28">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Layanan MICE</h2>
                <p className="text-slate-500 text-sm">Penyelenggaraan acara, konferensi, dan meeting di {selectedCity === "Semua" ? "berbagai destinasi" : selectedCity}.</p>
              </div>
              <motion.div layout className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
                <AnimatePresence>
                  {filteredMice.map((m) => (
                    <motion.div
                      layout="position" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
                      key={m.id} onClick={() => handleMiceClick(m)}
                      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1"
                    >
                      <div className="relative h-28 sm:h-44 w-full flex-shrink-0">
                        <Image src={(m.imageUrl ? m.imageUrl.split(',')[0].trim() : "") || "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600"} alt={m.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                      </div>
                      <div className="p-3 sm:p-4 space-y-2 flex flex-col flex-1">
                        <h3 className="text-[13px] sm:text-[14px] font-semibold text-slate-800 leading-tight group-hover:text-[#40B5AD] transition-colors line-clamp-2">{m.name}</h3>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-[11px] sm:text-[12px] text-slate-500">
                          <span className="flex items-center gap-1"><MapPin size={11} className="text-[#40B5AD]" /> <span className="line-clamp-1">{m.location}</span></span>
                          <span className="flex items-center gap-1 flex-shrink-0"><Users size={11} className="text-[#40B5AD]" /> {m.capacity} Pax</span>
                        </div>
                        
                        <p className="text-[11.5px] sm:text-[12.5px] text-slate-500 line-clamp-2">{m.description}</p>
                        
                        <div className="hidden sm:flex flex-wrap gap-1.5 pt-1 flex-1 content-start">
                          {m.facilities.slice(0, 3).map((f) => (
                            <span key={f} className="text-[10.5px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{f}</span>
                          ))}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2.5 border-t border-slate-100 mt-auto gap-1">
                          <div>
                            {(m.discount || 0) > 0 && (
                              <span className="text-[11px] sm:text-[12px] text-slate-400 line-through">
                                {formatRupiah(m.price)}
                              </span>
                            )}
                            <p className="text-[13px] sm:text-[15px] font-bold text-[#40B5AD] notranslate flex flex-wrap items-center gap-1" translate="no">
                              {formatRupiah(m.price - (m.price * (m.discount || 0) / 100))}
                              {(m.discount || 0) > 0 && (
                                <span className="text-[9px] bg-red-100 text-red-600 px-1 py-0.5 rounded-full font-semibold">
                                  -{m.discount}%
                                </span>
                              )}
                            </p>
                          </div>
                          <button className="hidden sm:flex w-8 h-8 rounded-full bg-slate-50 hover:bg-[#40B5AD] text-slate-600 hover:text-white items-center justify-center transition-all shadow-sm">
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
                Infinity Go adalah mitra perjalanan terpercaya Anda. Layanan premium, pengalaman tak terlupakan untuk petualangan Anda.
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

      {/* ── DETAIL BOTTOM SHEET / MODAL DRAWER ── */}
      <AnimatePresence>
        {selectedItem && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            />
            
            {/* Responsive Modal/Bottom Sheet Box */}
            {(() => {
              const imageUrl: string = selectedItem.data.imageUrl || "";
              const fallbackDefault = selectedItem.type === "package" ? "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800" :
                selectedItem.type === "accommodation" ? "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800" :
                selectedItem.type === "vehicle" ? "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800" :
                selectedItem.type === "wifi" ? "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800" :
                "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800";
              
              const images: string[] = imageUrl.includes(",")
                ? imageUrl.split(",").map((url: string) => url.trim()).filter(Boolean)
                : [imageUrl || fallbackDefault].filter(Boolean);

              const handlePrev = () => {
                setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
              };
              
              const handleNext = () => {
                setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
              };

              const activeImg = images[activeImageIndex] || fallbackDefault;

              return (
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 280 }}
                  data-lenis-prevent
                  className="fixed bottom-0 left-0 right-0 z-[101] w-full h-[92vh] md:h-[85vh] rounded-t-[2.5rem] bg-white flex flex-col md:flex-row shadow-[0_-15px_50px_rgba(0,0,0,0.15)] overflow-hidden border-t border-slate-100"
                >
                  {/* Close Button Mobile */}
                  <button 
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 right-4 z-50 bg-black/45 hover:bg-black/60 text-white p-2.5 rounded-full transition-colors backdrop-blur-md md:hidden shadow-sm"
                  >
                    <XIcon size={16} />
                  </button>

                  {/* Left Side: Photo Gallery & Slider */}
                  <div className="w-full md:w-1/2 h-[22vh] md:h-full flex flex-col bg-slate-50 flex-shrink-0 relative border-b md:border-b-0 md:border-r border-slate-100/75">
                    
                    {/* Drag indicator for bottom sheet */}
                    <div className="w-12 h-1 bg-slate-300/60 rounded-full absolute top-2.5 left-1/2 -translate-x-1/2 z-40" />

                    {/* Main Image Slider View */}
                    <div className="relative flex-1 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={activeImg}
                        alt={`${selectedItem.data.name} Gallery`}
                        fill
                        className="object-cover transition-all duration-300"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

                      {/* Navigation Chevrons */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-slate-950 flex items-center justify-center shadow-md transition-colors z-20 cursor-pointer"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 hover:text-slate-950 flex items-center justify-center shadow-md transition-colors z-20 cursor-pointer"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}

                      {/* Floating Category Tag inside photo */}
                      <span className="absolute bottom-4 left-4 bg-[#40B5AD] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm">
                        {selectedItem.type === "package" ? "Paket Wisata" :
                         selectedItem.type === "accommodation" ? "Akomodasi" :
                         selectedItem.type === "vehicle" ? "Transportasi" :
                         selectedItem.type === "wifi" ? "Internet Portable" :
                         selectedItem.type === "mice" ? "MICE Event" : "Bundling Promo"}
                      </span>
                    </div>

                    {/* Thumbnail List Row */}
                    {images.length > 1 && (
                      <div className="flex gap-2 p-1.5 overflow-x-auto justify-center bg-white border-t border-slate-100 flex-shrink-0 scrollbar-none">
                        {images.map((imgUrl, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveImageIndex(idx)}
                            className={`relative w-8 h-8 md:w-16 md:h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                              activeImageIndex === idx
                                ? "border-[#40B5AD] scale-105 shadow-md"
                                : "border-transparent opacity-65 hover:opacity-100"
                            }`}
                          >
                            <Image
                              src={imgUrl}
                              alt={`Gallery Thumbnail ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Side: Details Content */}
                  <div className="flex-1 flex flex-col h-full min-h-0 bg-white relative">
                    
                    {/* Sticky Header */}
                    <div className="p-6 md:p-8 pb-4 border-b border-slate-100 flex-shrink-0 flex items-start justify-between">
                      <div>
                        {/* Sub Category Type Tag */}
                        {selectedItem.data.type && (
                          <span className="text-[10px] font-extrabold text-[#40B5AD] uppercase bg-[#40B5AD]/10 px-3 py-1 rounded-full mb-1.5 inline-block">
                            {selectedItem.data.type}
                          </span>
                        )}
                        <h2 className="text-lg md:text-2xl font-extrabold text-slate-800 leading-snug">
                          {selectedItem.data.name}
                        </h2>
                      </div>
                      
                      {/* Close Button Desktop */}
                      <button 
                        onClick={() => setSelectedItem(null)}
                        className="text-slate-400 hover:text-slate-600 transition-colors ml-4 p-2 rounded-full hover:bg-slate-100 hidden md:flex flex-shrink-0 items-center justify-center border border-slate-100"
                      >
                        <XIcon size={20} className="stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Scrollable Middle Content (Description & Facilities) */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4 space-y-6 min-h-0 scrollbar-thin scrollbar-thumb-slate-200">
                      
                      {/* Meta list */}
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12.5px] text-slate-500 pb-4 border-b border-slate-100/60">
                        {selectedItem.data.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-[#40B5AD]" />
                            <span>{selectedItem.data.location}</span>
                          </div>
                        )}
                        {selectedItem.data.duration && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[#40B5AD]" />
                            <span>{selectedItem.data.duration}</span>
                          </div>
                        )}
                        {selectedItem.data.capacity && (
                          <div className="flex items-center gap-1.5">
                            <Users size={14} className="text-[#40B5AD]" />
                            <span>Kapasitas: {selectedItem.data.capacity} {selectedItem.type === "mice" ? "Pax" : "Orang"}</span>
                          </div>
                        )}
                        {selectedItem.data.brand && (
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-slate-600">Brand:</span>
                            <span>{selectedItem.data.brand}</span>
                          </div>
                        )}
                      </div>

                      {/* Clean Rental Options for Vehicle */}
                      {selectedItem.type === "vehicle" && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pb-4 border-b border-slate-100/60">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lokasi</label>
                            <select
                              value={selectedVehLocation}
                              onChange={(e) => setSelectedVehLocation(e.target.value)}
                              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                            >
                              {(selectedItem.data.locations || [])
                                .filter((loc: string) => {
                                  let settings: any[] = [];
                                  try {
                                    settings = typeof selectedItem.data.priceSettings === 'string' 
                                      ? JSON.parse(selectedItem.data.priceSettings) 
                                      : (selectedItem.data.priceSettings || []);
                                  } catch(e) {}
                                  const setting = settings.find((s: any) => s.location === loc);
                                  return setting ? setting.isActive !== false : true;
                                })
                                .map((loc: string) => (
                                  <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Opsi Rental</label>
                            <select
                              value={selectedDriverOption}
                              onChange={(e) => setSelectedDriverOption(e.target.value as "self" | "driver")}
                              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                            >
                              <option value="self">Lepas Kunci</option>
                              <option value="driver">Dengan Driver</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mulai Sewa</label>
                            <input
                              type="date"
                              value={bookingStartDate}
                              onChange={(e) => setBookingStartDate(e.target.value)}
                              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selesai Sewa</label>
                            <input
                              type="date"
                              value={bookingEndDate}
                              onChange={(e) => setBookingEndDate(e.target.value)}
                              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                            />
                          </div>
                        </div>
                      )}

                      {/* Clean Rental Options for Wifi */}
                      {selectedItem.type === "wifi" && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pb-4 border-b border-slate-100/60">
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lokasi</label>
                            <select
                              value={selectedVehLocation}
                              onChange={(e) => setSelectedVehLocation(e.target.value)}
                              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                            >
                              {(selectedItem.data.locations || [])
                                .filter((loc: string) => {
                                  let settings: any[] = [];
                                  try {
                                    settings = typeof selectedItem.data.priceSettings === 'string' 
                                      ? JSON.parse(selectedItem.data.priceSettings) 
                                      : (selectedItem.data.priceSettings || []);
                                  } catch(e) {}
                                  const setting = settings.find((s: any) => s.location === loc);
                                  return setting ? setting.isActive !== false : true;
                                })
                                .map((loc: string) => (
                                  <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mulai Sewa</label>
                            <input
                              type="date"
                              value={bookingStartDate}
                              onChange={(e) => setBookingStartDate(e.target.value)}
                              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Selesai Sewa</label>
                            <input
                              type="date"
                              value={bookingEndDate}
                              onChange={(e) => setBookingEndDate(e.target.value)}
                              className="px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                            />
                          </div>
                        </div>
                      )}

                      {/* Booking Options for Tour Package */}
                      {selectedItem.type === "package" && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60 space-y-3">
                          <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Pilihan Pemesanan Tour</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500 uppercase">Tanggal Mulai</label>
                              <input
                                type="date"
                                value={bookingStartDate}
                                onChange={(e) => setBookingStartDate(e.target.value)}
                                className="px-3 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500 uppercase">Tanggal Selesai</label>
                              <input
                                type="date"
                                value={bookingEndDate}
                                onChange={(e) => setBookingEndDate(e.target.value)}
                                className="px-3 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase">Jumlah Peserta (Orang)</label>
                            <input
                              type="number"
                              min="1"
                              value={bookingGuests}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBookingGuests(val === "" ? "" : Math.max(1, Number(val)));
                              }}
                              className="px-3 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                            />
                          </div>

                          {/* Display Pricing Tiers inside detail card */}
                          {(() => {
                            let rulesList: any[] = [];
                            try {
                              rulesList = typeof selectedItem.data.priceRules === 'string'
                                ? JSON.parse(selectedItem.data.priceRules)
                                : (selectedItem.data.priceRules || []);
                            } catch(e) {}
                            
                            if (rulesList.length > 0) {
                              return (
                                <div className="pt-2.5 border-t border-slate-200/60 mt-2 space-y-1.5">
                                  <p className="text-[10px] font-extrabold text-[#40B5AD] uppercase tracking-wider">Tarif Khusus Group & Rombongan (Hemat Bersama):</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <div className="text-[12px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200/50 flex flex-col shadow-sm">
                                      <span className="text-[9px] text-[#40B5AD] font-bold uppercase">Standar (1 Orang)</span>
                                      <span className="font-extrabold text-slate-800 mt-0.5">
                                        {formatRupiah(selectedItem.data.price - (selectedItem.data.price * (selectedItem.data.discount || 0) / 100))}
                                      </span>
                                    </div>
                                    {rulesList.map((r: any, idx: number) => (
                                      <div key={idx} className="text-[12px] text-slate-600 bg-white p-2 rounded-xl border border-slate-200/50 flex flex-col shadow-sm">
                                        <span className="text-[9px] text-[#40B5AD] font-bold uppercase">&ge; {r.minParticipants} Orang</span>
                                        <span className="font-extrabold text-slate-800 mt-0.5">
                                          {formatRupiah(r.price - (r.price * (selectedItem.data.discount || 0) / 100))} <span className="text-[9px] font-normal text-slate-400">/ pax</span>
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      )}

                      {/* Booking Options for Accommodation */}
                      {selectedItem.type === "accommodation" && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/60 space-y-3">
                          <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Pilihan Menginap</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500 uppercase">Tanggal Check-in</label>
                              <input
                                type="date"
                                value={bookingStartDate}
                                onChange={(e) => setBookingStartDate(e.target.value)}
                                className="px-3 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-[11px] font-bold text-slate-500 uppercase">Tanggal Check-out</label>
                              <input
                                type="date"
                                value={bookingEndDate}
                                onChange={(e) => setBookingEndDate(e.target.value)}
                                className="px-3 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-bold text-slate-500 uppercase">Jumlah Tamu</label>
                            <input
                              type="number"
                              min="1"
                              value={bookingGuests}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBookingGuests(val === "" ? "" : Math.max(1, Number(val)));
                              }}
                              className="px-3 py-2 text-[13px] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#40B5AD]/20 bg-white font-semibold text-slate-700"
                            />
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      <div>
                        <h4 className="font-bold text-slate-800 text-[12px] uppercase tracking-wider mb-2.5">Deskripsi Lengkap</h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line pr-1">
                          {selectedItem.data.description || "Dapatkan kenyamanan ekstra dengan layanan eksklusif dari Infinity Go."}
                        </p>
                      </div>

                      {/* Facilities / Features Grid */}
                      {((selectedItem.data.facilities && selectedItem.data.facilities.length > 0) || 
                        (selectedItem.data.features && selectedItem.data.features.length > 0)) && (
                        <div>
                          <h4 className="font-bold text-slate-800 text-[12px] uppercase tracking-wider mb-3">Fasilitas & Fitur</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {(selectedItem.data.facilities || selectedItem.data.features || []).map((f: string, i: number) => (
                              <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/40">
                                {getFacilityIcon(f)}
                                <span className="line-clamp-1">{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Sticky Action Footer */}
                    <div className="p-5 md:px-8 md:py-5 border-t border-slate-100 bg-slate-50/30 flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                      
                      {/* Price Section */}
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Harga Terbaik</span>
                        <div className="flex flex-col">
                          {selectedItem.type === "bundle" ? (
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg md:text-xl font-extrabold text-[#40B5AD] notranslate" translate="no">
                                {formatRupiah(selectedItem.data.discountedPrice)}
                              </span>
                              {selectedItem.data.originalPrice > selectedItem.data.discountedPrice && (
                                <span className="text-xs text-slate-400 line-through">
                                  {formatRupiah(selectedItem.data.originalPrice)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <>
                              {(() => {
                                const isVehicle = selectedItem.type === "vehicle";
                                const isPackage = selectedItem.type === "package";
                                const isWifi = selectedItem.type === "wifi";
                                const guestsCount = Number(bookingGuests) || 1;
                                
                                let basePrice = selectedItem.data.price || selectedItem.data.pricePerNight || selectedItem.data.pricePerDay || 0;
                                let discount = selectedItem.data.discount || 0;
                                let singlePrice = basePrice;

                                if (isVehicle) {
                                  const vehiclePriceObj = getVehiclePriceDetails(selectedItem.data, selectedVehLocation, selectedDriverOption);
                                  singlePrice = vehiclePriceObj.basePrice;
                                  discount = vehiclePriceObj.discount;
                                  
                                  let rentalDays = 1;
                                  if (bookingStartDate && bookingEndDate) {
                                    const start = new Date(bookingStartDate);
                                    const end = new Date(bookingEndDate);
                                    if (end >= start) {
                                      const diffTime = Math.abs(end.getTime() - start.getTime());
                                      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                                      rentalDays = diffDays === 0 ? 1 : diffDays;
                                    }
                                  }
                                  basePrice = singlePrice * rentalDays;
                                } else if (isWifi) {
                                  const wifiPriceObj = getWifiPriceDetails(selectedItem.data, selectedVehLocation);
                                  singlePrice = wifiPriceObj.basePrice;
                                  discount = wifiPriceObj.discount;
                                  
                                  let rentalDays = 1;
                                  if (bookingStartDate && bookingEndDate) {
                                    const start = new Date(bookingStartDate);
                                    const end = new Date(bookingEndDate);
                                    if (end >= start) {
                                      const diffTime = Math.abs(end.getTime() - start.getTime());
                                      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                                      rentalDays = diffDays === 0 ? 1 : diffDays;
                                    }
                                  }
                                  basePrice = singlePrice * rentalDays;
                                } else if (isPackage) {
                                  let packagePrice = selectedItem.data.price || 0;
                                  let rulesList: any[] = [];
                                  try {
                                    rulesList = typeof selectedItem.data.priceRules === 'string'
                                      ? JSON.parse(selectedItem.data.priceRules)
                                      : (selectedItem.data.priceRules || []);
                                  } catch(e) {}

                                  if (rulesList.length > 0) {
                                    const sortedRules = [...rulesList].sort((a, b) => b.minParticipants - a.minParticipants);
                                    const matchedRule = sortedRules.find(r => guestsCount >= r.minParticipants);
                                    if (matchedRule) {
                                      packagePrice = matchedRule.price;
                                    } else {
                                      packagePrice = (guestsCount > 1 && selectedItem.data.priceSharing > 0)
                                        ? selectedItem.data.priceSharing
                                        : selectedItem.data.price;
                                    }
                                  } else {
                                    packagePrice = (guestsCount > 1 && selectedItem.data.priceSharing > 0)
                                      ? selectedItem.data.priceSharing
                                      : selectedItem.data.price;
                                  }
                                  singlePrice = packagePrice;
                                  basePrice = packagePrice * guestsCount;
                                } else if (selectedItem.type === "accommodation") {
                                  let nights = 1;
                                  if (bookingStartDate && bookingEndDate) {
                                    const start = new Date(bookingStartDate);
                                    const end = new Date(bookingEndDate);
                                    if (end > start) {
                                      nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                                    }
                                  }
                                  singlePrice = selectedItem.data.pricePerNight || 0;
                                  basePrice = singlePrice * nights;
                                }
                                
                                const originalPricePerItem = selectedItem.data.price || selectedItem.data.pricePerNight || selectedItem.data.pricePerDay || 0;
                                const originalTotalAfterPerc = (originalPricePerItem * guestsCount) - ((originalPricePerItem * guestsCount) * discount / 100);
                                const discountedTotal = basePrice - (basePrice * discount / 100);
                                const discountedSingle = singlePrice - (singlePrice * discount / 100);
                                const savingsAmount = originalTotalAfterPerc - discountedTotal;

                                return (
                                  <div className="flex flex-col gap-0.5">
                                    {isPackage && guestsCount > 0 && (
                                      <span className="text-[11px] text-slate-500 font-semibold">
                                        Tarif per orang: <span className="text-[#40B5AD] font-bold">{formatRupiah(discountedSingle)}</span>
                                      </span>
                                    )}
                                    <div className="flex items-baseline gap-1.5">
                                      <span className="text-lg md:text-xl font-extrabold text-[#40B5AD] notranslate" translate="no">
                                        {formatRupiah(discountedTotal)}
                                      </span>
                                      {isPackage && savingsAmount > 0 ? (
                                        <>
                                          <span className="text-xs text-slate-400 line-through">
                                            {formatRupiah(originalTotalAfterPerc)}
                                          </span>
                                          <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold ml-1">
                                            Hemat {formatRupiah(savingsAmount)}
                                          </span>
                                        </>
                                      ) : (
                                        discount > 0 && (
                                          <>
                                            <span className="text-xs text-slate-400 line-through">
                                              {formatRupiah(basePrice)}
                                            </span>
                                            <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold ml-1">
                                              -{discount}%
                                            </span>
                                          </>
                                        )
                                      )}
                                    </div>
                                  </div>
                                );
                              })()}
                            </>
                          )}
                        </div>
                        {selectedItem.type === "accommodation" && (
                          <span className="text-[9px] text-slate-400">
                            {(() => {
                              let nights = 1;
                              if (bookingStartDate && bookingEndDate) {
                                const start = new Date(bookingStartDate);
                                const end = new Date(bookingEndDate);
                                if (end > start) {
                                  nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                                }
                              }
                              return `untuk ${nights} malam, ${Number(bookingGuests) || 1} tamu`;
                            })()}
                          </span>
                        )}
                        {selectedItem.type === "package" && (
                          <span className="text-[9px] text-slate-400">
                            {`untuk ${Number(bookingGuests) || 1} peserta`}
                          </span>
                        )}
                        {(selectedItem.type === "vehicle" || selectedItem.type === "wifi") && (
                          <span className="text-[9px] text-slate-400">
                            {(() => {
                              let rentalDays = 1;
                              if (bookingStartDate && bookingEndDate) {
                                const start = new Date(bookingStartDate);
                                const end = new Date(bookingEndDate);
                                if (end >= start) {
                                  const diffTime = Math.abs(end.getTime() - start.getTime());
                                  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                                  rentalDays = diffDays === 0 ? 1 : diffDays;
                                }
                                return `untuk ${rentalDays} hari`;
                              }
                              return "per hari";
                            })()}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => {
                          const waNumber = "628977857823";
                          let text = "";
                          const guestsCount = Number(bookingGuests) || 1;
                          
                          if (selectedItem.type === "package") {
                            let packagePrice = selectedItem.data.price;
                            let rulesList: any[] = [];
                            try {
                              rulesList = typeof selectedItem.data.priceRules === 'string'
                                ? JSON.parse(selectedItem.data.priceRules)
                                : (selectedItem.data.priceRules || []);
                            } catch(e) {}
                            
                            if (rulesList.length > 0) {
                              const sortedRules = [...rulesList].sort((a, b) => b.minParticipants - a.minParticipants);
                              const matchedRule = sortedRules.find(r => guestsCount >= r.minParticipants);
                              if (matchedRule) {
                                packagePrice = matchedRule.price;
                              } else {
                                packagePrice = (guestsCount > 1 && selectedItem.data.priceSharing > 0)
                                  ? selectedItem.data.priceSharing
                                  : selectedItem.data.price;
                              }
                            } else {
                              packagePrice = (guestsCount > 1 && selectedItem.data.priceSharing > 0)
                                ? selectedItem.data.priceSharing
                                : selectedItem.data.price;
                            }

                            const totalBase = packagePrice * guestsCount;
                            const disc = selectedItem.data.discount || 0;
                            const finalPrice = totalBase - (totalBase * disc / 100);
                            
                            const dateInfo = (bookingStartDate && bookingEndDate) 
                              ? `\n📅 *Tanggal:* ${bookingStartDate} s/d ${bookingEndDate}`
                              : "";

                            text = `Halo tim Infinity Go,\n\nSaya ingin memesan paket tour berikut:\n\n📌 *Paket:* ${selectedItem.data.name}\n📍 *Lokasi:* ${selectedItem.data.location}\n⏱ *Durasi:* ${selectedItem.data.duration}${dateInfo}\n👥 *Peserta:* ${guestsCount} Orang\n💰 *Total Harga:* ${formatRupiah(finalPrice)}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`;
                          } else if (selectedItem.type === "accommodation") {
                            let nights = 1;
                            if (bookingStartDate && bookingEndDate) {
                              const start = new Date(bookingStartDate);
                              const end = new Date(bookingEndDate);
                              if (end > start) {
                                nights = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
                              }
                            }
                            const totalBase = (selectedItem.data.pricePerNight || 0) * nights;
                            const disc = selectedItem.data.discount || 0;
                            const finalPrice = totalBase - (totalBase * disc / 100);

                            const dateInfo = (bookingStartDate && bookingEndDate) 
                              ? `\n📅 *Check-in:* ${bookingStartDate}\n📅 *Check-out:* ${bookingEndDate} (${nights} Malam)`
                              : "";

                            text = `Halo tim Infinity Go,\n\nSaya ingin memesan akomodasi berikut:\n\n🏨 *Nama:* ${selectedItem.data.name}\n📍 *Lokasi:* ${selectedItem.data.location}\n🛏 *Tipe:* ${selectedItem.data.type}${dateInfo}\n👥 *Tamu:* ${guestsCount} Orang\n💰 *Total Harga:* ${formatRupiah(finalPrice)}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`;
                          } else if (selectedItem.type === "vehicle") {
                            const { basePrice, discount } = getVehiclePriceDetails(selectedItem.data, selectedVehLocation, selectedDriverOption);
                            const singlePrice = basePrice - (basePrice * discount / 100);
                            
                            let rentalDays = 1;
                            let dateInfo = "";
                            if (bookingStartDate && bookingEndDate) {
                              const start = new Date(bookingStartDate);
                              const end = new Date(bookingEndDate);
                              if (end >= start) {
                                const diffTime = Math.abs(end.getTime() - start.getTime());
                                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                                rentalDays = diffDays === 0 ? 1 : diffDays;
                              }
                              dateInfo = `\n📅 *Tanggal Sewa:* ${bookingStartDate} s/d ${bookingEndDate} (${rentalDays} Hari)`;
                            }
                            
                            const finalPrice = singlePrice * rentalDays;
                            text = `Halo tim Infinity Go,\n\nSaya ingin menyewa kendaraan berikut:\n\n🚗 *Nama:* ${selectedItem.data.name}\n📍 *Lokasi:* ${selectedVehLocation}\n🔧 *Opsi:* ${selectedDriverOption === "driver" ? "Dengan Driver" : "Lepas Kunci"}${dateInfo}\n👥 *Kapasitas:* ${selectedItem.data.capacity} Orang\n💰 *Total Harga:* ${formatRupiah(finalPrice)}${rentalDays > 1 ? ` (${rentalDays} Hari)` : ""}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`;
                          } else if (selectedItem.type === "wifi") {
                            const { basePrice, discount } = getWifiPriceDetails(selectedItem.data, selectedVehLocation);
                            const singlePrice = basePrice - (basePrice * discount / 100);
                            
                            let rentalDays = 1;
                            let dateInfo = "";
                            if (bookingStartDate && bookingEndDate) {
                              const start = new Date(bookingStartDate);
                              const end = new Date(bookingEndDate);
                              if (end >= start) {
                                const diffTime = Math.abs(end.getTime() - start.getTime());
                                const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                                rentalDays = diffDays === 0 ? 1 : diffDays;
                              }
                              dateInfo = `\n📅 *Tanggal Sewa:* ${bookingStartDate} s/d ${bookingEndDate} (${rentalDays} Hari)`;
                            }
                            
                            const finalPrice = singlePrice * rentalDays;
                            text = `Halo tim Infinity Go,\n\nSaya ingin menyewa layanan Wifi berikut:\n\n📶 *Nama:* ${selectedItem.data.name}\n🏷 *Tipe:* ${selectedItem.data.type}\n📍 *Lokasi:* ${selectedVehLocation}${dateInfo}\n💰 *Total Harga:* ${formatRupiah(finalPrice)}${rentalDays > 1 ? ` (${rentalDays} Hari)` : ""}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`;
                          } else if (selectedItem.type === "mice") {
                            text = `Halo tim Infinity Go,\n\nSaya ingin memesan layanan MICE berikut:\n\n👥 *Nama:* ${selectedItem.data.name}\n📍 *Lokasi:* ${selectedItem.data.location}\n📈 *Kapasitas:* ${selectedItem.data.capacity} Pax\n💰 *Harga:* ${formatRupiah(selectedItem.data.price)}\n\nMohon konfirmasi ketersediaannya. Terima kasih!`;
                          } else if (selectedItem.type === "bundle") {
                            text = `Halo tim Infinity Go,\n\nSaya tertarik dengan Promo Bundling berikut:\n\n🎟 *Paket:* ${selectedItem.data.name}\n💰 *Harga Promo:* ${formatRupiah(selectedItem.data.discountedPrice)}\n\nMohon informasi lebih lanjut. Terima kasih!`;
                          }

                          const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
                          window.open(waUrl, "_blank");
                        }}
                        className="w-full sm:w-auto bg-[#0B1528] hover:bg-[#1e2d4a] text-white py-4 px-8 rounded-2xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <span>Pesan Sekarang</span>
                        <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                          <path d="M12.004 2c-5.518 0-9.996 4.477-9.996 9.996 0 1.764.459 3.486 1.333 5.003L2 22l5.132-1.347a9.927 9.927 0 0 0 4.872 1.343c5.518 0 9.996-4.477 9.996-9.996C22 6.477 17.522 2 12.004 2zm5.82 14.127c-.246.696-1.22 1.272-1.684 1.319-.464.047-.927.232-2.927-.562-2.557-1.015-4.184-3.606-4.312-3.774-.128-.168-1.037-1.383-1.037-2.637 0-1.254.646-1.871.876-2.115.23-.244.5-.306.666-.306.167 0 .334.004.478.01.15.006.353-.058.552.424.204.496.7.1.7.204a.43.43 0 0 1-.044.22c-.11.23-.246.39-.39.55-.145.163-.3.34-.128.636.172.296.766 1.264 1.644 2.044.9.8 1.657 1.047 1.953 1.168.297.12.47.102.646-.1.176-.202.766-.89.97-1.196.204-.306.408-.255.687-.153.28.102 1.774.836 2.08 1.04.306.204.51.306.586.438.077.133.077.766-.17 1.462z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
