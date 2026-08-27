# Stat cards + Technical Credibility section (§9)

Status: approved, ready for implementation.

## Purpose

Introduce a reusable `StatCard` component and use it to build out
`docs/LANDING_STRUCTURE.md` §9 ("Technical Credibility / Architecture"),
currently `[ ]`. Conversion goal per that doc: "can I trust the
engineering?"

This is a deliberate, documented exception to two existing rules (see
"Doc updates" below): a third typeface (Doto) and a bordered-card layout
family. Both are scoped narrowly so they don't bleed into the rest of the
site.

## Component — `StatCard`

New file: `app/components/StatCard.tsx`.

Props: `value: string`, `label: string`, `caption?: string`,
`variant: "plain" | "glass"`.

Anatomy (same for both variants):
- **Value** — large, `font-doto` (thin weight), the focal element. Can be
  a number (`"20+"`) or a short term (`"RBAC"`) — Doto reads fine as
  either, and forcing every card into a numeric stat is what leads to
  invented metrics.
- **Label** — `font-mono`, uppercase, `tracking-wide`, matches the
  existing structural-label spec in `DESIGN_SYSTEM.md` (weight 500, ~15px).
- **Caption** (optional) — one line, Inter, `--foreground-secondary`.

Variants:
- **`plain`** (used in §9) — `--surface` background, 1px `--border`
  outline, `rounded-none`. No blur, no shadow. This is what a "card" can
  be within the existing "no elevated cards" rule: a bordered block, not
  a floating one.
- **`glass`** (not used yet, built for reuse) — `backdrop-blur-md`,
  translucent white fill (`bg-white/60` or similar), `rounded-none`, no
  border, no shadow. Only valid when placed over an image, gradient, or
  dark panel that gives the blur something to do — e.g. a future stat row
  inside Portfolio's dark deck. Do not use `glass` on the plain
  `--background`/`--background-alt` surface — there's nothing behind it
  to blur, so it would just look like a faint grey box.

## Content — §9 stat row

Four cards, one row, `plain` variant, `--background` page background:

1. **RBAC** / "Role-based access control"
2. **Multi-tenant** / "Isolated data, one platform"
3. **Encrypted** / "In transit and at rest"
4. **20+ hrs/week** / "Lost to manual work at a typical SMB" — the one
   illustrative, industry-level stat in the row (not a Nettyo-specific
   claim). Framed as general context, not a measured Nettyo result.

Cards 1–3 describe how Nettyo builds systems and must be true of actual
practice — confirm before shipping copy live. Card 4 is deliberately the
"oh, that's us" hook mixed into an otherwise credibility-focused row, per
direction to use stats for real persuasive weight rather than as filler,
while still allowing one creative/illustrative stat.

Do not add more cards to this row later "to fill space" — if a fifth
stat doesn't carry its own weight, leave the row at four.

## Layout

- New layout family in the `DESIGN_SYSTEM.md` ledger: **bordered stat row**
  — distinct from all 13 existing families (no other section uses cards
  at all).
- `Grid` (flush), wrapped the same way the Problem-section matrix wraps
  itself (`lg:col-span-4 lg:col-start-3` container carrying the left
  rule, per `DESIGN_SYSTEM.md`'s "a matrix needs its own wrapper" note),
  with the four cards laid out as equal columns inside it.
- Tablet (4-col grid): 2×2.
- Mobile (2-col grid): 1 column, stacked.
- Section headline above the row, same type scale as Problem/Solution
  (e.g. "Construido para que confíes en la ingeniería.").
- `FadeIn` stagger on the four cards, matching `Capabilities.tsx`'s
  pattern. No new motion primitives.

## Doc updates

- `DESIGN_SYSTEM.md` Typography section: add a line documenting Doto as a
  third voice, scoped **only** to `StatCard`'s `value` slot — never
  headlines, labels, or body copy. Pre-flight sweeps should treat any
  other Doto usage as a violation.
- `DESIGN_SYSTEM.md` Shape section: note that `StatCard`'s bordered block
  is the one sanctioned exception to "no elevated cards" — border only,
  no shadow, no radius, and only for stat values.
- `DESIGN_SYSTEM.md` ledger table: add row `9 | Technical Credibility |
  bordered stat row`.
- `LANDING_STRUCTURE.md`: flip §9 to `[~]`.

## Font setup

Doto is a variable Google Font. Add it the same way Inter/Geist Mono are
already wired (check `app/[lang]/layout.tsx` or wherever `--font-inter` /
`--font-geist-mono` are currently loaded — likely `next/font/google`),
expose it as `--font-doto`, and map a `font-doto` utility in
`app/globals.css` next to the existing `--font-sans` / `--font-mono`
mappings. Use the thin end of its weight axis (100–300) per "doto thin
font."

## Out of scope

- No business-outcome numbers (hours saved for actual clients, client
  count, etc.) until real figures exist — `StatCard` is generic enough to
  drop those in later without changes.
- No `glass` variant usage yet — built for future reuse, not wired into
  any section in this pass.
- No changes to already-built sections (Solution, Capabilities, etc.).
