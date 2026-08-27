import Image from "next/image";
import Link from "next/link";
import { lang } from "next/root-params";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Grid from "../components/Grid";
import { getDictionary } from "./dictionaries";

// Centered block over a faint logo watermark (scripts/artwork.py's
// "not-found" slot — ink kept low, 4.65:1 worst-case measured against
// foreground-secondary, since real text sits directly on top of it here,
// unlike cta/footer which isolate text into a separate zone).
export default async function NotFound() {
  const [dict, locale] = await Promise.all([getDictionary(), lang()]);
  const t = dict.notFound;

  return (
    <>
      <Header />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden py-32">
        <Image
          src="/media/not-found.avif"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
        <Grid className="relative">
          <div className="col-span-2 mx-auto max-w-md text-center sm:col-span-4 lg:col-span-4 lg:col-start-2">
            <p className="font-mono text-xs tracking-wide text-accent-strong uppercase">
              {t.eyebrow}
            </p>
            <h1 className="mt-6 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
              {t.headline}
            </h1>
            <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-foreground-secondary">
              {t.supporting}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={`/${locale}`}
                className="inline-flex h-12 w-full items-center justify-center bg-foreground px-8 font-mono text-xs tracking-wider text-background uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong sm:w-auto"
              >
                {t.cta}
              </Link>
              <Link
                href={`/${locale}/contacto`}
                className="inline-flex h-12 w-full items-center justify-center border border-border px-8 font-mono text-xs tracking-wider text-foreground uppercase transition-colors hover:border-foreground sm:w-auto"
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
        </Grid>
      </main>
      <Footer />
    </>
  );
}
