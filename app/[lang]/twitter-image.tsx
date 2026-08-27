import { ImageResponse } from "next/og";
import { getDictionaryByLocale } from "./dictionaries";
import { locales, hasLocale, defaultLocale } from "./locales";
import { ogElement, ogSize } from "./og-shared";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Nettyo Solutions";

// See opengraph-image.tsx's comment: Route Handlers can't use lang() from
// next/root-params yet, so locale comes from `params` instead.
export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionaryByLocale(hasLocale(lang) ? lang : defaultLocale);
  return new ImageResponse(await ogElement(dict), size);
}
