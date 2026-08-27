import type { Metadata } from "next";
import Image from "next/image";
import { ViewTransition } from "react";
import { lang } from "next/root-params";
import Header from "../../components/Header";
import ContactForm from "./ContactForm";
import { getDictionary } from "../dictionaries";

// Own title/description rather than inheriting the homepage's — the layout's
// "%s | Nettyo Solutions" template still wraps this.
export async function generateMetadata(): Promise<Metadata> {
  const [dict, locale] = await Promise.all([getDictionary(), lang()]);
  const t = dict.contacto;
  const path = `/${locale}/contacto`;

  return {
    title: t.headline,
    description: t.supporting,
    alternates: {
      canonical: path,
      languages: { es: "/es/contacto", en: "/en/contacto", "x-default": "/es/contacto" },
    },
    openGraph: { title: t.headline, description: t.supporting, url: path },
    twitter: { title: t.headline, description: t.supporting },
  };
}

// Deliberate one-off fullscreen split, not the standard 6-col Grid — the
// reference this was adapted from is a true two-column split, and Footer is
// dropped here on purpose: appended to a min-h-svh split it either breaks the
// fullscreen feel or gets pushed below the fold. Header's own logo already
// gives a way back to the main site.
export default async function Contacto() {
  const [dict, locale] = await Promise.all([getDictionary(), lang()]);
  const t = dict.contacto;

  return (
    <>
      <Header minimal />
      <ViewTransition>
        {/* lg:h-svh + overflow-hidden on main is the "no scroll to see the
            whole form" requirement: the right column scrolls internally
            (lg:overflow-y-auto) as a graceful fallback on shorter laptop
            screens instead of growing the page, and mobile stays a normal
            scrolling stack since a real split can't fit a full form there. */}
        <main className="flex min-h-svh flex-col lg:h-svh lg:flex-row lg:overflow-hidden">
          {/* PLACEHOLDER: generated panel from scripts/artwork.py's
              "contacto-panel" slot, masked by the real Nettyo mark. Swap the
              src for a real photo when supplied — fill + object-cover means
              it's a one-line change, no layout rework. data-dark so the fixed
              header inverts to light text over it. */}
          <section
            data-dark
            className="relative h-48 shrink-0 overflow-hidden pt-16 sm:h-64 lg:sticky lg:top-0 lg:h-svh lg:w-1/2 lg:pt-0"
          >
            <Image
              src="/media/contacto-panel.avif"
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-16">
              <h1 className="max-w-md text-2xl font-medium tracking-tight text-background lg:text-4xl">
                {t.headline}
              </h1>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-background/70 lg:mt-4">
                {t.supporting}
              </p>
            </div>
          </section>

          <section className="flex-1 overflow-y-auto px-6 py-8 pt-8 sm:px-10 lg:h-svh lg:w-1/2 lg:px-16 lg:pt-20 lg:pb-10">
            <div className="mx-auto max-w-lg">
              <ContactForm t={t} locale={locale} />
            </div>
          </section>
        </main>
      </ViewTransition>
    </>
  );
}
