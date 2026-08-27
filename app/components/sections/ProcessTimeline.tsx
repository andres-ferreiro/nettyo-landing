"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";

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

      <ol className="relative grid grid-cols-1 gap-y-12 border-l border-dashed border-rule pl-8 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-6 lg:gap-x-6 lg:gap-y-0 lg:border-l-0 lg:pl-0">
        {steps.map(({ name, detail }, i) => {
          // Even steps sit above the connector, odd below. Two equal rows put
          // every block flush against it rather than floating near it.
          const above = i % 2 === 0;
          return (
            <li
              key={name}
              className={`lg:grid lg:h-[420px] lg:grid-rows-2 ${
                above ? "lg:items-end" : "lg:items-start"
              }`}
            >
              <div
                className={`flex flex-col ${
                  above
                    ? "lg:row-start-1 lg:justify-end lg:pb-8"
                    : "lg:row-start-2 lg:justify-start lg:pt-8"
                }`}
              >
                <span className="inline-flex w-fit items-center bg-background px-2 py-1 font-mono text-sm font-medium tabular-nums">
                  <span className="text-accent-strong">.</span>
                  <span className="text-foreground">{pad(i)}</span>
                </span>

                <h3 className="mt-5 font-mono text-base font-medium tracking-wide text-foreground uppercase">
                  {name}
                </h3>
                <p className="mt-2 max-w-[24ch] text-sm leading-[1.45] text-foreground-secondary">
                  {detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
