import type { ReactNode } from "react";

type PerRow = { base: number; sm: number; lg: number };

// Emits dashed borders only where a real interior grid line falls, per
// breakpoint. A cell in the first row gets no top border; a cell in the first
// column gets no left border. Inside a <Grid flush>, adjacent cell borders
// touch and read as one continuous rule through the section.
//
// Generalized from the per-breakpoint border math that previously lived
// inside Capabilities.tsx.
function edges(index: number, perRow: PerRow) {
  const at = (n: number) => ({
    top: Math.floor(index / n) >= 1,
    left: n > 1 && index % n !== 0,
  });
  return { base: at(perRow.base), sm: at(perRow.sm), lg: at(perRow.lg) };
}

export default function GridCell({
  index,
  perRow,
  children,
  className = "",
}: {
  index: number;
  perRow: PerRow;
  children: ReactNode;
  className?: string;
}) {
  const e = edges(index, perRow);

  const borders = [
    e.base.top ? "border-t" : "",
    e.base.left ? "border-l" : "",
    e.sm.top ? "sm:border-t" : "sm:border-t-0",
    e.sm.left ? "sm:border-l" : "sm:border-l-0",
    e.lg.top ? "lg:border-t" : "lg:border-t-0",
    e.lg.left ? "lg:border-l" : "lg:border-l-0",
  ].join(" ");

  // Padding only on the sides that carry a rule, so text never sits flush
  // against a line but the outermost cells stay aligned to the page margin.
  const pad = [
    "py-8 lg:py-10",
    e.base.left ? "pl-6" : "",
    e.sm.left ? "sm:pl-8" : "sm:pl-0",
    e.lg.left ? "lg:pl-10" : "lg:pl-0",
    "pr-6 sm:pr-8 lg:pr-10",
  ].join(" ");

  return (
    <div className={`relative border-dashed border-rule ${borders} ${pad} ${className}`}>
      {/* Crosshair marks the intersection where both rules meet, echoing the
          hero's corner ticks. Only interior intersections get one. */}
      {e.lg.top && e.lg.left && (
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 hidden h-[9px] w-[9px] -translate-x-1/2 -translate-y-1/2 lg:block"
        >
          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-accent-strong/50" />
          <span className="absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-accent-strong/50" />
        </span>
      )}
      {children}
    </div>
  );
}
