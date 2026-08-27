# FAQ (§11)

Status: approved, ready for implementation.

## Purpose

Build `docs/LANDING_STRUCTURE.md` §11, the last unbuilt section. Sits
between Why Nettyo (§10) and Final CTA (§12) — "answers 'can I trust
them' immediately before the ask." Layout family already reserved in
`DESIGN_SYSTEM.md`'s ledger, row 12: "disclosure grid."

## Reference adaptation

User supplied a Framer-template screenshot as the style reference (2-col
grid, dashed rules, `+` accordion markers). Two elements from it are
dropped rather than copied, per direct instruction:

- **No orange numbered eyebrow chip** ("11 HELP") — orange isn't in the
  palette (mint/teal accent only), and this trailing stretch of the page
  (Portfolio, Final CTA) already used its eyebrow budget per
  `DESIGN_GUIDELINES.md`'s "max one eyebrow per ~3 sections" rule.
- **No stock headshot / testimonial blurb** ("Mia Connor, CEO...") — no
  stock photography anywhere on this site, and no fabricated testimonial.
- **No secondary "Send Message" CTA box** — Final CTA sits immediately
  after this section and already owns that job; a second CTA here would
  compete with it rather than just removing hesitation.

What's kept: the 2-column dashed-rule grid and the `+` expand marker.

## Content — 5 items, honest, reused facts where they exist

Per `LANDING_STRUCTURE.md`'s suggested topics (process, timeline,
pricing, data security, replaces existing tools). Security and pricing
answers reuse facts already established elsewhere on the page rather than
inventing new claims:

1. **Process** — reworded from `process.supporting` ("no empezamos
   escribiendo código...").
2. **Timeline** — deliberately non-specific (no invented number of days/
   weeks): a real timeline comes after the initial consultation, not a
   generic estimate up front.
3. **Pricing** — ties to Final CTA's "Consultoría inicial gratuita"
   marker (§12) — same claim, not a new one.
4. **Security** — reuses Technical Credibility's (§9) RBAC + encryption
   facts verbatim in sentence form, not new claims.
5. **Replaces existing tools** — ties to Problem's disconnected-tools pain
   point and Capabilities' "Integraciones" item — reframes the same
   position as reassurance instead of a pain point.

## Component

New file: `app/components/sections/Faq.tsx`. Native `<details>/<summary>`
per item — free accordion behavior and keyboard support, no client JS
state needed (unlike `WhyNettyoTabs.tsx`, which needs state because it's
a tablist, not independent disclosures). `list-none` to hide the default
marker, replaced with a `+` that rotates 45° via `group-open:rotate-45`
(Tailwind's open-state variant on `<details>`) to read as `×` when
expanded.

## Layout

Same sticky-headline + matrix-wrapper pattern as `Capabilities.tsx` /
`TechnicalCredibility.tsx`: headline in the left sticky column
(`lg:col-span-2`), items in a `GridCell`-based dashed matrix
(`lg:col-span-4 lg:col-start-3`), reusing `GridCell`'s existing
`perRow: {base: 1, sm: 2, lg: 2}` border logic exactly as `Problem.tsx`
already does for its own 2-column matrix — no new border-math code.

## Doc updates

- `LANDING_STRUCTURE.md` §11 → `[x]`.
- `DESIGN_SYSTEM.md` ledger row 12 already says "disclosure grid" —
  matches, no change needed.

## Out of scope

- No search/filter, no category grouping — 5 items doesn't need it.
- No animation on expand/collapse beyond the native `<details>` toggle
  and the marker rotation — a height transition on `<details>` needs a
  measured-height JS workaround for no real benefit at this scale.
