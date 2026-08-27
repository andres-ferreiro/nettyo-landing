# Nettyo Landing Page — Design Guidelines

Visual direction reference. Read alongside `DESIGN_SYSTEM.md` (primitives, the
layout-family ledger, motion and accessibility rules), `ARTWORK.md` (image
generation and raster asset rules), `LANDING_STRUCTURE.md` (section
architecture) and the strategy doc (`Nettyo Solutions Landing Page — Purpose,
Positioning & Content Direction.md`, §22 Visual Direction).

## Overall direction

Modern B2B SaaS company. Minimal, premium, technical, clean, structured,
trustworthy. Avoid looking like a traditional local IT/agency site — should
read as a modern software/product company.

Light theme. Colors from the Nettyo logo (mint/teal), used **subtly** —
accents only, never large color fills.

## Color palette

| Token | Value | Usage |
|---|---|---|
| `--background` | `#F1F0ED` | Page background (warm off-white, not pure white) |
| `--background-alt` | `#E9E6E0` | Alternate section background, warm neutral |
| `--surface` | `#FFFFFF` | Cards, elevated surfaces |
| `--foreground` | `#12181A` | Headlines, body: soft near-black, not pure black |
| `--foreground-secondary` | `#6B665E` | Supporting copy, captions (5.0:1 on `--background`) |
| `--border` | `#DFDBD3` | Hairline borders, dividers |
| `--rule` | `#12181A24` | Dashed structural grid rules (see `GridCell`) |
| `--accent` | `#2DD4BF` | Primary teal — CTAs, links, active states |
| `--accent-light` | `#5EEAD4` | Secondary mint — icons, hover states, subtle gradients |
| `--accent-soft` | `#E6FBF7` | Very light mint tint — badges, pill backgrounds |

Rules:
- The neutral ramp is **warm**. Do not reintroduce cool mint-grays for
  backgrounds, borders or secondary text: they read as dirty against
  `--background`. Mint belongs to the accent ramp only.
- Accent color is for CTAs, icons, thin accent lines, hover/active states —
  never large background fills.
- Gradients (if used) stay subtle: mint-to-white mesh, low opacity, in hero only.
- Sections 3–4 (Problem/Solution) should be the most typographic and
  color-quiet on the page — let sections 7 (portfolio) and 2 (hero) carry
  the visual weight.

## Structural grid

Sections below the hero share one rule system, built from two primitives:

- `app/components/Grid.tsx` with `flush` — zeroes both gap axes so adjacent cell
  borders touch and form continuous vertical rules through a section.
