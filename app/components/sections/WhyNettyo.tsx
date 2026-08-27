import Grid from "../Grid";
import FadeIn from "../FadeIn";
import WhyNettyoTabs from "./WhyNettyoTabs";
import { getDictionary } from "../../[lang]/dictionaries";

export default async function WhyNettyo() {
  const t = (await getDictionary()).whyNettyo;

  return (
    <section className="border-b border-rule py-24 lg:py-32">
      <Grid>
        <FadeIn className="col-span-2 pb-12 sm:col-span-4 lg:col-span-6 lg:pb-16">
          <h2 className="max-w-lg text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {t.headline}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground-secondary">
            {t.supporting}
          </p>
        </FadeIn>

        <WhyNettyoTabs items={t.items} />
      </Grid>
    </section>
  );
}
