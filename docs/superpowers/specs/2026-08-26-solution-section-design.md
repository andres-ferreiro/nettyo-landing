# Solution / Positioning Statement section (§4)

Status: approved, ready for implementation.

## Purpose

Reframe after the Problem section (§3): "we build software around how you
actually work." Conversion goal per `docs/LANDING_STRUCTURE.md`: "they
understand the problem." Sits between Problem and the next section in
`app/page.tsx`.

## Composition

Mirrored split, reversed from Hero's text-left/visual-right: this section
puts the **diagram on the left, text on the right**. Rationale: Hero
(text-left/visual-right), Problem (full-width stacked grid), Solution
(visual-left/text-right) gives three consecutive sections three distinct
compositions, avoiding the zigzag repetition the design guidelines warn
against.

- Desktop (`lg:`): diagram `lg:col-span-2 lg:col-start-1`, text
  `lg:col-span-3 lg:col-start-4`, within the site's 6-col `Grid`.
- Mobile: stacks text-first, diagram-second, both full width (`col-span-2`).
- Background: `--background` (not `-alt`), consistent with Problem, keeping
  §3-4 the visually quiet pair per `docs/DESIGN_GUIDELINES.md`.
- No eyebrow, no cards.

## Text side

- Headline (max 2 lines): "Construimos software alrededor de cómo
  trabajas."
- One supporting line: "Diseñamos el sistema a partir de tu proceso real,
  no al revés."
- Same type scale as `Problem.tsx`'s headline for rhythm continuity.

## Diagram side

A single thin-bordered box (no corner-bracket decoration — that device is
reserved for Hero). Pure inline SVG, abstract geometric shapes (not icons,
not literal app screenshots):

- Left half: ~6 small squares at scattered, slightly rotated offsets,
  colored `--foreground-secondary` — represents disconnected tools.
- A thin horizontal line/arrow crossing the middle, dividing before/after.
- Right half: the same 6 squares redrawn as one tight, perfectly aligned
  vertical column, colored `--accent`/`--accent-strong` — represents the
  centralized system.
- This is the only accent-color usage in the section, and it is
  meaningful (chaos = gray, resolved system = teal), not decorative.

## Motion

Wrap the whole diagram and the text block each in one `FadeIn` (staggered
delays), matching the existing pattern in `Hero.tsx` and `Problem.tsx`. No
per-square stagger, no GSAP — stays consistent with the site's existing
motion vocabulary (Motion library only).

## Component

New file: `app/components/sections/Solution.tsx`. Added to `app/page.tsx`
directly after `Problem`.
