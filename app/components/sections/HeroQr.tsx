// Static QR module matrix for https://www.nettyo.com (error correction M),
// generated offline and baked in as a single SVG path — no runtime QR
// library, no third-party QR image API/request. Verified to decode back to
// the same URL before baking in. Re-generate the path if the URL ever
// changes: build the module matrix with the `qrcode` Python package
// (ERROR_CORRECT_M, border=0) and walk each row collapsing runs of dark
// modules into "Mx yhw v1h-w z" segments.
const QR_PATH =
  "M0 0h7v1h-7zM9 0h3v1h-3zM13 0h1v1h-1zM16 0h1v1h-1zM18 0h7v1h-7zM0 1h1v1h-1zM6 1h1v1h-1zM9 1h1v1h-1zM13 1h4v1h-4zM18 1h1v1h-1zM24 1h1v1h-1zM0 2h1v1h-1zM2 2h3v1h-3zM6 2h1v1h-1zM8 2h2v1h-2zM14 2h2v1h-2zM18 2h1v1h-1zM20 2h3v1h-3zM24 2h1v1h-1zM0 3h1v1h-1zM2 3h3v1h-3zM6 3h1v1h-1zM8 3h3v1h-3zM12 3h2v1h-2zM16 3h1v1h-1zM18 3h1v1h-1zM20 3h3v1h-3zM24 3h1v1h-1zM0 4h1v1h-1zM2 4h3v1h-3zM6 4h1v1h-1zM8 4h1v1h-1zM10 4h1v1h-1zM13 4h1v1h-1zM16 4h1v1h-1zM18 4h1v1h-1zM20 4h3v1h-3zM24 4h1v1h-1zM0 5h1v1h-1zM6 5h1v1h-1zM8 5h1v1h-1zM13 5h3v1h-3zM18 5h1v1h-1zM24 5h1v1h-1zM0 6h7v1h-7zM8 6h1v1h-1zM10 6h1v1h-1zM12 6h1v1h-1zM14 6h1v1h-1zM16 6h1v1h-1zM18 6h7v1h-7zM8 7h1v1h-1zM11 7h1v1h-1zM15 7h2v1h-2zM0 8h1v1h-1zM2 8h5v1h-5zM10 8h1v1h-1zM12 8h5v1h-5zM18 8h5v1h-5zM1 9h2v1h-2zM4 9h2v1h-2zM7 9h1v1h-1zM10 9h3v1h-3zM16 9h2v1h-2zM19 9h1v1h-1zM23 9h1v1h-1zM0 10h7v1h-7zM8 10h1v1h-1zM12 10h2v1h-2zM15 10h1v1h-1zM17 10h5v1h-5zM23 10h2v1h-2zM1 11h2v1h-2zM7 11h2v1h-2zM14 11h4v1h-4zM19 11h1v1h-1zM24 11h1v1h-1zM0 12h3v1h-3zM4 12h1v1h-1zM6 12h2v1h-2zM11 12h1v1h-1zM13 12h8v1h-8zM22 12h3v1h-3zM0 13h1v1h-1zM3 13h1v1h-1zM5 13h1v1h-1zM8 13h3v1h-3zM12 13h2v1h-2zM16 13h2v1h-2zM19 13h1v1h-1zM21 13h1v1h-1zM23 13h1v1h-1zM0 14h1v1h-1zM4 14h3v1h-3zM8 14h1v1h-1zM10 14h1v1h-1zM13 14h9v1h-9zM23 14h2v1h-2zM0 15h1v1h-1zM2 15h2v1h-2zM5 15h1v1h-1zM7 15h1v1h-1zM9 15h1v1h-1zM12 15h1v1h-1zM14 15h4v1h-4zM19 15h2v1h-2zM24 15h1v1h-1zM0 16h1v1h-1zM2 16h1v1h-1zM5 16h2v1h-2zM8 16h3v1h-3zM12 16h9v1h-9zM22 16h1v1h-1zM8 17h1v1h-1zM13 17h1v1h-1zM15 17h2v1h-2zM20 17h2v1h-2zM0 18h7v1h-7zM11 18h2v1h-2zM14 18h1v1h-1zM16 18h1v1h-1zM18 18h1v1h-1zM20 18h1v1h-1zM22 18h3v1h-3zM0 19h1v1h-1zM6 19h1v1h-1zM8 19h1v1h-1zM11 19h1v1h-1zM14 19h1v1h-1zM16 19h1v1h-1zM20 19h2v1h-2zM0 20h1v1h-1zM2 20h3v1h-3zM6 20h1v1h-1zM8 20h1v1h-1zM11 20h1v1h-1zM15 20h6v1h-6zM22 20h3v1h-3zM0 21h1v1h-1zM2 21h3v1h-3zM6 21h1v1h-1zM8 21h2v1h-2zM12 21h2v1h-2zM15 21h2v1h-2zM18 21h1v1h-1zM20 21h5v1h-5zM0 22h1v1h-1zM2 22h3v1h-3zM6 22h1v1h-1zM8 22h1v1h-1zM10 22h1v1h-1zM13 22h2v1h-2zM16 22h1v1h-1zM21 22h2v1h-2zM24 22h1v1h-1zM0 23h1v1h-1zM6 23h1v1h-1zM10 23h1v1h-1zM12 23h2v1h-2zM15 23h3v1h-3zM19 23h3v1h-3zM24 23h1v1h-1zM0 24h7v1h-7zM8 24h2v1h-2zM12 24h1v1h-1zM14 24h1v1h-1zM19 24h6v1h-6z";

// Conference-screen aid: a small "scan to visit" badge, shown only when
// SHOW_HERO_QR=true. Kept out of Hero's Grid flow — the grid's 6 columns are
// already fully claimed by the brand mark and headline — and anchored to the
// section's right edge instead, matching the CTA block's bordered/
// corner-bracket treatment.
export default function HeroQr() {
  return (
    <div className="hidden flex-col items-center gap-3 xl:absolute xl:top-1/2 xl:right-32 xl:flex xl:-translate-y-1/2">
      <div className="relative border border-foreground/15 bg-surface p-3">
        <span className="pointer-events-none absolute -top-2 -left-2 h-4 w-4 border-t border-l border-accent-strong" />
        <span className="pointer-events-none absolute -right-2 -bottom-2 h-4 w-4 border-r border-b border-accent-strong" />
        <svg viewBox="-2 -2 29 29" className="h-28 w-28" shapeRendering="crispEdges" aria-hidden>
          <rect x="-2" y="-2" width="29" height="29" className="fill-surface" />
          <path d={QR_PATH} className="fill-foreground" />
        </svg>
      </div>
      <span className="font-mono text-[11px] tracking-wider text-foreground-secondary uppercase">
        nettyo.com
      </span>
    </div>
  );
}
