import Grid from "../Grid";
import FadeIn from "../FadeIn";
import StatCard from "../StatCard";
import { getDictionary } from "../../[lang]/dictionaries";

export default async function TechnicalCredibility() {
  const t = (await getDictionary()).technicalCredibility;

  return (
    <section id="tecnologia" className="border-b border-rule py-24 lg:py-32">
      <Grid flush>
        <FadeIn className="col-span-2 pb-10 sm:col-span-4 lg:col-span-2 lg:sticky lg:top-28 lg:self-start lg:pr-12 lg:pb-0">
          <h2 className="max-w-sm text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {t.headline}
          </h2>
        </FadeIn>

        {/* Own wrapper for the same reason Problem's pain-point matrix needs
            one: as direct Grid children the second pair would wrap back
            under the headline column instead of staying in columns 3-6. */}
        <div className="col-span-2 grid grid-cols-1 gap-4 sm:col-span-4 sm:grid-cols-2 sm:gap-6 lg:col-span-4 lg:col-start-3 lg:grid-cols-2 lg:gap-6">
          {t.stats.map(({ value, label, caption }, i) => (
            <FadeIn key={value} delay={0.08 + i * 0.08}>
              <StatCard value={value} label={label} caption={caption} />
            </FadeIn>
          ))}
        </div>
      </Grid>
    </section>
  );
}
