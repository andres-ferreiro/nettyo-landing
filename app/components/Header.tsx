import Image from "next/image";
import Link from "next/link";
import { lang } from "next/root-params";
import Grid from "./Grid";
import HeaderShell from "./HeaderShell";
import LanguageSwitch from "./LanguageSwitch";
import MobileNav from "./MobileNav";
import { getDictionary } from "../[lang]/dictionaries";

// `minimal`: logo + ES/EN only, no nav/CTA — used on /contacto, whose
// fullscreen split (dark panel + light panel side by side) doesn't suit the
// normal single over-dark/over-light flip on desktop: the header spans both
// at once there, so ES/EN stays a fixed colour at lg+. Below lg the split
// stacks into one panel at a time, so ES/EN inverts with data-over-dark like
// the rest of the site, and the blurred veil renders behind the logo too —
// both scoped to mobile only, since /contacto's panels scroll independently
// under the fixed header and would otherwise bleed through it.
export default async function Header({ minimal = false }: { minimal?: boolean }) {
  const [t, locale] = await Promise.all([
    getDictionary().then((d) => d.header),
    lang(),
  ]);
  const contactHref = `/${locale}/contacto`;

  return (
    <HeaderShell>
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-[var(--hdr-veil)]/35 backdrop-blur-md ${minimal ? "lg:hidden" : ""}`}
        style={{
          maskImage:
            "linear-gradient(to bottom, black, black 45%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black, black 45%, transparent 100%)",
        }}
      />
      <Grid className="h-16 items-center">
        <Link href={`/${locale}`} className="col-span-1 flex items-center gap-2 sm:col-span-2">
          <span className="relative h-6 w-6">
            <Image
              src="/media/Nettyo-Solutions.png"
              alt=""
              fill
              className="object-contain"
            />
          </span>
          <span className="font-mono text-sm font-medium tracking-wide text-[var(--hdr-fg)]">
            NETTYO
          </span>
        </Link>

        {!minimal && (
          <nav className="col-span-2 hidden items-center justify-center gap-8 lg:flex">
            <a
              href="#capacidades"
              className="text-sm text-[var(--hdr-muted)] transition-colors hover:text-[var(--hdr-fg)]"
            >
              {t.servicios}
            </a>
            <a
              href="#productos"
              className="text-sm text-[var(--hdr-muted)] transition-colors hover:text-[var(--hdr-fg)]"
            >
              {t.productos}
            </a>
            <a
              href="#proceso"
              className="text-sm text-[var(--hdr-muted)] transition-colors hover:text-[var(--hdr-fg)]"
            >
              {t.proceso}
            </a>
          </nav>
        )}

        <div
          className={`col-span-1 flex items-center justify-end gap-4 sm:col-span-2 ${minimal ? "lg:col-start-5" : ""}`}
        >
          <LanguageSwitch
            className={`items-center gap-1 font-mono text-xs ${minimal ? "flex" : "hidden lg:flex"}`}
            linkClassName={
              minimal
                ? "text-[var(--hdr-fg)] transition-opacity hover:opacity-70 lg:text-foreground"
                : "text-[var(--hdr-muted)] transition-colors hover:text-[var(--hdr-fg)]"
            }
            separatorClassName={minimal ? "" : "text-[var(--hdr-muted)]"}
            ariaLabel={t.cambiarIdioma}
          />

          {!minimal && (
            <Link
              href={contactHref}
              className="inline-flex h-11 items-center justify-center whitespace-nowrap border border-[var(--hdr-line)] px-4 lg:h-9 text-sm font-medium text-[var(--hdr-fg)] transition-colors hover:bg-[var(--hdr-fg)] hover:text-[var(--hdr-veil)]"
            >
              <span className="sm:hidden">{t.contacto}</span>
              <span className="hidden sm:inline">{t.cta}</span>
            </Link>
          )}

          {!minimal && (
            <MobileNav
              links={[
                { href: "#capacidades", label: t.servicios },
                { href: "#productos", label: t.productos },
                { href: "#proceso", label: t.proceso },
              ]}
              ariaLabelOpen={t.abrirMenu}
              ariaLabelClose={t.cerrarMenu}
              ariaLabelLanguage={t.cambiarIdioma}
            />
          )}
        </div>
      </Grid>
    </HeaderShell>
  );
}
