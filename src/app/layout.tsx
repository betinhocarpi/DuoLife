import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/components/PwaRegister";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "DuoLife - Find Your Duo",
  description: "O app de relacionamento para gamers encontrarem seu Duo para a vida.",
  keywords: ["gamer", "duo", "relacionamento", "gaming", "match", "parceiro"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DuoLife",
  },
  openGraph: {
    title: "DuoLife - Find Your Duo",
    description: "Encontre seu Duo. Para os games e para a vida.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#7c3aed",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={geist.variable}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="h-full bg-[#090910] text-[#e2e8f0] antialiased">
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
