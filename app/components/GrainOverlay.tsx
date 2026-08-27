// Film grain, anchored to the viewport rather than to the page: fixed, so the
// texture stays still while content scrolls beneath it.
//
// One page-level layer instead of one per section. The noise is white at low
// alpha, so over the paper background it is imperceptible (241 to ~243) and
// only resolves on the dark section, which is where it is wanted. Tiled PNG,
// not a CSS filter: a static paint costs nothing on scroll where a
// backdrop-filter would repaint every frame.
export default function GrainOverlay({ opacity = 0.55 }: { opacity?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20"
      style={{
        backgroundImage: "url(/media/grain.png)",
        backgroundSize: "128px 128px",
        opacity,
      }}
    />
  );
}
