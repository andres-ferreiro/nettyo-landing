"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

type Item = { slug: string; name: string; detail: string };

export default function WhyNettyoTabs({ items }: { items: readonly Item[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  // Arrow keys move between tabs, which is what a tablist owes a keyboard
  // user. Selection follows focus, so the panel tracks without extra keys.
  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? 1
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? -1
          : e.key === "Home"
            ? -active
            : e.key === "End"
              ? items.length - 1 - active
              : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + items.length) % items.length;
    setActive(next);
    btns.current[next]?.focus();
  };

  const current = items[active];

  return (
    <>
      <div
        role="tablist"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="col-span-2 sm:col-span-4 lg:col-span-3"
      >
        {items.map((item, i) => {
          const on = i === active;
          return (
            <button
              key={item.slug}
              ref={(el) => {
                btns.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`why-tab-${item.slug}`}
              aria-selected={on}
              aria-controls="why-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              className={`block w-full border-l-2 py-5 pr-6 pl-6 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-strong ${
                on
                  ? "border-accent-strong bg-background-alt"
                  : "border-transparent hover:bg-background-alt/50"
              }`}
            >
              <span className="flex items-baseline gap-4">
                <span
                  className={`text-xl font-medium tracking-tight transition-colors duration-300 sm:text-2xl ${
                    on ? "text-foreground" : "text-foreground-secondary"
                  }`}
                >
                  {item.name}
                </span>
                <span className="ml-auto shrink-0 font-mono text-xs text-foreground-secondary tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>

              {/* Below lg the panel is hidden, so every description renders
                  here instead. Nothing on this section depends on interaction. */}
              <span className="mt-2 block max-w-[46ch] text-sm leading-relaxed text-foreground-secondary lg:hidden">
                {item.detail}
              </span>
            </button>
          );
        })}
      </div>

      <div
        id="why-panel"
        role="tabpanel"
        aria-labelledby={`why-tab-${current.slug}`}
        className="col-span-2 hidden sm:col-span-4 lg:col-span-3 lg:block"
      >
        <motion.div
          key={current.slug}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden border border-foreground/10 bg-background-alt">
            <Image
              src={`/media/why-${current.slug}.avif`}
              alt=""
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <span className="pointer-events-none absolute top-3 left-3 h-5 w-5 border-t border-l border-accent-light" />
            <span className="pointer-events-none absolute right-3 bottom-3 h-5 w-5 border-r border-b border-accent-light" />
          </div>

          <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-foreground-secondary">
            {current.detail}
          </p>
        </motion.div>
      </div>
    </>
  );
}
