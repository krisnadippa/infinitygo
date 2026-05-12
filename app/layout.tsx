import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infinity Go | Liburan Tak Terlupakan di Bali",
  description: "Jelajahi keindahan Pulau Dewata dengan Infinity Go. Rasakan pengalaman liburan tak terlupakan dengan layanan premium, tur wisata, sewa mobil, dan akomodasi terbaik di Bali.",
  keywords: ["travel bali", "liburan bali", "tour bali", "sewa mobil bali", "infinity go", "paket wisata bali", "akomodasi bali"],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: "Infinity Go | Liburan Tak Terlupakan di Bali",
    description: "Jelajahi keindahan Pulau Dewata dengan Infinity Go. Layanan travel premium di Bali.",
    url: "https://infinitygo.vercel.app", // Placeholder URL
    siteName: "Infinity Go",
    locale: "id_ID",
    type: "website",
  },
};

import SmoothScroll from "@/components/smooth-scroll";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} antialiased`}
    >
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" sizes="any" />
      </head>
      <body className="font-outfit bg-white text-slate-800">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
