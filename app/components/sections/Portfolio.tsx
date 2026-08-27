import Grid from "../Grid";
import FadeIn from "../FadeIn";
import ProductDeck from "./ProductDeck";
import { type Product } from "./ProductCard";
import { getDictionary } from "../../[lang]/dictionaries";

export default async function Portfolio() {
  const t = (await getDictionary()).portfolio;
  const products = t.products as readonly Product[];

  return (
    // The page's one deliberate theme inversion, which DESIGN_GUIDELINES
    // allows exactly once. Everything else on the page stays light.
    <section
      id="productos"
      data-dark
      className="relative bg-foreground py-24 text-background lg:py-32"
    >
      <Grid className="relative">
        <FadeIn className="col-span-2 pb-12 sm:col-span-4 lg:col-span-2 lg:sticky lg:top-28 lg:self-start lg:pr-12 lg:pb-0">
          <p className="font-mono text-xs tracking-wide text-accent-light uppercase">
            {t.eyebrow}
          </p>
          <h2 className="mt-6 max-w-sm text-3xl font-medium tracking-tight text-background sm:text-4xl">
            {t.headline}
          </h2>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-background/60">
            {t.supporting}
          </p>
        </FadeIn>

        <div className="col-span-2 sm:col-span-4 lg:col-span-4 lg:col-start-3">
          <ProductDeck products={products} cta={t.cta} />
        </div>

      </Grid>
    </section>
  );
}
