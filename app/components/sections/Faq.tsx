import Grid from "../Grid";
import GridCell from "../GridCell";
import FadeIn from "../FadeIn";
import { getDictionary } from "../../[lang]/dictionaries";

// Native <details>/<summary> per item — free accordion behaviour and
// keyboard support, no client JS state needed (unlike WhyNettyoTabs, which
// needs state because it's a tablist, not independent disclosures).
export default async function Faq() {
  const t = (await getDictionary()).faq;

  // Same content the page already renders, just structured for answer
  // engines/crawlers that read FAQPage schema directly rather than parsing
  // rendered <details> markup — no separate copy to keep in sync.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: { "@type": "Answer", text: answer },
    })),
  };

  return (
    <section className="border-b border-rule py-24 lg:py-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Grid flush>
        <FadeIn className="col-span-2 pb-10 sm:col-span-4 lg:col-span-2 lg:sticky lg:top-28 lg:self-start lg:pr-12 lg:pb-0">
          <h2 className="max-w-sm text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-foreground-secondary">
            {t.supporting}
          </p>
        </FadeIn>

        <div className="col-span-2 grid grid-cols-1 border-dashed border-rule sm:col-span-4 sm:grid-cols-2 lg:col-span-4 lg:col-start-3 lg:border-l">
          {t.items.map(({ question, answer }, i) => (
            <GridCell key={question} index={i} perRow={{ base: 1, sm: 2, lg: 2 }}>
              <FadeIn delay={0.06 + i * 0.06}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 marker:content-none">
                    <span className="text-base font-medium text-foreground">{question}</span>
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 font-mono text-lg text-foreground-secondary transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-4 hidden max-w-[38ch] text-sm leading-relaxed text-foreground-secondary group-open:block">
                    {answer}
                  </p>
                </details>
              </FadeIn>
            </GridCell>
          ))}
        </div>
      </Grid>
    </section>
  );
}
