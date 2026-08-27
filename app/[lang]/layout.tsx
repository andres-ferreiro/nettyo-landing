import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Geist_Mono, Doto } from "next/font/google";
import { lang } from "next/root-params";
import "../globals.css";
import OrganizationSchema from "../components/OrganizationSchema";
import { getDictionary } from "./dictionaries";
import { locales } from "./locales";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dot-matrix display face, used only for StatCard's numeric value slot
// (see docs/superpowers/specs/2026-08-27-stat-cards-design.md). Loaded as a
// variable font so the thin end of its weight axis is reachable via a plain
// `font-thin` utility.
const doto = Doto({
  variable: "--font-doto-raw",
  subsets: ["latin"],
  weight: "variable",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), lang()]);
  const path = `/${locale}`;

  return {
    metadataBase: new URL("https://nettyo.com"),
    title: { default: dict.metadata.title, template: "%s | Nettyo Solutions" },
    description: dict.metadata.description,
    keywords: dict.metadata.keywords,
    authors: [{ name: "Nettyo Solutions", url: "https://nettyo.com" }],
    creator: "Nettyo Solutions",
    publisher: "Nettyo Solutions",
    alternates: {
      canonical: path,
      languages: {
        es: "/es",
        en: "/en",
        "x-default": "/es",
      },
    },
    openGraph: {
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: path,
      siteName: "Nettyo Solutions",
      locale: locale === "es" ? "es_MX" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.title,
      description: dict.metadata.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${geistMono.variable} ${doto.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
        {children}
      </body>
      <Script
        src="https://cloud.umami.is/script.js"
        data-website-id="1300d753-bfc2-4297-864a-67163980891b"
        strategy="afterInteractive"
      />
    </html>
  );
}
