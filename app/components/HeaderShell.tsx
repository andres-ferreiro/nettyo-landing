"use client";

import { useEffect, useState, type ReactNode } from "react";

const BAND = 72; // the header's own height, in px

// The header floats over whatever is beneath it. Its text is near-black, so
// over a dark section it only stayed legible because of a white veil, and that
// veil read as a distracting light bar. Instead the header inverts: it watches
// for [data-dark] sections crossing its band and flips its own colour tokens.
export default function HeaderShell({ children }: { children: ReactNode }) {
  const [overDark, setOverDark] = useState(false);

  useEffect(() => {
    const targets = document.querySelectorAll("[data-dark]");
    if (!targets.length) return;

    let io: IntersectionObserver | null = null;
    // Tracked as a set rather than a boolean: with more than one dark section
    // on the page, "last entry wins" would clear the flag while another dark
    // section is still behind the header.
    const inBand = new Set<Element>();

    const attach = () => {
      io?.disconnect();
      inBand.clear();
      // Shrinks the observer root to just the header's band, so "intersecting"
      // means "this section is currently behind the header".
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) inBand.add(e.target);
            else inBand.delete(e.target);
          });
          setOverDark(inBand.size > 0);
        },
        { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - BAND)}px 0px` },
      );
      targets.forEach((t) => io!.observe(t));
    };

    attach();
    window.addEventListener("resize", attach);
    return () => {
      io?.disconnect();
      window.removeEventListener("resize", attach);
    };
  }, []);

  return (
    <header
      data-header
      data-over-dark={overDark || undefined}
      className="fixed inset-x-0 top-0 z-30"
    >
      {children}
    </header>
  );
}
