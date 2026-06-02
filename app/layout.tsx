import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infinity Go Travel - Bali Indonesia Tour & Travel",
  description:
    "Infinity Go Travel menyediakan layanan tour dan travel di Bali, paket wisata, transportasi, guide, dokumentasi perjalanan, dan layanan perjalanan terpercaya untuk wisatawan lokal maupun internasional.",
  alternates: {
    canonical: "https://infinitygotravel.com",
  },
  openGraph: {
    title: "Infinity Go Travel - Bali Indonesia Tour & Travel",
    description:
      "Infinity Go Travel menyediakan layanan tour dan travel di Bali, paket wisata, transportasi, guide, dokumentasi perjalanan, dan layanan perjalanan terpercaya untuk wisatawan lokal maupun internasional.",
    url: "https://infinitygotravel.com",
    siteName: "Infinity Go Travel",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinity Go Travel - Bali Indonesia Tour & Travel",
    description:
      "Infinity Go Travel menyediakan layanan tour dan travel di Bali, paket wisata, transportasi, guide, dokumentasi perjalanan, dan layanan perjalanan terpercaya untuk wisatawan lokal maupun internasional.",
  },
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
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
