import Image from "next/image";
import Grid from "./Grid";
import FooterArt from "./FooterArt";
import LanguageSwitch from "./LanguageSwitch";
import { getDictionary } from "../[lang]/dictionaries";

// Two zones, deliberately: real link text lives in a solid `--background`
// block with nothing behind it, and the ASCII wordmark is confined to a
// text-free strip below. Overlapping the two failed contrast even at a
// near-invisible ink level (see scripts/artwork.py's "footer" slot) — once
// nothing readable sits on the artwork, it's exempt from that rule entirely
// and can run at full visual strength.
export default async function Footer() {
  const dict = await getDictionary();
  const t = dict.footer;
  const header = dict.header;
  const products = dict.portfolio.products;

  return (
    <footer className="border-t border-rule">
      <div className="bg-background py-12 lg:py-16">
        <Grid>
          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <span className="flex items-center gap-2">
              <span className="relative h-6 w-6">
                <Image
                  src="/media/Nettyo-Solutions.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </span>
              <span className="font-mono text-sm font-medium tracking-wide text-foreground">
                NETTYO
              </span>
            </span>
            <p className="mt-4 max-w-[26ch] text-sm leading-relaxed text-foreground-secondary">
              {t.location}
            </p>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-mono text-xs tracking-wide text-foreground-secondary uppercase">
              {t.navHeading}
            </h3>
            <ul className="mt-4 space-y-1">
              <li>
                <a href="#capacidades" className="inline-block py-2 text-sm text-foreground hover:text-accent-strong">
                  {header.servicios}
                </a>
              </li>
              <li>
                <a href="#productos" className="inline-block py-2 text-sm text-foreground hover:text-accent-strong">
                  {header.productos}
                </a>
              </li>
              <li>
                <a href="#proceso" className="inline-block py-2 text-sm text-foreground hover:text-accent-strong">
                  {header.proceso}
                </a>
              </li>
              <li>
                <a href="#contacto" className="inline-block py-2 text-sm text-foreground hover:text-accent-strong">
                  {header.contacto}
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-mono text-xs tracking-wide text-foreground-secondary uppercase">
              {t.productsHeading}
            </h3>
            <ul className="mt-4 space-y-1">
              {products.map(({ slug, name, url }) => (
                <li key={slug}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-2 text-sm text-foreground hover:text-accent-strong"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-4 lg:col-span-2">
            <h3 className="font-mono text-xs tracking-wide text-foreground-secondary uppercase">
              {t.contactHeading}
            </h3>
            <ul className="mt-4 space-y-1">
              <li>
                <a href={`mailto:${t.email}`} className="inline-block py-2 text-sm text-foreground hover:text-accent-strong">
                  {t.email}
                </a>
              </li>
              <li>
                <a
                  href={t.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-2 text-sm text-foreground hover:text-accent-strong"
                >
                  {t.whatsappDisplay}
                </a>
              </li>
            </ul>
            <LanguageSwitch
              className="mt-6 flex items-center gap-1 font-mono text-xs"
              linkClassName="text-foreground-secondary hover:text-foreground"
              separatorClassName="text-foreground-secondary"
            />
          </div>
        </Grid>

        <Grid className="mt-10">
          <div className="col-span-2 border-t border-rule pt-6 sm:col-span-4 lg:col-span-6">
            <p className="font-mono text-xs tracking-wide text-foreground-secondary">
              {t.copyright}
            </p>
          </div>
        </Grid>
      </div>

      {/* Text-free decorative strip — see the module comment above. */}
      <FooterArt />
    </footer>
  );
}
