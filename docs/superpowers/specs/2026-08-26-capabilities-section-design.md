# Capabilities section (§5)

Status: approved, ready for implementation.

## Purpose

Show breadth of what Nettyo can build, per `docs/LANDING_STRUCTURE.md`.
Sits between Solution (§4) and Process (§6) in `app/page.tsx`. Conversion
goal: "can they build what I need?"

## Content

Exactly 6 items (matches the doc's own example list, no invented
additions):

1. CRM
2. Portales
3. Dashboards
4. Automatización
5. Integraciones
6. Workflows con IA

Each item: one Phosphor icon (same stroke weight/size as `Problem.tsx`) +
short label only. No description sentence — the terser copy is itself the
contrast with Problem's fuller icon+label+description format.

## Layout — real grid matrix, aligned to the site's column system

Uses the existing 6-col `Grid` component's actual column boundaries, not
decorative lines layered on top (matching the principle already used by
Hero's dashed divider).

- Desktop (`lg:`): each item `lg:col-span-2` → 3 across × 2 rows.
- Tablet (`sm:`, 4-col grid): each item `sm:col-span-2` → 2 across × 3
  rows.
- Mobile (2-col grid): each item `col-span-2` → 1 across × 6 rows, full
  width.
- Vertical dividers: `border-l border-border` on items starting at
  `lg:col-start-3` and `lg:col-start-5` (desktop), and `sm:col-start-3`
  (tablet) — i.e. only where a real column boundary falls, never an
  arbitrary line.
- Horizontal divider: `border-t border-border` on the second row's items
  (desktop: items 4-6; tablet: items 3-6; mobile: items 2-6, since it's a
  single column there).
- Net effect: a true bordered matrix (both directions), distinct from
  Problem's single-row top-border-only layout.

## Section chrome

- No eyebrow (banned per `impeccable` craft-floor and already the house
  rule from Problem/Solution).
- No card containers — hairline grid lines only, per the same rule.
- Background: `--background`, `border-b border-border` around the whole
  section, consistent with Problem/Solution.
- Optional short headline above the grid, matching the type scale used in
  Problem/Solution (e.g. "Lo que podemos construir para vos.") — keeps
  the section from being a bare unlabeled grid. One line, no eyebrow, no
  supporting paragraph needed (the grid itself does the explaining).

## Motion

Each item wrapped in `FadeIn` with a small stagger (matching the pattern
in `Problem.tsx`'s pain-point grid). No new motion primitives.

## Component

New file: `app/components/sections/Capabilities.tsx`. Added to
`app/page.tsx` directly after `Solution`.
