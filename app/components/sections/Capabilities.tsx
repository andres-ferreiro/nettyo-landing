import Grid from "../Grid";
import FadeIn from "../FadeIn";
import CapabilityIndex from "./CapabilityIndex";
import { getDictionary } from "../../[lang]/dictionaries";

export default async function Capabilities() {
  const t = (await getDictionary()).capabilities;

  return (
    <section id="capacidades" className="border-b border-rule py-24 lg:py-32">
      <Grid flush>
        <FadeIn className="col-span-2 pb-10 sm:col-span-4 lg:col-span-2 lg:sticky lg:top-28 lg:self-start lg:pr-12 lg:pb-0">
          <h2 className="max-w-sm text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-foreground-secondary">
            {t.supporting}
          </p>
        </FadeIn>

        <CapabilityIndex items={t.items} />

        {/* Gives the index a floor rather than letting it trail off. */}
        <FadeIn delay={0.1} className="col-span-2 sm:col-span-4 lg:col-span-6">
          <a
            href="#productos"
            className="flex h-16 items-center justify-center bg-foreground font-mono text-xs tracking-wider text-background uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong"
          >
            {t.cta}
          </a>
        </FadeIn>
      </Grid>
    </section>
  );
}
