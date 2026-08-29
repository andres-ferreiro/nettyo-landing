import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export type Product = {
  slug: string;
  name: string;
  category: string;
  line: string;
  url: string;
};

// Source files are named inconsistently and one is vector, so the mapping is
// explicit rather than derived from the slug. `ratio` is the logo's own aspect.
const logos: Record<string, { src: string; ratio: number; svg?: boolean }> = {
  compass: { src: "/media/products/compass-logo.svg", ratio: 210 / 44, svg: true },
  mandhy: { src: "/media/products/mandhy-logo.webp", ratio: 256 / 66 },
  reviw: { src: "/media/products/reviw-logo.webp", ratio: 256 / 68 },
  sanvia: { src: "/media/products/logo-sanvia.webp", ratio: 1 },
  clubiit: { src: "/media/products/logo-clubiit.png", ratio: 1848 / 540 },
};

// Sanvia ships as a square app icon while the rest are wide wordmarks. Sizing
// every mark to the same height would render it at a third of their visual
// area, so near-square marks get a taller box.
const logoClass = (ratio: number) =>
  ratio < 1.6 ? "h-12 w-auto sm:h-14" : "h-7 w-auto sm:h-9";

// Presentational only. Layout, stacking and motion belong to ProductDeck.
//
// `warm`: the deck stacks every card on one sticky stage, so they all enter
// the viewport in the same instant and per-card lazy loading buys nothing —
// while still leaving each card at the mercy of the browser's own lazy-load
// visibility heuristics. A card the deck has not reached yet sits at
// opacity 0 (clamped, see ProductDeck) for the whole page, and the last card
// sits that way longest. ProductDeck flips this on at the first scroll.
export default function ProductCard({
  product,
  cta,
  warm = false,
}: {
  product: Product;
  cta: string;
  warm?: boolean;
}) {
  const logo = logos[product.slug];

  return (
    <a
      href={product.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-background/12 bg-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-light"
    >
      {/* The mark sits on its own light panel: two of the five wordmarks are
          near-black and would disappear on the dark ground. The mobile crop is
          height-budgeted, not chosen for looks: the deck offsets its neighbours
          by a percentage of this card's own height, so a card taller than about
          half the viewport pushes every neighbour off-screen and the stacking
          effect stops being visible at all. 6/5 lands the whole card near 50svh
          on a 375px-wide phone, which leaves a real strip of the next card
          showing below the focused one. */}
      <div className="relative aspect-[6/5] overflow-hidden sm:aspect-[16/6.5]">
        <Image
          src={`/media/product-${product.slug}.avif`}
          alt=""
          fill
          loading={warm ? "eager" : "lazy"}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={logo.src}
            alt={product.name}
            width={Math.round(64 * logo.ratio)}
            height={64}
            unoptimized={logo.svg}
            className={logoClass(logo.ratio)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:px-7 sm:py-5">
        <div>
          <p className="font-mono text-xs tracking-wide text-background/55 uppercase">
            {product.category}
          </p>
          <p className="mt-1.5 max-w-[42ch] text-base text-background">
            {product.line}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-2 font-mono text-xs tracking-wide text-background/70 uppercase transition-colors group-hover:text-accent-light">
          {cta}
          <ArrowUpRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </div>
    </a>
  );
}
