"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

// Types the joined headline out character by character, remapping line
// breaks as they're revealed. The full text stays on the element via
// aria-label (set by the caller); this visual layer is aria-hidden so
// screen readers get the real headline immediately instead of the reveal.
export default function TypingHeadline({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();
  const full = lines.join("\n");
  const [count, setCount] = useState(reduce ? full.length : 0);

  useEffect(() => {
    if (reduce || count >= full.length) return;
    const timer = setTimeout(() => setCount((c) => c + 1), 32);
    return () => clearTimeout(timer);
  }, [count, full, reduce]);

  const done = count >= full.length;
  const revealedLines = full.slice(0, count).split("\n");

  return (
    <span aria-hidden="true">
      {revealedLines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
      <span
        className={`ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.05em] bg-accent-strong align-middle ${
          done ? "animate-pulse" : "opacity-100"
        }`}
      />
    </span>
  );
}
