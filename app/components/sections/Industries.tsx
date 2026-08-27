import Grid from "../Grid";
import FadeIn from "../FadeIn";
import { getDictionary } from "../../[lang]/dictionaries";

// Reuses each Portfolio product's own category label rather than inventing
// new industry copy — this strip is a recap of what's already proven above,
// not a separate claim.
export default async function Industries() {
  const dict = await getDictionary();
  const t = dict.industries;
  const products = dict.portfolio.products;

  return (
    <section className="border-b border-border py-12">
      <Grid className="items-center">
        <span className="col-span-2 font-mono text-xs tracking-wider text-foreground-secondary uppercase sm:col-span-4 lg:col-span-2 lg:col-start-1">
          {t.label}
        </span>

        <FadeIn className="col-span-2 sm:col-span-4 lg:col-span-4 lg:col-start-3">
          <div className="flex flex-wrap gap-3">
            {products.map(({ slug, category }) => (
              <span
                key={slug}
                className="border border-border px-3 py-1.5 font-mono text-xs tracking-wide text-foreground-secondary uppercase"
              >
                {category}
              </span>
            ))}
          </div>
        </FadeIn>
      </Grid>
    </section>
  );
}
