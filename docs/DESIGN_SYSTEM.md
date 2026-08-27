# Design System

How the page is built. `DESIGN_GUIDELINES.md` covers what it should look like;
this covers the primitives and the rules that keep sections from converging on
the same shape. `ARTWORK.md` covers imagery.

## The grid

Two primitives carry every section below the hero.

- **`app/components/Grid.tsx`** — 6 columns at `lg`, 4 at `sm`, 2 at base;
  `max-w-[1600px]`; `px-16` at `lg`. The `flush` prop zeroes **both** gap axes so
  adjacent cell borders touch and form continuous rules through a section. A
  `gap-y` breaks horizontal rules just as badly as a `gap-x` breaks vertical
  ones, which is why it zeroes both. Padding then lives inside the cells.
- **`app/components/GridCell.tsx`** — emits dashed `--rule` borders only where a
  real interior grid line falls, per breakpoint, and draws a small accent
  crosshair at interior intersections.

**A matrix needs its own wrapper.** Four `col-span-2` cells placed as direct
`Grid` children alongside a `col-span-2` headline do *not* form a 2x2 in columns
3-6: the second row wraps back under the headline. Wrap them in a
`lg:col-span-4 lg:col-start-3` container that carries the left rule.

Sections that share a rule position (currently Problem and Capabilities, both at
column 3) produce one continuous vertical line down the page. That is
deliberate; keep new sections on the same column boundary where it makes sense.

## Typography

