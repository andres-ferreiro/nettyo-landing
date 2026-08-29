"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import FadeIn from "../FadeIn";

type Step = { name: string; detail: string };

const pad = (i: number) => String(i + 1).padStart(2, "0");

export default function ProcessTimeline({ steps }: { steps: readonly Step[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Bound straight to a motion value, so the rule draws without re-rendering.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 65%"],
  });

  return (
    <div ref={ref} className="relative">
      {/* Desktop connector, sitting exactly on the row boundary the steps
          alternate around. Mobile gets a vertical rule instead. */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 lg:block">
        <div className="border-t border-dashed border-rule" />
        <motion.div
          className="absolute inset-x-0 top-0 h-px origin-left bg-accent-strong"
          style={reduce ? { scaleX: 1 } : { scaleX: scrollYProgress }}
        />
      </div>

      {/* Below lg: a 2-col dashed grid of cards (same crosshair-rule language
          as Problem's matrix), each with its own numbered chip up top —
          clearer as a scannable set than one long connected list read
          against a plain vertical rule. Desktop keeps the alternating
          timeline untouched via the lg: overrides below. */}
      <ol className="relative grid grid-cols-2 border-t border-l border-dashed border-rule lg:grid-cols-6 lg:gap-x-6 lg:gap-y-0 lg:border-0">
        {steps.map(({ name, detail }, i) => {
          // Even steps sit above the connector, odd below. Two equal rows put
          // every block flush against it rather than floating near it.
          const above = i % 2 === 0;
          // Mobile 2-col grid position, independent of the desktop pairing.
          const mobileTop = i >= 2;
          const mobileLeft = i % 2 === 1;
          return (
            <li
              key={name}
              className={`relative border-dashed border-rule py-8 pr-6 ${mobileTop ? "border-t" : "border-t-0"} ${mobileLeft ? "border-l pl-6" : "border-l-0 pl-0"} lg:grid lg:h-[420px] lg:grid-rows-2 lg:border-0 lg:p-0 ${
                above ? "lg:items-end" : "lg:items-start"
              }`}
            >
              {mobileTop && mobileLeft && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute top-0 left-0 h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 lg:hidden"
                >
                  <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-accent-strong/50" />
                  <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-accent-strong/50" />
                </span>
              )}

              <FadeIn
                delay={0.05 + i * 0.06}
                className={`flex flex-col ${
                  above
                    ? "lg:row-start-1 lg:justify-end lg:pb-8"
                    : "lg:row-start-2 lg:justify-start lg:pt-8"
                }`}
              >
                <span className="inline-flex w-fit items-center border border-border bg-surface px-3 py-1.5 font-mono text-base font-medium tabular-nums lg:border-0 lg:bg-background lg:px-2 lg:py-1 lg:text-sm">
                  <span className="text-accent-strong">.</span>
                  <span className="text-foreground">{pad(i)}</span>
                </span>

                <h3 className="mt-5 font-mono text-base font-medium tracking-wide text-foreground uppercase">
                  {name}
                </h3>
                <p className="mt-2 max-w-[24ch] text-sm leading-[1.45] text-foreground-secondary">
                  {detail}
                </p>
              </FadeIn>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
