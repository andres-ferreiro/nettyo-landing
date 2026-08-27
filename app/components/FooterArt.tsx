"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";

// The peeking wordmark starts mostly hidden — only a hint of "SOLUTIONS"
// showing — and slides up into full view as the visitor scrolls to the true
// end of the page. Justification: a small "you've reached the bottom"
// payoff, not motion for its own sake. Transform-only (translateY), so it
// composites instead of repainting on scroll.
export default function FooterArt() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [48, 0]);

  return (
    <div ref={ref} className="relative h-32 overflow-hidden sm:h-40 lg:h-56">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y }}>
        <Image
          src="/media/footer.avif"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </motion.div>
    </div>
  );
}
