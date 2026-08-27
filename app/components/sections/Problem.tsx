import Image from "next/image";
import Grid from "../Grid";
import HalftoneBand from "../HalftoneBand";
import GridCell from "../GridCell";
import FadeIn from "../FadeIn";
import { getDictionary } from "../../[lang]/dictionaries";

// Custom illustrations, mapped by meaning rather than by filename: the source
// set is numbered 1-4 but reads 1=filter, 2=route, 3=structure, 4=analytics.
// Sources live in public/media/custom-icons; public/media/icons holds the
// cropped, scale-normalized, background-matched versions the page uses.
const illustrations = [
  "/media/icons/3.webp", // Hojas de calculo: document becoming structured rows
  "/media/icons/4.webp", // WhatsApp como sistema
  "/media/icons/2.webp", // Herramientas que no se hablan: the routing hub
  "/media/icons/1.webp", // Procesos manuales: manual checklist and funnel
];

export default async function Problem() {
  const t = (await getDictionary()).problem;

  return (
    <section className="relative border-b border-rule py-24 lg:py-32">
      {/* Bleeds to both viewport edges behind the lower matrix row. Desktop
          only: on a tall single-column mobile stack it is just noise. */}
      <HalftoneBand className="inset-x-0 top-[55%] hidden h-[38%] lg:block" />

      <Grid flush className="relative">
        {/* Headline column tracks the matrix while it scrolls past; the
            supporting line is pushed down so it lands level with the first
            matrix row instead of floating under the headline. */}
        <FadeIn className="col-span-2 pb-10 sm:col-span-4 lg:col-span-2 lg:sticky lg:top-28 lg:self-start lg:pr-12 lg:pb-0">
          <h2 className="max-w-md text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {t.headline.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-foreground-secondary lg:mt-20">
            {t.supporting}
          </p>
        </FadeIn>

        {/* The matrix needs its own wrapper: as direct grid children the
            second row would wrap back under the headline column instead of
            staying in columns 3-6. */}
        <div className="col-span-2 grid grid-cols-1 border-dashed border-rule sm:col-span-4 sm:grid-cols-2 lg:col-span-4 lg:col-start-3 lg:border-l">
          {t.painPoints.map(({ label, detail }, i) => (
            <GridCell
              key={label}
              index={i}
              perRow={{ base: 1, sm: 2, lg: 2 }}
              className="lg:min-h-[280px]"
            >
              <FadeIn
                delay={0.08 + i * 0.08}
                className="flex h-full flex-col justify-between gap-8 lg:grid lg:grid-cols-2 lg:gap-x-8"
              >
                <div className="flex flex-col">
                  <Image
                    src={illustrations[i]}
                    alt=""
                    width={104}
                    height={104}
                    sizes="104px"
                    className="h-[104px] w-[104px] shrink-0"
                  />
                  <h3 className="mt-12 font-mono text-[15px] leading-5 font-medium tracking-wide text-foreground uppercase lg:mt-auto">
                    {label}
                  </h3>
                </div>
                <p className="max-w-[26ch] text-[15px] leading-[1.45] text-foreground-secondary sm:text-base lg:mt-auto">
                  {detail}
                </p>
              </FadeIn>
            </GridCell>
          ))}
        </div>
      </Grid>
    </section>
  );
}
