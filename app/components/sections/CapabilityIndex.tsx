"use client";

import {
  Code,
  AppWindow,
  Browser,
  Sparkle,
  Cpu,
  Plugs,
  ArrowRight,
} from "@phosphor-icons/react";
import { useReducedMotion } from "motion/react";

const icons = [Code, AppWindow, Browser, Sparkle, Cpu, Plugs];

type Item = { label: string; detail: string };

// Editorial index. Descriptions are always rendered at full contrast: an
// earlier pass dimmed them to opacity-40 at lg, which measured ~1.4:1 against
// the page and failed WCAG AA. The hover affordance lives on the icon (which
// is decorative) and the label shift instead, so nothing readable is dimmed.
export default function CapabilityIndex({ items }: { items: readonly Item[] }) {
  const reduce = useReducedMotion();

  return (
    <ul className="col-span-2 border-dashed border-rule sm:col-span-4 lg:col-span-4 lg:border-l">
      {items.map(({ label, detail }, i) => {
        const Icon = icons[i];
        return (
          <li key={label}>
            <a
              href="#contacto"
              className="group relative flex flex-col gap-3 border-t border-dashed border-rule py-7 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-strong lg:grid lg:grid-cols-[auto_1fr_1fr] lg:items-baseline lg:gap-x-8 lg:py-8 lg:pl-10"
            >
              <Icon
                size={18}
                weight="regular"
                aria-hidden
                className="shrink-0 text-accent-strong opacity-40 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 group-active:opacity-100 lg:translate-y-1"
              />
              <span
                className={`flex items-center gap-3 font-mono text-xl font-medium tracking-wide text-foreground uppercase lg:text-2xl ${
                  reduce
                    ? ""
                    : "transition-transform duration-300 group-hover:translate-x-2 group-focus-visible:translate-x-2"
                }`}
              >
                {label}
                {/* Every row here is a link, but the entire affordance for
                    that (the label shift and the accent rule drawing in) was
                    hover-only, so on a touch screen these read as six static
                    headings. A persistent mark below lg says otherwise;
                    desktop still gets the quieter hover treatment. */}
                <ArrowRight
                  size={15}
                  aria-hidden
                  className="shrink-0 text-accent-strong lg:hidden"
                />
              </span>
              <span className="max-w-[34ch] text-[15px] leading-[1.45] text-foreground-secondary sm:text-base">
                {detail}
              </span>

              {/* Draws in from the left on hover or focus. Transform only, so
                  it composites; it replaces the dashed rule's weight rather
                  than adding a box. */}
              {!reduce && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-accent-strong transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 group-active:scale-x-100"
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
