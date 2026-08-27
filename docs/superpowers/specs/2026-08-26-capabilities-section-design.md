# Capabilities section (§5)

Status: approved, ready for implementation.

## Purpose

Show breadth of what Nettyo can build, per `docs/LANDING_STRUCTURE.md`.
Sits between Solution (§4) and Process (§6) in `app/page.tsx`. Conversion
goal: "can they build what I need?"

## Revision (2026-08-27): broadened from technical modules to output types

The original 6 items (CRM, Portales, Dashboards, Automatización,
Integraciones, Workflows con IA) came from the strategy doc's "Custom
Software Capabilities" list — but that framing undersold scope. See
`[[nettyo-actual-service-scope]]` (memory): the audience is non-technical
B2B decision-makers, and a technical-module list risks reading as "this
is the menu," the same failure mode as the Portfolio section reading as
"only 5 products." Nettyo's real scope also includes landing pages, apps,
and custom hardware-with-software builds — none of which the original
list surfaced.

Revised to 6 broader output-type items, plus one new supporting line
under the headline making the open-endedness explicit (a list, however
broad, can still look exhaustive on its own):

## Content

1. Software a medida
2. Apps y plataformas
3. Landing pages y sitios
4. Automatización con IA
5. Hardware + software
6. Integraciones

Each item: one Phosphor icon (same stroke weight/size as `Problem.tsx`) +
label + one-line description (added in this revision — the original's
terser label-only format didn't leave room to communicate breadth
without the description).

Supporting line, headline column, `Problem.tsx`'s supporting-paragraph
slot (same component already supports this — no new layout element):
"No estás limitado a esta lista: si tu negocio lo necesita, lo diseñamos
y construimos." (ES) / "You're not limited to this list: if your
business needs it, we design and build it." (EN)

| # | Item (ES) | Icon | Description (ES) |
|---|---|---|---|
| 1 | Software a medida | `Code` | Sistemas construidos alrededor de cómo opera tu negocio. |
| 2 | Apps y plataformas | `AppWindow` | Web o móvil, para tu equipo o tus clientes. |
| 3 | Landing pages y sitios | `Browser` | Presencia digital que también convierte. |
| 4 | Automatización con IA | `Sparkle` | Tareas repetitivas resueltas sin intervención manual. |
| 5 | Hardware + software | `Cpu` | Dispositivos conectados a sistemas a medida. |
| 6 | Integraciones | `Plugs` | Tus herramientas actuales, conectadas entre sí. |

`CapabilityIndex.tsx`'s icon array is positional (`icons[i]`) — update it
to `[Code, AppWindow, Browser, Sparkle, Cpu, Plugs]` alongside the content
change so icons stay matched to their items.

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
