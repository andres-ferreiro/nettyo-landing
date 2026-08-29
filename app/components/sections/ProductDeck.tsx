"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
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
  warm,
}: {
  product: Product;
  cta: string;
  index: number;
  pos: MotionValue<number>;
  warm: boolean;
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
    [0.82, 0.92, 1, 1, 1, 0.92, 0.82],
  );

  const blurPx = useTransform(
    d,
    [-2, -1, -DWELL, 0, DWELL, 1, 2],
    [4, 2, 0, 0, 0, 2, 4],
  );
  // Never emit `blur(0px)`. An identity filter still forces the card onto its
  // own compositing layer, and the focused card is the one element here whose
  // transform resolves to `none` — so that filter is the only thing promoting
  // the card a visitor is actually looking at. Cheap to drop either way; it is
  // also a candidate cause of a reported "focused card renders as an empty
  // dark panel", which was never reproduced locally.
  const filter = useTransform(blurPx, (v) =>
    v < 0.05 ? "none" : `blur(${v}px)`,
  );
  // Darkens toward the section ground, so a receding card sinks into the page
  // rather than turning fully see-through.
  // Note the asymmetry with the values above: what actually shows of a
  // neighbour is the strip nearest the focused card, and on that strip the
  // gradient below is already at full strength. 0.5 there rendered the only
  // visible part of the card as a near-black band, which is what made the
  // stack read as nothing happening on a phone.
  const scrim = useTransform(
    d,
    [-2, -1, -DWELL, 0, DWELL, 1, 2],
    [0.66, 0.4, 0, 0, 0, 0.4, 0.66],
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
      <ProductCard product={product} cta={cta} warm={warm} />

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

  // Deliberately the first scroll gesture rather than an observer on the
  // deck: an observer is the same class of mechanism as the per-card lazy
  // loading this exists to replace, so it would inherit the same failure.
  // A scroll listener cannot be defeated by a card being transparent or
  // transformed, and the deck sits several viewports down, so one gesture
  // still buys the artwork plenty of time. Visitors who never scroll never
  // pay for it.
  const [warm, setWarm] = useState(false);
  useEffect(() => {
    if (warm) return;
    const on = () => setWarm(true);
    window.addEventListener("scroll", on, { passive: true, once: true });
    return () => window.removeEventListener("scroll", on);
  }, [warm]);

  return (
    <div ref={wrapRef} style={{ height: `${products.length * 66}vh` }}>
      {/* Full-height stage so `items-center` centers against the whole
          viewport — shrinking this instead of the card itself just pins the
          centered box to the top and leaves dead space below it. Note the
          card must stay well under half this height for the fan to be
          visible at all: `y` below is a percentage of the card's own height,
          so a card that fills the stage also throws its neighbours clean off
          the screen. That budget lives in ProductCard's aspect ratio. */}
      <div className="sticky top-0 flex h-[100svh] items-center">
        <div className="relative w-full">
          {products.map((p, i) => (
            <DeckCard
              key={p.slug}
              product={p}
              cta={cta}
              index={i}
              pos={pos}
              warm={warm}
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

  // Card geometry is percentage- and aspect-ratio-driven (not fixed pixel
  // values), so the stack reads fine at any viewport width — the deck used
  // to be lg-only, but nothing about it actually depends on desktop space.
  // Reduced motion is the one real reason to fall back to a plain list: one
  // DOM, no scroll-linked positioning, nothing that needs scrolling to
  // become readable.
  if (reduce) {
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
