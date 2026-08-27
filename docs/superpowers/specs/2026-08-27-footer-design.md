# Footer (§13)

Status: approved, ready for implementation.

## Purpose

Build `docs/LANDING_STRUCTURE.md` §13, the last unbuilt section — "logo,
nav links, product links, contact info, ES/EN, socials, legal." No
strategy-doc detail existed for the actual values, so contact info and
location came directly from the user rather than being invented:
`contacto@nettyo.com`, `+52 657 101 4531`, based in Cd. Juárez, Chihuahua
and El Paso, TX, but works with clients worldwide remotely. No socials or
legal pages exist yet — both explicitly deferred, not omitted by mistake.

## Relationship to Final CTA — cut off, not continued

Final CTA ends on a saturated teal bleed. The footer does **not** continue
that bleed into one long teal block: it's `border-t border-border`, plain
`--background`, a clean section boundary. The two sections still read as
a deliberate pair (both carry the same ASCII-mask motif from
`scripts/artwork.py`), but bookend rather than blur into each other —
CTA is the loud climax, footer is the quiet close.

## Artwork — new `footer` slot

Extends the `mask` capability (`docs/ARTWORK.md`) with a second mask
source: rendered text instead of an image file. `spec["mask_text"]` (e.g.
`"NETTYO SOLUTIONS"`) draws the string with a heavy system face
(`Arial Black.ttf` — chosen only for a strong, clean silhouette; nothing
about the rendered site typography, which stays Inter/Geist Mono/Doto)
onto a temporary canvas, and that becomes the alpha source the mesh masks
against — same code path as `cta`'s image mask, just a different origin
for the alpha channel.

- `mask_anchor: "bottom"`, large enough that only the upper half of the
  wordmark's letterforms are in frame — same "peeking" language as `cta`.
- Ramp: flat and neutral, `(0.00, PAPER)` → `(1.00, (223, 219, 211))`
  (close to `--border`) — no hue, which is what makes this read as a
  "light overlay" rather than another gradient panel. Two-stop ramp, not
  the multi-stop brand ramps used elsewhere, because there's no color
  travel to encode.
- Size: wide, shorter than `cta` (footer has less vertical room) —
  `2400x600`.

## Layout — 4-column grid, distinct from every other family

New ledger row, "Footer | wordmark strip + link columns" — distinct from
Final CTA's centered block (this one is left-aligned, multi-column, no
sticky headline) and from Capabilities' editorial index (this one has no
descriptions, just link lists).

`Grid`, four columns at `lg` (via direct `col-span` on each block, not
the sticky-headline pattern used elsewhere — footers don't have a
headline to stick):

1. Mark (`Nettyo-Solutions.png`, same small size as `Header.tsx`) + "NETTYO"
   wordmark text + location line: "Cd. Juárez, Chihuahua · El Paso, TX —
   clientes en todo el mundo, 100% remoto" (ES) / "Cd. Juárez, Chihuahua ·
   El Paso, TX — clients worldwide, fully remote" (EN).
2. Nav links: Servicios (`#capacidades`), Productos (`#productos`), Proceso
   (`#proceso`), Contacto (`#contacto`) — reused verbatim from
   `header` dictionary keys, not new copy.
3. Product links: the 5 products from `portfolio.products[]`, name +
   external `url`, reused verbatim — no new copy.
4. Contact: `mailto:contacto@nettyo.com`, WhatsApp as
   `https://wa.me/526571014531` (international format, no `+`/spaces/
   dashes, per WhatsApp's own link format) displaying `+52 657 101 4531`,
   plus the ES/EN switch (same two `Link`s as `Header.tsx`, same
   `/es`/`/en` hrefs).

Bottom row, full width, `border-t border-border`, small mono text:
copyright line only — "© 2026 Nettyo Solutions." (ES/EN identical, it's
just a company name + year). No terms/privacy links (none exist).

## Component

New file: `app/components/Footer.tsx` (not under `sections/` — matches
`Header.tsx`'s placement at the component root, since both are page
chrome rather than a scrollable content section).

## Doc updates

- `DESIGN_SYSTEM.md` ledger row 14: "Footer | footer rows" → "Footer |
  wordmark strip + link columns."
- `LANDING_STRUCTURE.md` §13 → `[x]`.
- `ARTWORK.md`: document `mask_text` alongside the existing `mask`
  section, and add the `footer` row to the slot table.

## Revision (2026-08-27): two-zone layout, not artwork behind link text

Built as designed, then hit a real contrast problem verifying it: real
link text sitting directly on the masked artwork failed AA even with the
glyph ink dialed down to near-invisible (`ink: 0.03` still measured
3.87:1 against `--foreground-secondary`; the bare ramp's darkest stop
alone measured only 4.13:1, before any glyph ink). Chasing this by
shrinking `ink` further doesn't converge — it was heading toward
literally removing the artwork.

Fixed by restructuring `Footer.tsx` into two zones instead: a solid
`--background` block holding all real content (logo, nav, product links,
contact, copyright — nothing behind it), and a separate text-free
decorative strip below it holding the artwork at full visual strength.
Once nothing readable overlaps the mask, it's decorative (`alt=""`) and
exempt from text-contrast rules entirely — `ink` went back up to `0.55`
for real visual presence instead of a chased-to-invisible compromise. See
`docs/ARTWORK.md`'s "Text masks and `ink`" section for the full generator
mechanics (also added `mask_text` and `mask_peek`, both new).

## Revision (2026-08-27): transparent artwork + scroll-linked reveal

Per direct feedback on the built version: the flat neutral ramp behind
the wordmark read as an unwanted background rectangle, not "just the
text." Fixed via `scripts/artwork.py`'s new `transparent` flag — the
`footer` slot now saves pure alpha (glyph ink only, verified as
`(0,0,0,0)` at a corner pixel after a round-trip through Pillow's AVIF
encoder/decoder), so the page's own `--background` shows through
everywhere else. See `docs/ARTWORK.md`'s new "`transparent`" subsection.

Also added a scroll-linked reveal: `FooterArt.tsx` (new client component,
extracted out of `Footer.tsx` since the animation needs hooks and
`Footer` itself is an async server component) starts the artwork
partially hidden — mostly "NETTYO," only a hint of "SOLUTIONS" — and
animates it to full reveal via `translateY`, driven by `useScroll`
targeting the strip with `offset: ["start end", "end end"]`. That offset
means progress reaches `1` exactly when the visitor scrolls to the true
end of the page (this is the last element on it), so the reveal reads as
a small payoff for reaching the bottom rather than an arbitrary scroll
effect. Transform-only (`y`), gated on `useReducedMotion`, per
`DESIGN_SYSTEM.md`'s motion rules.

## Out of scope

- No social links (none exist yet).
- No terms/privacy pages (none exist yet) — only a copyright line.
- No footer newsletter signup, sitemap, or other common footer patterns
  not asked for.
