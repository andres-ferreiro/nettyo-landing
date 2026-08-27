import Image from "next/image";
import Link from "next/link";
import { lang } from "next/root-params";
import Grid from "../Grid";
import HeroBrandMark from "./HeroBrandMark";
import FadeIn from "../FadeIn";
import TypingHeadline from "../TypingHeadline";
import HeroQr from "./HeroQr";
import { getDictionary } from "../../[lang]/dictionaries";

export default async function Hero() {
  const [t, locale] = await Promise.all([
    getDictionary().then((d) => d.hero),
    lang(),
  ]);
  const showQr = process.env.SHOW_HERO_QR === "true";

  return (
    <section className="relative flex flex-1 flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/media/heroback.avif"
          alt=""
          fill
          priority
          className="object-cover object-bottom"
        />
      </div>

      {/* structural grid: real column divider, not pure decoration */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="absolute top-16 right-0 left-0 border-t border-dashed border-border" />
      </div>

      <Grid className="relative w-full pt-44 pb-16">
        <span className="pointer-events-none absolute top-16 -left-2 hidden h-4 w-4 border-l border-t border-accent-strong lg:block" />
        <span className="pointer-events-none absolute top-16 right-4 hidden h-2 w-2 -translate-y-1/2 rotate-45 bg-accent-strong lg:block lg:right-0" />

        <FadeIn
          delay={0.5}
          className="hidden lg:col-span-2 lg:col-start-1 lg:block"
        >
          <HeroBrandMark capabilities={t.capabilities} />
        </FadeIn>

        <div className="col-span-2 flex flex-col gap-8 sm:col-span-4 lg:col-span-4 lg:col-start-3">
          <FadeIn delay={0}>
            <h1
              aria-label={t.headline.join(" ")}
              className="text-4xl font-medium tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              <TypingHeadline lines={t.headline} />
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <p className="max-w-md font-mono text-sm leading-relaxed font-medium text-foreground-secondary sm:text-base">
              {t.subhead.map((line, i) => (
                <span key={line}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </p>
          </FadeIn>
        </div>

        <FadeIn
          delay={0.3}
          className="relative col-span-2 mt-8 grid grid-cols-1 border border-foreground/15 sm:col-span-4 sm:grid-cols-2 lg:col-span-4 lg:col-start-3 lg:mt-16"
        >
          <span className="pointer-events-none absolute -top-2 -left-2 h-4 w-4 border-t border-l border-accent-strong" />
          <span className="pointer-events-none absolute -right-2 -bottom-2 h-4 w-4 border-r border-b border-accent-strong" />

          <Link
            href={`/${locale}/contacto`}
            className="flex h-12 items-center justify-center bg-background px-6 font-mono text-xs tracking-wider text-foreground uppercase transition-colors hover:bg-background-alt"
          >
            {t.ctaPrimary}
          </Link>
          <a
            href="#productos"
            className="flex h-12 items-center justify-center border-t border-foreground/15 bg-foreground px-6 font-mono text-xs tracking-wider text-background uppercase transition-colors hover:opacity-90 sm:border-t-0 sm:border-l"
          >
            {t.ctaSecondary}
          </a>
        </FadeIn>
      </Grid>

      {showQr && <HeroQr />}
    </section>
  );
}
