import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.infinitygotravel.com"),
  title: "Infinity Go Travel - Bali Indonesia Tour & Travel",
  description:
    "Infinity Go Travel menyediakan layanan tour dan travel di Bali, paket wisata, transportasi, guide, dokumentasi perjalanan, dan layanan perjalanan terpercaya untuk wisatawan lokal maupun internasional.",
  alternates: {
    canonical: "https://www.infinitygotravel.com",
  },
  openGraph: {
    title: "Infinity Go Travel - Bali Indonesia Tour & Travel",
    description:
      "Infinity Go Travel menyediakan layanan tour dan travel di Bali, paket wisata, transportasi, guide, dokumentasi perjalanan, dan layanan perjalanan terpercaya untuk wisatawan lokal maupun internasional.",
    url: "https://www.infinitygotravel.com",
    siteName: "Infinity Go Travel",
    images: [
      {
        url: "/images/logo.png",
        width: 500,
        height: 500,
        alt: "Infinity Go Travel",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Infinity Go Travel - Bali Indonesia Tour & Travel",
    description:
      "Infinity Go Travel menyediakan layanan tour dan travel di Bali, paket wisata, transportasi, guide, dokumentasi perjalanan, dan layanan perjalanan terpercaya untuk wisatawan lokal maupun internasional.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
      <body className="font-outfit bg-white text-slate-800">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