Two voices, both already configured. Do not add a third — **except** Doto
(`font-doto`), a dot-matrix display face scoped *only* to `StatCard`'s
numeric `value` slot (§9's stat row). Never use it for headlines, labels, or
body copy, and never pass it a multi-word phrase — dot-matrix letterforms
read fine as digits or a short code (`"24/7"`, `"RBAC"`) but not as prose.
Any other Doto usage is a violation, not a precedent.

| Role | Font | Spec |
|---|---|---|
| Section headline | Inter | 500, `text-3xl sm:text-4xl`, `tracking-tight` |
| Display headline | Inter | 500, up to `text-[3.25rem]`, `leading-[1.05]` |
| Structural label | Geist Mono | 500, uppercase, `tracking-wide`, 15px in a cell / 20-24px in an index row |
| Body, description | Inter | 400, 15-16px, `leading-[1.45]` |

**Structural text is mono, prose is sans.** Item labels inside a grid cell or an
index row are mono; descriptions, headlines and running copy are Inter. This
split is what makes the page read technical-editorial rather than generic SaaS.

Mono uppercase reads visually wider than its point size. Converting a label from
sans to mono means stepping the size down one notch to hold the same weight.

Headings are weight **500**, not 600. At 36-52px, 500 reads more confident.

## Shape

Radius is `0` everywhere. No `rounded-*` utility appears anywhere in `app/`, and
that is checked in the pre-flight sweep. There are no elevated cards on the page:
grouping is done with rules, spacing and background, never with a floating box.

**`StatCard` is the one sanctioned exception** (§9's stat row): a solid
`--border` outline plus `--surface` fill, still `rounded-none`, no shadow. It
reads as a bordered block, not a floating one — the distinction that keeps it
from re-opening the door to generic SaaS cards elsewhere. Its `glass` variant
(`backdrop-blur`, translucent fill, no border) is built for reuse but not
wired into any section yet — only valid over an image, gradient, or dark
panel; never on the plain page background, where there's nothing to blur.

## The layout-family ledger

The rule that stops section 11 from accidentally looking like section 4: **no two
sections share a layout family.**

| # | Section | Family |
|---|---|---|
| 1 | Header | fixed bar |
| 2 | Hero | media + asymmetric split |
| 3 | Clients | marquee (the page's only one) |
| 4 | Problem | grid matrix 2x2 |
| 5 | Solution | bleed panel + statement |
| 6 | Capabilities | editorial index |
| 7 | Process | staggered numbered timeline |
| 8 | Portfolio | dark scroll-scrubbed card deck |
| 9 | Industries | hairline tag strip |
| 10 | Technical Credibility | bordered stat row |
| 11 | Why Nettyo | interactive tablist + media panel |
| 12 | FAQ | disclosure grid |
| 13 | Final CTA | centered CTA block |
| 14 | Footer | wordmark strip + link columns |

Adding a section means adding a row here first. If the family is taken, pick
another one.

**A name in this table is not the test. Geometry is.** Process shipped as
"sticky progress stepper" and Capabilities as "editorial index": different names,
identical geometry, and scrolling from one to the other read as the same section
twice. Before claiming two families differ, compare three things:

1. **Sticky behaviour** of the headline column (sticky vs static).
2. **Alignment** of the supporting text (right sub-column vs stacked vs none).
3. **Main-axis direction** (vertical list vs horizontal composition).

If two sections match on all three, they are the same family whatever the table
says. The fix that worked here was swapping families between sections rather
than inventing a new one: Process took the numbered timeline, whose sequential
chips its content actually suits, and Why Nettyo took the tablist.

## Components

| Component | Purpose |
|---|---|
| `Grid`, `GridCell` | the rule system above |
| `FadeIn` | reveal-on-mount wrapper, reduced-motion aware |
| `HalftoneBand` | dot-matrix texture band, CSS radial-gradient, radially masked |
| `SolutionPanel` | the §5 art panel, left viewport bleed plus parallax |
| `CapabilityIndex` | the §6 index rows |
| `StatCard` | the §9 bordered stat blocks (Doto value + mono label + caption) |

Components added per section are listed in the plan and appended here as they
land.

## Motion

`motion` only. No GSAP, no scroll listeners.

- **Never `window.addEventListener("scroll")`.** Use `useScroll` and
  `useTransform`, which run on motion values and do not re-render per frame.
- Animate only `transform` and `opacity`. Tailwind v4 sets `scale`, `translate`
  and `rotate` as standalone properties rather than through `transform`;
  `transition-transform` covers all four, so it still works.
- Every effect above `MOTION_INTENSITY 3` is gated on `useReducedMotion()`.
- **Every animation must justify itself in one sentence** — hierarchy,
  storytelling, feedback, or state transition. "It looked cool" is not one.

Current effects: reveal stagger (all sections), sticky headline columns, panel
parallax (§5), drawn accent rule (§6), marquee (§3), sticky-stack cards (§8),
scroll-drawn timeline rule (§7).

**Sticky does not shorten a section**, and trying to force it to will break the
cards. The cards occupy their full height in normal flow, so a five-card sticky
stack is exactly as tall as five stacked cards. Overlapping the slots with a
negative top margin does shrink the document, but it pulls each card over the
previous one's *caption*, which then never becomes readable. That is the whole
point of the section, so the overlap is not available.

What shipped instead is a **scroll-scrubbed deck**: a tall track, a
viewport-height sticky stage, and all five cards absolutely stacked and centred.
Scroll progress maps to a continuous index, each card derives a signed distance
`d` from it, and `d` drives y / scale / blur / scrim. Card 0 stays in flow so
its natural height opens the stage; transforms never affect layout.

**Do not recede a card with opacity.** A translucent card lets the one behind it
bleed through, so three artworks mix into one and the deck reads as noise. Back
cards stay near-opaque and recede via two other means:

- a **blur** that grows with distance (0, 3, 6px), and
- a **dark gradient scrim** over each card, opacity growing with distance (0,
  0.58, 0.82), tinted to the section ground so a receding card sinks into the
  page rather than turning see-through.

A small amount of opacity is layered back in on top of the scrim (1 to 0.92 to
0.82 across distance) per later feedback that the pure blur+scrim version read
as too flat; the scrim still does most of the depth work, so two artworks never
mix the way pure opacity caused earlier. Opacity is also what brings cards in
and out at the far edges, `|d| > 2`.

**Position and scale hold flat across a dwell window** (`d` within `±0.42`)
before easing to the next slot. Without it, "focused" exists only at one exact
scroll offset, which reads as a needle you have to thread. The shared scroll
index is also run through `useSpring` (stiffness 170, damping 28, mass 0.3)
rather than applied directly, so every derived value eases rather than tracking
the scrollbar one-to-one; a lower stiffness / higher mass reads as heavy and
sluggish.

`z-index` must be **derived from `d`**, not fixed per index: focus moves through
the deck, and whichever card is focused has to win the paint order. Pointer
events are gated the same way, so a receding neighbour cannot swallow a click.

Sticky stacking is `lg` only. On a short viewport the stack crowds, and a plain
scrolling list reads better.

## Accessibility rules learned the hard way

- **Never dim readable text with opacity.** An early Capabilities pass rested
  descriptions at `opacity-40`, which measured ~1.4:1 against the page. Put the
  hover affordance on decorative elements (an icon, a rule) instead, and leave
  prose at full contrast.
- **Nothing hover-only.** Below `lg` every description renders in full with no
  transform. Touch and keyboard lose nothing.
- **Never `outline-none` without a replacement.** Every interactive element takes
  a visible `focus-visible` ring.
- Contrast is measured, not eyeballed. Body text currently computes 5.00:1 and
  the dark CTA bar 15.73:1.

## Verifying

The browser pane has been reporting `visibilityState: "hidden"`, so screenshots
come back blank **and CSS transitions freeze mid-flight**. A `getComputedStyle`
reading taken during a frozen transition returns the animated value, not the
resting one — that has produced two false bug reports already. When a computed
value looks wrong, check `element.getAnimations()` before believing it, or read
the generated stylesheet directly.

Verification is therefore measured DOM geometry and computed style: rule
positions against expected column boundaries, collapse behaviour at 375 / 768 /
1440, contrast ratios computed from `getComputedStyle`, and console clean on
**both** `/es` and `/en` (a missing dictionary key is the likeliest break when
adding a section).
