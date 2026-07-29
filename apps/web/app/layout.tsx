import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : undefined;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "İcazə Portalı | Elektron icazə müraciətləri",
    template: "%s | İcazə Portalı",
  },
  description:
    "Energetika sahəsində elektron icazə xidmətlərini kəşf edin, onlayn müraciət edin və müraciətinizin statusunu izləyin.",
  applicationName: "İcazə Portalı",
  keywords: [
    "icazə portalı",
    "elektron icazə",
    "onlayn icazə müraciəti",
    "Energetika Nazirliyi",
    "enerji xidmətləri",
  ],
  authors: [{ name: "Azərbaycan Respublikasının Energetika Nazirliyi" }],
  creator: "Azərbaycan Respublikasının Energetika Nazirliyi",
  publisher: "Azərbaycan Respublikasının Energetika Nazirliyi",
  alternates: siteUrl ? { canonical: "/" } : undefined,
  openGraph: {
    ...(siteUrl ? { url: siteUrl } : {}),
    type: "website",
    locale: "az_AZ",
    siteName: "İcazə Portalı",
    title: "İcazə Portalı | Elektron icazə müraciətləri",
    description:
      "Energetika sahəsində elektron icazə xidmətlərini kəşf edin, onlayn müraciət edin və müraciətinizin statusunu izləyin.",
  },
  twitter: {
    card: "summary",
    title: "İcazə Portalı | Elektron icazə müraciətləri",
    description:
      "Energetika sahəsində elektron icazə xidmətlərini kəşf edin və onlayn müraciət edin.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#286aa6",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="az"
      className={`${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
