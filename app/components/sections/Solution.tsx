import Grid from "../Grid";
import FadeIn from "../FadeIn";
import SolutionPanel from "./SolutionPanel";
import { getDictionary } from "../../[lang]/dictionaries";

export default async function Solution() {
  const t = (await getDictionary()).solution;

  return (
    <section className="overflow-hidden border-b border-rule py-24 lg:py-32">
      <Grid>
        <FadeIn className="col-span-2 sm:col-span-4 lg:col-span-2 lg:col-start-1">
          <SolutionPanel alt={t.visualAlt} />
        </FadeIn>

        {/* Column 3 is left empty on purpose: the gap is the composition. */}
        <FadeIn
          delay={0.15}
          className="col-span-2 mt-12 sm:col-span-4 lg:col-span-3 lg:col-start-4 lg:mt-0 lg:self-center"
        >
          <h2 className="max-w-[14ch] text-4xl leading-[1.05] font-medium tracking-tight text-foreground sm:text-5xl lg:text-[3.25rem]">
            {t.headline}
          </h2>
          <div className="my-8 w-16 border-t border-accent-strong" />
          <p className="max-w-[38ch] text-base leading-relaxed text-foreground-secondary">
            {t.supporting}
          </p>
        </FadeIn>
      </Grid>
    </section>
  );
}
