"use client";

import { useEffect, useRef, useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import LanguageSwitch from "./LanguageSwitch";

type NavLink = { href: string; label: string };

// The page's GrainOverlay is fixed at z-20, under the header's z-30, so it
// never reaches these — same tiled-PNG technique as GrainOverlay.tsx,
// scoped locally instead, to match the grain the dark CTA buttons pick up
// from that global layer.
function Grain() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: "url(/media/grain.png)",
        backgroundSize: "128px 128px",
        opacity: 0.55,
      }}
    />
  );
}

// The desktop nav (Header.tsx) is `hidden lg:flex` with no fallback below
// that — this is the fallback. A top-anchored panel rather than a
// vaul-style bottom sheet: it drops from the header it belongs to, which
// reads as "this is the nav, expanded" rather than a detached sheet.
//
// Sized to just the links + language row, deliberately shorter than the
// viewport: the header's own "Contacto" pill stays visible above it (no
// need to duplicate the CTA inside the panel), and the hero's primary CTA
// button peeks through below, teasing the page underneath rather than
// blacking it all out.
export default function MobileNav({
  links,
  ariaLabelOpen,
  ariaLabelClose,
  ariaLabelLanguage,
}: {
  links: NavLink[];
  ariaLabelOpen: string;
  ariaLabelClose: string;
  ariaLabelLanguage: string;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScroll = () => setOpen(false);
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointerdown", onPointerDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointerdown", onPointerDown);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-label={open ? ariaLabelClose : ariaLabelOpen}
        onClick={() => setOpen((v) => !v)}
        className={`relative z-10 flex h-11 w-11 items-center justify-center overflow-hidden text-background transition-colors duration-300 lg:hidden ${
          open ? "bg-accent-strong" : "bg-foreground"
        }`}
      >
        <Grain />
        <span className="relative">
          {open ? <X size={18} weight="regular" /> : <List size={18} weight="regular" />}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-16 z-20 overflow-hidden border-b border-background/12 bg-foreground lg:hidden"
          >
            <Grain />
            <nav className="relative flex flex-col px-6 py-4">
              {links.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className="border-b border-dashed border-background/20 py-4 text-lg font-medium text-background last:border-b-0"
                >
                  {label}
                </a>
              ))}
            </nav>
            <div className="relative border-t border-background/12 px-6 py-4">
              <LanguageSwitch
                className="flex items-center gap-2 font-mono text-xs text-background/60"
                linkClassName="transition-colors hover:text-background"
                separatorClassName="text-background/60"
                ariaLabel={ariaLabelLanguage}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
