import type { ReactNode } from "react";

// Site-wide 6-column layout grid. Desktop: 6 cols. Tablet: 4 cols.
// Mobile: 2 cols. Outer margins are intentionally smaller than a column
// (~1/4) so content reads edge-anchored, not floating in whitespace.
// Children position themselves with col-span and col-start utilities.
//
// `flush` removes the horizontal gap so adjacent cell borders touch and form
// continuous vertical rules through a section. Cells then carry their own
// inner padding (see GridCell). Without it the gap breaks every rule.
export default function Grid({
  children,
  className = "",
  flush = false,
}: {
  children: ReactNode;
  className?: string;
  flush?: boolean;
}) {
  // flush zeroes both axes: a gap-y would break the horizontal rules too.
  const gap = flush ? "gap-0" : "gap-y-6 gap-x-4 sm:gap-x-6 lg:gap-x-8";

  return (
    <div
      className={`mx-auto grid w-full max-w-[1600px] grid-cols-2 px-6 sm:grid-cols-4 sm:px-10 lg:grid-cols-6 lg:px-16 ${gap} ${className}`}
    >
      {children}
    </div>
  );
}
