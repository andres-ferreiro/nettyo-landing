"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

// The page's one piece of generated art before the portfolio section.
// Bleeds off the left viewport edge at lg by cancelling Grid's lg:px-16.
//
// `overlay`: experimental mobile-only treatment — the section's headline
// sits directly on the art instead of stacked below it. lg:hidden so
// desktop's separate side-by-side layout is untouched.
export default function SolutionPanel({
  alt,
  overlay,
}: {
  alt: string;
  overlay?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // The parallax only makes sense once the panel actually bleeds past the
  // grid at lg (lg:-ml-16 below) — below that it sits flush like any other
  // block, so there's nothing for the drift to separate it from.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Drives the art slightly against the page as the section passes, which
  // separates it from the flat ground. A motion value, so no re-render per
  // frame and no scroll listener.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-3%", "3%"]);

  return (
    <div
      ref={ref}
      className="relative aspect-[4/5] w-full overflow-hidden border border-foreground/10 bg-background-alt lg:-ml-16 lg:w-[calc(100%+4rem)]"
    >
      <motion.div
        // Scaled past the frame so the parallax never exposes an edge.
        className="absolute -inset-y-[4%] inset-x-0"
        style={reduce || !wide ? undefined : { y }}
        initial={reduce ? false : { scale: 1.04 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src="/media/solution.avif"
          alt={alt}
          fill
          sizes="(min-width: 1024px) 34vw, 100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Same accent ticks the hero uses, so the panel rhymes with it. */}
      <span className="pointer-events-none absolute top-3 left-3 h-5 w-5 border-t border-l border-accent-light" />
      <span className="pointer-events-none absolute right-3 bottom-3 h-5 w-5 border-r border-b border-accent-light" />

      {overlay && (
        <div className="absolute inset-0 flex flex-col justify-end p-6 lg:hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
          />
          <div className="relative">{overlay}</div>
        </div>
      )}
    </div>
  );
}
