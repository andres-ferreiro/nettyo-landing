import type { MetadataRoute } from "next";
import { locales } from "./[lang]/locales";

const BASE_URL = "https://nettyo.com";
// Keep in sync with the routes that actually exist: app/[lang]/page.tsx and
// app/[lang]/contacto/page.tsx are the only two real pages per locale today.
const PATHS = ["", "/contacto"];

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    PATHS.map((path) => ({
      url: `${BASE_URL}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
        ),
      },
    })),
  );
}