- `app/components/GridCell.tsx` — emits dashed `--rule` borders only where a real
  interior grid line falls, per breakpoint, and draws a small accent crosshair at
  interior intersections (the same language as the hero's corner ticks).

A section whose content is a matrix must wrap its cells in a
`lg:col-span-4 lg:col-start-3` container. As direct `Grid` children the second row
wraps back under the headline column.

## Shape system

Sharp, structured, technical — not the soft/rounded generic-SaaS look.

- Corner radius: **none** (`rounded-none`) on CTAs, badges, nav elements, and
  diagram nodes. This is a hard lock — do not mix in pill/rounded-full
  elements once this is set.
- Thin 1px borders (`--border`) are used as real structural dividers (e.g.
  separating a hero's text column from its visual column), not decoration.
- Mono labels (`font-mono`, uppercase, `tracking-wider`, small size) are used
  for eyebrows/badges — reinforces the technical-editorial feel. Ration
  these: max one eyebrow per ~3 sections page-wide (hero counts as one).

## Typography

- Two voices, both already configured in `app/`: **Inter** (`font-sans`) and
  **Geist Mono** (`font-mono`). Do not introduce a third.
- **Structural text is mono, prose is sans.** Item labels inside a grid cell or
  index row use `font-mono`, uppercase, `tracking-wide`, weight 500, ~15px in a
  matrix cell and ~20-24px in an index row. Descriptions, section headlines and
  all running copy stay Inter. This split is what makes the sections read as
  technical-editorial rather than generic SaaS.
- Mono uppercase reads visually wider than its point size. When converting a
  label from sans to mono, step the size down one notch to keep the same
  perceived weight.
- Headings are Inter **500**, not 600. At 36-52px, 500 reads more confident.
- Confident, concise headline sizing, not oversized or shouty.
- Generous line-height on body copy for a calm, professional read.

## Layout & spacing

- Generous white space; avoid dense, agency-style stacking.
- Consistent max-width container (e.g. 1200–1280px) with comfortable side padding.
- Section vertical rhythm should feel intentional — compact connective
  sections (e.g. Industries strip) vs. full sections (Hero, Portfolio) should
  be visually distinguishable by height/padding, not just content.

## Hero background media

The hero background is `public/media/ascii-animation.mp4`, played by the
client component `app/components/sections/HeroVideo.tsx` (full-bleed,
`object-cover`, muted/looped/autoplaying, paused instead under
`prefers-reduced-motion: reduce`).

It sits behind the whole hero with a left-to-right gradient overlay (solid
`--background` under the text column, fading to transparent toward the
right) so copy stays readable while the animation is visible on the right
side at desktop, and faintly full-bleed on mobile. See
`app/components/sections/Hero.tsx`.

## Reference inspiration (patterns, not copy)

Two Framer template sites the client likes the aesthetic level of: an AI-automation-agency template (structured grid, mono labels, orange accent, hub-and-spoke diagrams) and a second AI-agency template (calmer centered layout, serif display headline, crosshair-framed hero graphic, tree-line pricing). We are **not** cloning either site — borrowing specific layout mechanics where they serve a section's actual conversion goal. Do not reuse their invented stats, section-numbering eyebrows (`01 INTRO`, `05 PROJECTS`), or stock headshots — see `Section 4.7`/`9.F` house rules already baked into this project (max one eyebrow per ~3 sections, no fabricated metrics per the strategy doc, no section-index labels).

Pattern-to-section mapping:

| Section | Borrowed mechanic |
|---|---|
| Process (§6) | Numbered steps (`.01–.04` style chip) each paired with a short "input → decision → execution → result" flow annotation underneath — fits our 6-step Understand→Improve sequence |
| Technical Credibility (§9) | Hub-and-spoke diagram: central Nettyo mark with real tool logos radiating out (WhatsApp, Stripe, Google Calendar, etc. via Simple Icons), representing integrations |
| SaaS Portfolio (§7) | Dot-matrix/halftone treatment applied to **our own product screenshots** (not stock portraits) for a distinctive, less-generic-SaaS look |
| Industries (§8) | Shipped as a hairline tag strip (reusing Portfolio's product categories verbatim) rather than the expandable grid originally sketched here — see `docs/superpowers/specs/2026-08-27-industries-section-design.md`. Kept intentionally light since it's a connective strip, not a full section. |
| Final CTA (§11) | Pair the contact form with an embedded calendar/booking widget so it reads as "book a slot" rather than "submit into a void" |
| New: FAQ (insert before Final CTA) | Simple accordion, 4-5 questions — answers "can I trust them" right before the ask. Not in the original 12-section list; add it. |

Also worth carrying over as general texture: one deliberate dark section break somewhere in the page (both references do this once, e.g. around the portfolio/case-studies section) for visual rhythm — this is the one exception the design-taste rules allow to the light-theme lock, used exactly once, not alternated randomly.

## Custom illustrations

Section illustrations are raster line art with mint accents, matching the
reference set's weight.

- `public/media/custom-icons/` holds the **originals** (1254px PNG, opaque,
  ~800KB each). Treat these as source files, never reference them from a
  component.
- `public/media/icons/` holds the **prepared** versions the page actually uses
  (440px lossless WebP, ~8-12KB each).

Three things the preparation step must do, because the raw exports fail all
three:

1. **Normalize scale.** Artwork occupies 33-35% of the frame in some exports
   and 68% in others. Crop every icon to the *same* box size (880px, centered
   on its ink bounding box) so relative scale and stroke weight stay honest
   across a row. Do not crop each to its own bounds.
2. **Flatten the background.** The exports carry generative grain and their
   base colours differ by up to 3 levels. Snap everything within tolerance to
   exactly `--background` (`#F1F0ED`), or the icons show as faint boxes when
   placed side by side.
3. **Save lossless.** Lossy WebP re-adds +-2 noise across the flat field, which
   recreates the faint-box effect. Lossless is also ~10x smaller here, since
   the grain was what cost the bytes.

Icons are decorative: `alt=""`, with the label carrying the meaning.

**Match illustrations by meaning, not by filename.** The current set is numbered
1-4 but reads 1 = filter/qualify, 2 = route/connect, 3 = document to structured
data, 4 = analytics. These are capability illustrations, so they sit against the
Problem section's pain points imperfectly by design (see the mapping comment in
`Problem.tsx`); "WhatsApp como sistema" has no true match in the set.

## Visual components to favor

- Real product UI screenshots / dashboard mockups (Compass, Sanvia, Clubiit,
  Reviw, Mandhy) — never generic stock photography.
- Clean line icons for capabilities/architecture grids.
- Simple workflow/process diagrams (numbered steps, connecting lines).
- Product cards with subtle elevation (soft shadow, thin border) rather than
  heavy drop shadows.
- Browser/device mockup frames around product screenshots when helpful.

## Responsive

- Design mobile-first for content-heavy sections (Capabilities, Portfolio,
  Process) — these are the ones most likely to overflow on small screens.
- Portfolio section: grid on desktop, horizontal scroll/carousel on mobile.
- Sticky header must collapse to a compact mobile nav (hamburger or minimal
  bar) without losing the CTA.

## What to avoid

- Aggressive/loud CTA styling (no neon, no all-caps "BUY NOW" energy).
- Large solid-color blocks in accent teal.
- Stock photography of "business people shaking hands," generic laptops, etc.
- Overly technical visual language (code snippets, terminal aesthetics) —
  this is a B2B decision-maker audience, not developers.
