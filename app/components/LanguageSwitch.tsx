"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Swaps only the /es|/en prefix, keeping the rest of the path — so switching
// language on /en/contacto goes to /es/contacto, not back to the ES homepage.
export default function LanguageSwitch({
  className,
  linkClassName,
  separatorClassName,
  ariaLabel,
}: {
  className?: string;
  linkClassName?: string;
  separatorClassName?: string;
  ariaLabel?: string;
}) {
  const pathname = usePathname() ?? "/es";
  const rest = pathname.replace(/^\/(es|en)/, "") || "";

  // ES/EN are two glyphs, so the visible text measured 14x16px in all four
  // places this is used — well under any touch minimum. The hit area is
  // grown with padding rather than type size: the caller's gap keeps the two
  // boxes from overlapping, so the targets stay distinct.
  const hit = `inline-flex min-h-11 items-center px-2 ${linkClassName ?? ""}`;

  return (
    <div className={className} aria-label={ariaLabel}>
      <Link href={`/es${rest}`} className={hit}>
        ES
      </Link>
      <span className={separatorClassName}>/</span>
      <Link href={`/en${rest}`} className={hit}>
        EN
      </Link>
    </div>
  );
}
