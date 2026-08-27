// Dot-matrix texture band, the reference's halftone weight without any new ink
// in the copy. Pure CSS radial-gradient: a static paint, not a filter, so it
// costs nothing on scroll. Radial mask fades it out on all four sides.
export default function HalftoneBand({
  className = "",
  size = 8,
}: {
  className?: string;
  size?: number;
}) {
  const mask = "radial-gradient(ellipse at center, black 35%, transparent 72%)";

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      style={{
        backgroundImage: "radial-gradient(var(--rule) 1px, transparent 1px)",
        backgroundSize: `${size}px ${size}px`,
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
