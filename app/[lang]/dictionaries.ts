import "server-only";
import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { hasLocale, type Locale } from "./locales";

const dictionaries = {
  es: () => import("./dictionaries/es.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export type Dictionary = typeof import("./dictionaries/es.json");

export async function getDictionary(): Promise<Dictionary> {
  const locale = await lang();
  if (!hasLocale(locale)) notFound();
  return dictionaries[locale]();
}

// For the few places next/root-params' lang() can't be used — Next.js
// doesn't yet support it inside Route Handlers, which is what the
// opengraph-image/twitter-image file conventions compile to. Those get
// their locale from the route's own `params` argument instead and pass it
// here directly.
export async function getDictionaryByLocale(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
