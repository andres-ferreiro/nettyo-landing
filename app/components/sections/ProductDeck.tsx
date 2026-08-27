"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import ProductCard, { type Product } from "./ProductCard";

// How far either side of centre a card stays fully focused. This is the
// "margin" that makes the focused state readable over a stretch of scroll
// instead of at a single point.
const DWELL = 0.42;

function DeckCard({
  product,
  cta,
  index,
  pos,
}: {
  product: Product;
  cta: string;
  index: number;
  pos: MotionValue<number>;
}) {
  // Signed distance from the focused card. Negative is above, positive below,
  // so the deck fans in both directions around a centred card.
  const d = useTransform(pos, (v) => index - v);

  // Position eases through the middle: across the dwell window the card barely
  // moves, then it travels quickly to the next slot. Without this the focused
  // state exists only at one exact scroll offset.
  const y = useTransform(
    d,
    [-2, -1, -DWELL, 0, DWELL, 1, 2],
    ["-92%", "-48%", "-10%", "0%", "10%", "48%", "92%"],
  );
  const scale = useTransform(
    d,
    [-2, -1, -DWELL, 0, DWELL, 1, 2],
    [0.86, 0.94, 1, 1, 1, 0.94, 0.86],
  );

  const blurPx = useTransform(
    d,
    [-2, -1, -DWELL, 0, DWELL, 1, 2],
    [4, 2, 0, 0, 0, 2, 4],
  );
  const filter = useMotionTemplate`blur(${blurPx}px)`;
  // Darkens toward the section ground, so a receding card sinks into the page
  // rather than turning fully see-through.
  const scrim = useTransform(
    d,
    [-2, -1, -DWELL, 0, DWELL, 1, 2],
    [0.72, 0.5, 0, 0, 0, 0.5, 0.72],
  );
  // A little transparency where cards overlap, layered under the scrim rather
  // than replacing it: pure opacity was what let two artworks bleed into one
  // another, but a small amount on top of a dark scrim reads as depth. Also
  // carries the far-edge fade so cards enter and exit the deck cleanly.
  const opacity = useTransform(
    d,
    [-2.8, -2, -1, -DWELL, 0, DWELL, 1, 2, 2.8],
    [0, 0.82, 0.92, 1, 1, 1, 0.92, 0.82, 0],
  );
  // Focus has to win the paint order, and focus moves, so z is derived rather
  // than fixed by index.
  const zIndex = useTransform(d, (v) => Math.round(50 - Math.abs(v) * 10));
  // Only the centred card is clickable; a receding neighbour must not swallow
  // the pointer.
  const pointerEvents = useTransform(d, (v) =>
    Math.abs(v) < 0.5 ? "auto" : "none",
  );

  return (
    <motion.div
      // Card 0 stays in flow so its natural height opens the stage; the rest
      // stack on it. Transforms never affect layout, so the stage keeps its
      // height no matter which card is focused.
      className={
        index === 0 ? "relative" : "absolute inset-x-0 top-0"
      }
      style={{ y, scale, opacity, zIndex, pointerEvents, filter }}
    >
      <ProductCard product={product} cta={cta} />

      {/* Sits above the card it belongs to, never above the focused one,
          because each layer paints in its own stacking context. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: scrim,
          backgroundImage:
            "linear-gradient(to bottom, var(--foreground) 0%, color-mix(in srgb, var(--foreground) 68%, transparent) 45%, var(--foreground) 100%)",
        }}
      />
    </motion.div>
  );
}

// Owns the scroll track. Split out so it mounts only in deck mode: useScroll
// measuring a ref that lives in a branch which was not rendered yet is what
// trips motion's "target is defined but not hydrated" warning.
function DeckStage({
  products,
  cta,
}: {
  products: readonly Product[];
  cta: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [0, products.length - 1]);
  // Scroll-linked values track the scrollbar exactly, which reads as harsh at
  // the moment a card lands. A spring on the shared index softens every
  // derived value at once.
  const pos = useSpring(raw, { stiffness: 170, damping: 28, mass: 0.3 });

  return (
    <div ref={wrapRef} style={{ height: `${products.length * 66}vh` }}>
      {/* Full-height stage so the fanned neighbours have room above and below
          the focused card without colliding with the section edges. */}
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="relative w-full">
          {products.map((p, i) => (
            <DeckCard
              key={p.slug}
              product={p}
              cta={cta}
              index={i}
              pos={pos}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductDeck({
  products,
  cta,
}: {
  products: readonly Product[];
  cta: string;
}) {
  const reduce = useReducedMotion();
  const [wide, setWide] = useState(false);

  // The deck only makes sense where there is room for it. Below lg, and under
  // reduced motion, the same cards render as a plain list: one DOM, no
  // duplicated links, nothing that needs scrolling to become readable.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!wide || reduce) {
    return (
      <div className="flex flex-col gap-10">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} cta={cta} />
        ))}
      </div>
    );
  }

  return <DeckStage products={products} cta={cta} />;
}
