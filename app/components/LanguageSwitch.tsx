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

  return (
    <div className={className} aria-label={ariaLabel}>
      <Link href={`/es${rest}`} className={linkClassName}>
        ES
      </Link>
      <span className={separatorClassName}>/</span>
      <Link href={`/en${rest}`} className={linkClassName}>
        EN
      </Link>
    </div>
  );
}
