# Industries strip (§8)

Status: approved, ready for implementation.

## Purpose

Build out `docs/LANDING_STRUCTURE.md` §8 ("Portfolio Narrative /
Industries"), currently `[ ]`. Sits between Portfolio (§7) and Technical
Credibility (§9) in `app/page.tsx`. Conversion goal per that doc: "they
understand different industries."

Per the doc's own build note: "Section 8 must stay compact — treating it
as a full-height block slows the scroll right after the strongest
credibility section (portfolio)." This is a connective strip, not a
section with its own headline/paragraph/CTA rhythm.

## Content — reused, not invented

The five industries are already the `category` field on each Portfolio
product (`app/[lang]/dictionaries/{es,en}.json`, `portfolio.products[]`).
No new copy is written for the tags themselves:

| Product | ES category | EN category |
|---|---|---|
| Compass | Programas de lealtad | Loyalty programs |
| Mandhy | Automatización con IA y CRM | AI automation and CRM |
| Reviw | Reputación online | Online reputation |
| Sanvia | Software para salud | Healthcare software |
| Clubiit | Gestión de clubes deportivos | Sports club management |

Only new copy: one eyebrow line reused as the section's mono label —
"Industrias donde ya hemos trabajado" (ES) / "Industries we've already
worked in" (EN).

## Layout — same family as `ClientsMarquee`, static instead of animated

One row, `border-b border-border`, `py-12`, matching `ClientsMarquee.tsx`
exactly in structure:
- Mono-uppercase label, left column (`col-span-2 sm:col-span-4
  lg:col-span-2 lg:col-start-1`).
- Content in columns 3–6 (`col-span-2 sm:col-span-4 lg:col-span-4
  lg:col-start-3`).

Distinct enough from `ClientsMarquee` to not violate the "no two sections
share a layout family" rule despite the shared row structure: content
shape differs (static wrapped tag row vs. an animated infinite marquee),
which is a content-shape difference on top of the sticky/alignment/
direction test already in `DESIGN_SYSTEM.md`. The pairing is deliberate —
Clients Marquee opens the credibility run at the top of the page, this
strip closes it right after Portfolio, both sharing the same compact
row language.

## Component

New file: `app/components/sections/Industries.tsx`. No new shared
primitive — the tag markup is simple enough to inline (unlike `StatCard`,
which had real reuse value across sections).

Tags: `inline-flex flex-wrap gap-3`, each tag `border border-border`,
`rounded-none`, `px-3 py-1.5`, `font-mono text-xs tracking-wide
text-foreground-secondary uppercase`. No icons. Text only — deliberately
quieter than Portfolio's product cards directly above it.

## Doc updates

- `DESIGN_SYSTEM.md` ledger: insert a new row 9, "Industries | hairline
  tag strip," and shift the existing rows 9–14 down by one (Technical
  Credibility becomes 10, Integrations/Why Nettyo etc. shift
  accordingly — verify against the current table before editing, since
  it was already corrected once during the stat-cards work).
- `LANDING_STRUCTURE.md`: flip §8 to `[x]` once built.

## Motion

`FadeIn` wrapper on the tag row only, no stagger (five tags appearing at
once as one group reads better than a per-tag cascade for a strip this
compact). Matches `ClientsMarquee`'s restraint — that section has no
`FadeIn` at all since it's a continuous marquee; this one gets a single
fade since it's static.

## Out of scope

- No new industries beyond the five existing products — this section
  reflects the current portfolio, not a roadmap.
- No icons, images, or per-tag color coding.
