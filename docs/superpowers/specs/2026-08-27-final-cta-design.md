# Final CTA (§12) + /contacto page

Status: approved, ready for implementation.

## Purpose

Build `docs/LANDING_STRUCTURE.md` §12 (currently `[ ]`), the page's actual
conversion point — nothing after Why Nettyo (§10) currently gives a
visitor a way to act. Both `Header.tsx` and `Hero.tsx` already link to
`#contacto`, so this section's `id` must be `contacto`.

## Two-part scope

1. **On-page Final CTA section** (`app/components/sections/FinalCta.tsx`) —
   the closing statement + hand-off, added after Why Nettyo in
   `app/page.tsx`.
2. **New `/contacto` page** (`app/[lang]/contacto/page.tsx`) — the actual
   form + booking widget, hosted on GoHighLevel (white-labeled at
   `api.getsyntra.io`). Same path segment for both locales (`/es/contacto`,
   `/en/contacto`) — matches the existing convention of non-localized
   anchor ids like `#contacto`, `#capacidades`.

This two-step handoff (on-page closing statement → dedicated page with the
real embed) is what keeps the "consultative, low-pressure" framing from
`LANDING_STRUCTURE.md` intact despite the form no longer living directly
on the landing page.

## On-page Final CTA — layout

**Not** a "form + artwork split" (the ledger's original placeholder name)
— there's no form to show here anymore, so a two-column split would leave
an empty second column. Centered block instead:

- Eyebrow (reuse the existing mono-eyebrow pattern, budget permitting per
  `DESIGN_GUIDELINES.md`'s "max one eyebrow per ~3 sections" rule — check
  the last eyebrow used before adding one).
- Headline: "Cuéntanos cómo opera tu negocio hoy." (ES) / "Tell us how
  your business runs today." (EN).
- One supporting line, Inter, `--foreground-secondary`.
- One primary button, same visual weight as `Capabilities.tsx`'s dark CTA
  bar (`bg-foreground text-background`, `font-mono uppercase`), linking to
  `/contacto`. Label: "Cuéntanos tu proceso" (ES, reused verbatim from
  Header/Hero) / "Tell us your process" (EN).
- Three reassurance markers below the button, plain text (not bordered
  tags — quieter than Industries), `font-mono text-xs uppercase
  tracking-wide text-foreground-secondary`, separated by a middot:
  "Sin compromiso · Respuesta en 24h · Consultoría inicial gratuita" (ES).
  Confirmed accurate by the user — not invented claims.
- New layout family for the ledger: **"centered CTA block"** — distinct
  from Solution's "bleed panel + statement" (no bleed, no panel image) and
  Capabilities' dark bar (that's a footer element inside a larger section,
  this is the whole section).

`id="contacto"` on the `<section>`.

## /contacto page

- Reuses `Header` for nav consistency. No `Footer` (§13 isn't built yet
  anywhere else on the site either — add once it exists).
- Headline + one short supporting line above the embed (same tone as the
  Final CTA section — this page is the destination, not a cold landing).
- GHL embed, exactly as provided, via `next/script` for the external
  script tag (`strategy="afterInteractive"`) rather than a raw `<script>`
  tag — the Next-idiomatic way to load a third-party script client-side:

  ```tsx
  <iframe
    src="https://api.getsyntra.io/widget/booking/9zJEhsSDkgNFX4guWUJC"
    style={{ width: "100%", border: "none", overflow: "hidden" }}
    scrolling="no"
    id="9zJEhsSDkgNFX4guWUJC_1787856439491"
  />
  <Script src="https://api.getsyntra.io/js/form_embed.js" strategy="afterInteractive" />
  ```

  The iframe has no fixed height in GHL's own snippet — the embed script
  resizes it dynamically via postMessage, which is why removing the
  height is intentional, not an oversight.
- No placeholder/fallback needed — the real embed code was provided, so
  this page ships functional, not stubbed.

## Doc updates

- `DESIGN_SYSTEM.md` ledger row 13: "Final CTA | form + artwork split" →
  "Final CTA | centered CTA block".
- `LANDING_STRUCTURE.md`: flip §12 to `[x]`.
- `DESIGN_GUIDELINES.md`'s reference-inspiration table, Final CTA row:
  update to reflect the two-page approach (form/calendar live on
  `/contacto`, not embedded on the landing page itself) rather than the
  original single-page pairing.

## Revision (2026-08-27): logo-shaped background artwork

Added a background panel behind the centered text after initial build —
see `docs/ARTWORK.md`'s new "Mask" section for the generator mechanics.
Summary: `scripts/artwork.py`'s pre-existing (unused) `cta` slot now masks
its ASCII mesh by the real Nettyo mark (`Nettyo-Solutions.png`) instead of
noise, uses the brand teal ramp (accent-soft → accent-light → accent —
capped below `accent-strong`, which failed contrast) instead of the
generator's default warm-sand stops, and anchors the mark to the bottom
edge at `mask_scale: 1.7` so it crops and peeks up into frame rather than
sitting whole and centered. Resized from the original 4:5 side-panel shape
to a 2400x1000 full-bleed shape. Rendered via `next/image` with `fill` +
`object-cover` behind `FinalCta.tsx`'s content. Contrast verified with PIL
pixel sampling across the text-safe zone (worst case 5.8:1, clears AA)
rather than eyeballed.

## Out of scope

- No footer on `/contacto` (§13 not built anywhere yet).
- No custom-built form fields — GHL's embed handles the form UI/UX
  entirely; nothing to design there.
- Header/Hero's existing `#contacto` links are left as anchor scrolls to
  the on-page Final CTA section, not changed to link straight to
  `/contacto` — the on-page section is the "build the case" step before
  the ask, consistent with the doc's consultative framing.
