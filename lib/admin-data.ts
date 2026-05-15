// ============================================================
// Types
// ============================================================

export type InvoiceStatus = "Draft" | "Pending" | "DP" | "Paid" | "Cancelled";
export type PaymentMethod = "Cash" | "Bank Transfer" | "Credit Card" | "E-Wallet";
export type PaymentType = "Full" | "DP";
export type ItemType = "Paket Tour" | "Akomodasi" | "Kendaraan" | "Custom";
export type ExpenseCategory =
  | "Tour Cost"
  | "Vehicle Cost"
  | "Accommodation Cost"
  | "Driver Fee"
  | "Operational"
  | "Other";

export interface InvoiceItem {
  id: string;
  type: ItemType;
  name: string;
  description: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Expense {
  id: string;
  invoiceId: string;
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  paymentType: PaymentType;
  dpAmount: number;           // jumlah DP dibayar (0 jika Full)
  dpDate: string;             // tanggal DP dibayar
  remainingAmount: number;    // grandTotal - dpAmount
  paidFull: boolean;          // true jika sisa sudah dibayar
  paidRemainingDate?: string; // tanggal pelunasan sisa
  paidRemainingAmount?: number; // nominal pelunasan sisa
  notes: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  expenses: Expense[];
  totalExpense: number;
  netProfit: number;
}

export interface TourPackage {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  description: string;
  facilities: string[];
  imageUrl?: string;
  status: "Active" | "Inactive";
}

export interface Accommodation {
  id: string;
  name: string;
  type: "Hotel" | "Villa" | "Guest House" | "Resort";
  location: string;
  pricePerNight: number;
  facilities: string[];
  description: string;
  imageUrl?: string;
  status: "Active" | "Inactive";
}

export interface Vehicle {
  id: string;
  name: string;
  type: "Car" | "Mini Bus" | "Bus" | "Motorcycle";
  brand: string;
  location: string;
  capacity: number;
  pricePerDay: number;
  driverIncluded: boolean;
  description: string;
  imageUrl?: string;
  status: "Active" | "Inactive";
}

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  imageUrl?: string;
  status: "Active" | "Inactive";
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

// ============================================================
// Dummy Data
// ============================================================

export const dummyInvoices: Invoice[] = [
  {
    id: "inv-001",
    invoiceNumber: "INV-2026-001",
    customerName: "Budi Santoso",
    customerPhone: "+62812345678",
    customerEmail: "budi@gmail.com",
    invoiceDate: "2026-05-01",
    dueDate: "2026-05-08",
    status: "Paid",
    paymentMethod: "Bank Transfer",
    paymentType: "Full",
    dpAmount: 0,
    dpDate: "",
    remainingAmount: 0,
    paidFull: true,
    notes: "Terima kasih sudah menggunakan layanan kami.",
    items: [
      {
        id: "item-001",
        type: "Paket Tour",
        name: "Paket Bali Utara 3D2N",
        description: "Tour ke Lovina, Bedugul, dan Singaraja",
        quantity: 2,
        price: 3500000,
        subtotal: 7000000,
      },
      {
        id: "item-002",
        type: "Kendaraan",
        name: "Sewa Hiace Commuter",
        description: "Sewa Hiace 3 hari dengan driver",
        quantity: 3,
        price: 800000,
        subtotal: 2400000,
      },
    ],
    subtotal: 9400000,
    discount: 400000,
    tax: 0,
    grandTotal: 9000000,
    expenses: [
      { id: "exp-001", invoiceId: "inv-001", name: "Modal Tour Bali Utara", category: "Tour Cost", amount: 2000000, date: "2026-05-01", notes: "Bayar ke guide lokal" },
      { id: "exp-002", invoiceId: "inv-001", name: "Biaya Sewa Kendaraan", category: "Vehicle Cost", amount: 1200000, date: "2026-05-01", notes: "Rental Hiace 3 hari" },
      { id: "exp-003", invoiceId: "inv-001", name: "Fee Driver", category: "Driver Fee", amount: 450000, date: "2026-05-01", notes: "Fee driver 3 hari" },
    ],
    totalExpense: 3650000,
    netProfit: 5350000,
  },
  {
    id: "inv-002",
    invoiceNumber: "INV-2026-002",
    customerName: "Siti Rahayu",
    customerPhone: "+62856789012",
    customerEmail: "siti@yahoo.com",
    invoiceDate: "2026-05-03",
    dueDate: "2026-05-10",
    status: "Paid",
    paymentMethod: "Cash",
    paymentType: "Full",
    dpAmount: 0,
    dpDate: "",
    remainingAmount: 0,
    paidFull: true,
    notes: "Paket honeymoon",
    items: [
      { id: "item-003", type: "Paket Tour", name: "Paket Honeymoon Bali 4D3N", description: "Tour romantis ke Ubud, Seminyak, dan Nusa Dua", quantity: 1, price: 12000000, subtotal: 12000000 },
      { id: "item-004", type: "Akomodasi", name: "Villa Seminyak Deluxe", description: "Villa 3 malam dengan private pool", quantity: 3, price: 2500000, subtotal: 7500000 },
    ],
    subtotal: 19500000,
    discount: 500000,
    tax: 0,
    grandTotal: 19000000,
    expenses: [
      { id: "exp-004", invoiceId: "inv-002", name: "Modal Tour Honeymoon", category: "Tour Cost", amount: 4000000, date: "2026-05-03", notes: "Guide + entrance tickets" },
      { id: "exp-005", invoiceId: "inv-002", name: "Biaya Villa", category: "Accommodation Cost", amount: 6000000, date: "2026-05-03", notes: "Net rate villa 3 malam" },
    ],
    totalExpense: 10000000,
    netProfit: 9000000,
  },
  {
    id: "inv-003",
    invoiceNumber: "INV-2026-003",
    customerName: "Ahmad Fauzi",
    customerPhone: "+62821456789",
    customerEmail: "ahmad@outlook.com",
    invoiceDate: "2026-05-05",
    dueDate: "2026-05-12",
    status: "DP",
    paymentMethod: "Bank Transfer",
    paymentType: "DP",
    dpAmount: 5000000,
    dpDate: "2026-05-05",
    remainingAmount: 9000000,
    paidFull: false,
    notes: "Group tour 20 pax — DP 5 juta",
    items: [
      { id: "item-005", type: "Paket Tour", name: "Paket Bali Selatan 2D1N", description: "Kuta, Uluwatu, GWK, Jimbaran", quantity: 20, price: 550000, subtotal: 11000000 },
      { id: "item-006", type: "Kendaraan", name: "Sewa Bus Medium", description: "Bus 25 seat 2 hari", quantity: 2, price: 1500000, subtotal: 3000000 },
    ],
    subtotal: 14000000,
    discount: 0,
    tax: 0,
    grandTotal: 14000000,
    expenses: [],
    totalExpense: 0,
    netProfit: 0,
  },
  {
    id: "inv-004",
    invoiceNumber: "INV-2026-004",
    customerName: "Linda Kusuma",
    customerPhone: "+62877654321",
    customerEmail: "linda@gmail.com",
    invoiceDate: "2026-05-07",
    dueDate: "2026-05-14",
    status: "Paid",
    paymentMethod: "E-Wallet",
    paymentType: "Full",
    dpAmount: 0,
    dpDate: "",
    remainingAmount: 0,
    paidFull: true,
    notes: "",
    items: [
      { id: "item-007", type: "Kendaraan", name: "Sewa Innova Reborn", description: "Sewa mobil 2 hari tanpa driver", quantity: 2, price: 450000, subtotal: 900000 },
    ],
    subtotal: 900000,
    discount: 0,
    tax: 0,
    grandTotal: 900000,
    expenses: [
      { id: "exp-006", invoiceId: "inv-004", name: "Biaya Sewa Unit", category: "Vehicle Cost", amount: 350000, date: "2026-05-07", notes: "Net rate dari pemilik" },
    ],
    totalExpense: 350000,
    netProfit: 550000,
  },
  {
    id: "inv-005",
    invoiceNumber: "INV-2026-005",
    customerName: "Rika Andriani",
    customerPhone: "+62813987654",
    customerEmail: "rika@gmail.com",
    invoiceDate: "2026-05-09",
    dueDate: "2026-05-16",
    status: "Pending",
    paymentMethod: "Bank Transfer",
    paymentType: "Full",
    dpAmount: 0,
    dpDate: "",
    remainingAmount: 0,
    paidFull: false,
    notes: "Paket keluarga 2 dewasa 2 anak",
    items: [
      { id: "item-008", type: "Paket Tour", name: "Paket Family Bali 5D4N", description: "Wisata keluarga lengkap Bali", quantity: 4, price: 2800000, subtotal: 11200000 },
      { id: "item-009", type: "Akomodasi", name: "Hotel Bintang 3 Kuta", description: "4 malam breakfast", quantity: 4, price: 800000, subtotal: 3200000 },
    ],
    subtotal: 14400000,
    discount: 400000,
    tax: 0,
    grandTotal: 14000000,
    expenses: [],
    totalExpense: 0,
    netProfit: 0,
  },
  {
    id: "inv-006",
    invoiceNumber: "INV-2026-006",
    customerName: "Deni Pramono",
    customerPhone: "+62822111222",
    customerEmail: "deni@company.com",
    invoiceDate: "2026-05-10",
    dueDate: "2026-05-17",
    status: "DP",
    paymentMethod: "Credit Card",
    paymentType: "DP",
    dpAmount: 15000000,
    dpDate: "2026-05-10",
    remainingAmount: 25000000,
    paidFull: false,
    notes: "Corporate event 50 pax — DP 15 juta",
    items: [
      { id: "item-010", type: "Paket Tour", name: "Paket Outing Perusahaan", description: "Full day tour + team building", quantity: 50, price: 850000, subtotal: 42500000 },
    ],
    subtotal: 42500000,
    discount: 2500000,
    tax: 0,
    grandTotal: 40000000,
    expenses: [],
    totalExpense: 0,
    netProfit: 0,
  },
];

export const dummyTourPackages: TourPackage[] = [
  { id: "pkg-001", name: "Paket Bali Utara 3D2N", location: "Singaraja, Lovina, Bedugul", duration: "3 Hari 2 Malam", price: 3500000, description: "Jelajahi keindahan Bali bagian utara dengan wisata ke pantai Lovina, Danau Beratan Bedugul, dan Kota Singaraja yang bersejarah.", facilities: ["Guide lokal", "Transport AC", "Breakfast", "Tiket masuk", "Dokumentasi"], imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600", status: "Active" },
  { id: "pkg-002", name: "Paket Honeymoon Bali 4D3N", location: "Ubud, Seminyak, Nusa Dua", duration: "4 Hari 3 Malam", price: 12000000, description: "Paket bulan madu romantis dengan pengalaman tak terlupakan di Ubud, pantai eksklusif Seminyak, dan resort mewah Nusa Dua.", facilities: ["Villa private pool", "Candlelight dinner", "Spa couple", "Transport VIP", "Dokumentasi profesional"], imageUrl: "https://images.unsplash.com/photo-1604999333679-b86d54738315?w=600", status: "Active" },
  { id: "pkg-003", name: "Paket Bali Selatan 2D1N", location: "Kuta, Uluwatu, Jimbaran", duration: "2 Hari 1 Malam", price: 550000, description: "Tour singkat ke destinasi ikonik Bali Selatan: pantai Kuta, tebing Uluwatu, GWK Cultural Park, dan makan malam di Jimbaran.", facilities: ["Guide lokal", "Transport AC", "Tiket masuk", "Makan malam Jimbaran"], imageUrl: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=600", status: "Active" },
  { id: "pkg-004", name: "Paket Family Bali 5D4N", location: "Bali Lengkap", duration: "5 Hari 4 Malam", price: 2800000, description: "Paket wisata keluarga yang menyenangkan mencakup berbagai destinasi ramah anak di seluruh Bali.", facilities: ["Guide keluarga", "Transport minibus", "Penginapan", "Breakfast", "Aktivitas anak", "Tiket masuk"], imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600", status: "Active" },
  { id: "pkg-005", name: "Paket Outing Perusahaan", location: "Bali", duration: "1 Hari", price: 850000, description: "Paket outing korporat dengan team building activities, wisata, dan makan bersama.", facilities: ["Koordinator event", "Transport bus", "Makan siang & malam", "Games & aktivitas", "MC profesional"], imageUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600", status: "Active" },
  { id: "pkg-006", name: "Paket Rafting & ATV Ubud", location: "Ubud", duration: "1 Hari", price: 450000, description: "Petualangan seru rafting di Sungai Ayung dan ATV di persawahan hijau Ubud.", facilities: ["Instruktur berpengalaman", "Perlengkapan safety", "Makan siang", "Transport", "Dokumentasi"], imageUrl: "https://images.unsplash.com/photo-1504019347908-b45f9b0b8dd5?w=600", status: "Inactive" },
];

export const dummyAccommodations: Accommodation[] = [
  { id: "acc-001", name: "Villa Seminyak Deluxe", type: "Villa", location: "Seminyak, Badung", pricePerNight: 2500000, facilities: ["Private Pool", "AC", "WiFi", "Dapur", "Sarapan", "Parkir"], description: "Villa mewah dengan private pool di jantung Seminyak, dekat ke pantai dan pusat hiburan.", imageUrl: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600", status: "Active" },
  { id: "acc-002", name: "Hotel Bintang 3 Kuta", type: "Hotel", location: "Kuta, Badung", pricePerNight: 800000, facilities: ["Kolam Renang", "AC", "WiFi", "Sarapan", "Gym", "Restoran"], description: "Hotel nyaman bintang 3 di area Kuta, berjalan kaki ke pantai dan pusat perbelanjaan.", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600", status: "Active" },
  { id: "acc-003", name: "Resort Nusa Dua Premium", type: "Resort", location: "Nusa Dua, Badung", pricePerNight: 4500000, facilities: ["Pantai Privat", "Spa", "Kolam Renang", "Fine Dining", "Butler Service", "Watersport"], description: "Resort bintang 5 dengan akses pantai privat di Nusa Dua.", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600", status: "Active" },
  { id: "acc-004", name: "Guest House Ubud Tenang", type: "Guest House", location: "Ubud, Gianyar", pricePerNight: 350000, facilities: ["AC", "WiFi", "Sarapan", "Taman Tropis"], description: "Penginapan budget nyaman di tengah ketenangan Ubud.", imageUrl: "https://images.unsplash.com/photo-1534312527009-56c7016453e6?w=600", status: "Active" },
];

export const dummyVehicles: Vehicle[] = [
  { id: "veh-001", name: "Toyota Innova Reborn", type: "Car", brand: "Toyota", location: "Bali", capacity: 7, pricePerDay: 450000, driverIncluded: false, description: "Mobil keluarga nyaman untuk 7 penumpang, kondisi sangat baik dan terawat.", imageUrl: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600", status: "Active" },
  { id: "veh-002", name: "Toyota Hiace Commuter", type: "Mini Bus", brand: "Toyota", location: "Bali", capacity: 14, pricePerDay: 800000, driverIncluded: true, description: "Minibus kapasitas 14 penumpang dengan driver berpengalaman, cocok untuk group tour.", imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600", status: "Active" },
  { id: "veh-003", name: "Isuzu Elf Medium", type: "Mini Bus", brand: "Isuzu", location: "Yogyakarta", capacity: 16, pricePerDay: 950000, driverIncluded: true, description: "Minibus medium untuk group 16 penumpang, dilengkapi AC dan audio system.", imageUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600", status: "Active" },
  { id: "veh-004", name: "Bus Pariwisata 40 Seat", type: "Bus", brand: "Mercedes-Benz", location: "Jakarta", capacity: 40, pricePerDay: 1500000, driverIncluded: true, description: "Bus pariwisata besar kapasitas 40 penumpang untuk corporate event dan tour besar.", imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600", status: "Active" },
  { id: "veh-005", name: "Honda PCX 160", type: "Motorcycle", brand: "Honda", location: "Bali", capacity: 2, pricePerDay: 80000, driverIncluded: false, description: "Skuter modern untuk menjelajahi Bali secara mandiri, nyaman dan irit.", imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", status: "Active" },
];

export const dummyGallery: GalleryItem[] = [
  { id: "gal-001", title: "Keindahan Alam Bali", location: "Bali", imageUrl: "/images/bali.jpg", status: "Active" },
  { id: "gal-002", title: "Perjalanan Menyenangkan", location: "Bali", imageUrl: "/images/contact.jpg", status: "Active" },
  { id: "gal-003", title: "Eksplorasi Destinasi", location: "Bali", imageUrl: "/images/destinasi.jpg", status: "Active" },
  { id: "gal-004", title: "Pemandangan Eksotis", location: "Nusa Penida", imageUrl: "/images/destinasi1.jpg", status: "Active" },
  { id: "gal-005", title: "City Tour Jakarta", location: "Jakarta", imageUrl: "/images/jakarta.jpg", status: "Active" },
  { id: "gal-006", title: "Pesona Labuan Bajo", location: "Labuan Bajo", imageUrl: "/images/labuanbajo.jpg", status: "Active" },
  { id: "gal-007", title: "Pelayanan Terbaik Kami", location: "Bali", imageUrl: "/images/layanan.jpg", status: "Active" },
  { id: "gal-008", title: "Budaya Yogyakarta", location: "Yogyakarta", imageUrl: "/images/yogyakarta.jpg", status: "Active" },
  { id: "gal-009", title: "Momen Tak Terlupakan", location: "Bali", imageUrl: "/images/galery.jpg", status: "Active" },
];

export const dummyCustomers: Customer[] = [
  { id: "cus-001", name: "Budi Santoso", phone: "+62812345678", email: "budi@gmail.com", totalOrders: 3, totalSpent: 27500000, lastOrder: "2026-05-01" },
  { id: "cus-002", name: "Siti Rahayu", phone: "+62856789012", email: "siti@yahoo.com", totalOrders: 1, totalSpent: 19000000, lastOrder: "2026-05-03" },
  { id: "cus-003", name: "Ahmad Fauzi", phone: "+62821456789", email: "ahmad@outlook.com", totalOrders: 2, totalSpent: 28000000, lastOrder: "2026-05-05" },
  { id: "cus-004", name: "Linda Kusuma", phone: "+62877654321", email: "linda@gmail.com", totalOrders: 5, totalSpent: 8500000, lastOrder: "2026-05-07" },
  { id: "cus-005", name: "Rika Andriani", phone: "+62813987654", email: "rika@gmail.com", totalOrders: 2, totalSpent: 28000000, lastOrder: "2026-05-09" },
  { id: "cus-006", name: "Deni Pramono", phone: "+62822111222", email: "deni@company.com", totalOrders: 1, totalSpent: 40000000, lastOrder: "2026-05-10" },
];

// ============================================================
// Stats helpers
// ============================================================

export function computeDashboardStats(invoices: Invoice[]) {
  const paid = invoices.filter((i) => 
    ["PAID", "Paid", "Lunas"].includes(i.status)
  );
  const pending = invoices.filter((i) => 
    ["PENDING", "Pending", "DP", "DRAFT", "Draft"].includes(i.status)
  );
  const totalRevenue = paid.reduce((s, i) => s + i.grandTotal, 0);
  const totalExpense = paid.reduce((s, i) => s + i.totalExpense, 0);
  const netProfit = totalRevenue - totalExpense;

  return {
    totalOrders: invoices.length,
    totalRevenue,
    totalExpense,
    netProfit,
    paidInvoices: paid.length,
    pendingInvoices: pending.length,
  };
}

export const monthlyChartData = [
  { month: "Jan", revenue: 45000000, expense: 22000000 },
  { month: "Feb", revenue: 52000000, expense: 28000000 },
  { month: "Mar", revenue: 38000000, expense: 18000000 },
  { month: "Apr", revenue: 67000000, expense: 35000000 },
  { month: "May", revenue: 125000000, expense: 72500000 },
  { month: "Jun", revenue: 0, expense: 0 },
  { month: "Jul", revenue: 0, expense: 0 },
  { month: "Aug", revenue: 0, expense: 0 },
  { month: "Sep", revenue: 0, expense: 0 },
  { month: "Oct", revenue: 0, expense: 0 },
  { month: "Nov", revenue: 0, expense: 0 },
  { month: "Dec", revenue: 0, expense: 0 },
];

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat("id-ID").format(n);

export const formatDate = (date: Date | string | null): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const formatDateInput = (date: Date | string | null): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return String(date);
  return d.toISOString().split("T")[0];
};
