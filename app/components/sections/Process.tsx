import Grid from "../Grid";
import FadeIn from "../FadeIn";
import HalftoneBand from "../HalftoneBand";
import ProcessTimeline from "./ProcessTimeline";
import { getDictionary } from "../../[lang]/dictionaries";

export default async function Process() {
  const t = (await getDictionary()).process;

  return (
    <section
      id="proceso"
      className="relative overflow-hidden border-b border-rule py-24 lg:py-32"
    >
      <HalftoneBand className="inset-x-0 top-[58%] hidden h-[42%] -translate-y-1/2 lg:block" />

      <Grid className="relative">
        {/* Deliberately not sticky: a sticky left column is the signature
            Capabilities and Portfolio already use. */}
        <FadeIn className="col-span-2 pb-16 sm:col-span-4 lg:col-span-3 lg:pb-24">
          <h2 className="max-w-md text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-foreground-secondary">
            {t.supporting}
          </p>
        </FadeIn>

        <div className="col-span-2 sm:col-span-4 lg:col-span-6">
          <ProcessTimeline steps={t.steps} />
        </div>
      </Grid>
    </section>
  );
}
