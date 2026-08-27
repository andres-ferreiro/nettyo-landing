# Nettyo Landing Page — Section Architecture

Reference doc for building the landing page section by section. Derived from
`Nettyo Solutions Landing Page — Purpose, Positioning & Content Direction.md`
(the strategy doc — read that first for full context on positioning, tone,
and business goals).

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

Narrative flow: **problem → solution → capability → proof → conversion**

---

## 1. Header / Nav — `[~]`

- Logo + ES/EN language switch + minimal nav (Servicios, Productos, Proceso, Contacto)
- One CTA button: "Hablemos de tu proceso"
- Sticky; transparent over hero, solid/white on scroll

## 2. Hero — `[~]`

- Headline on business outcome, not tech (see strategy doc §25, Direction B/C blend)
- Subhead: "understand → analyze → build" idea in one line
- Primary CTA: "Cuéntanos cómo opera tu negocio"
- Secondary CTA: "Ver productos"
- Visual: abstract dashboard/UI mockup or subtle animated mint gradient mesh — no stock photography
- **Conversion goal:** visitor understands what Nettyo does

## 3. Problem Recognition — `[x]`

- Names the pain: spreadsheets, WhatsApp, disconnected tools, manual processes
- 4-icon grid or "before" list
- Visually quiet — mostly typographic, no product visuals yet
- **Conversion goal:** "That's literally us."

## 4. Solution / Positioning Statement — `[x]`

- Reframe: "We build software around how you actually work."
- One strong statement + short supporting paragraph
- Optional: simple before/after diagram (chaotic tools → centralized system)
- **Conversion goal:** "They understand the problem."

## 5. Capabilities — `[x]`

- Grid/tabs: CRM, portals, dashboards, automation, integrations, AI workflows
- Icon + short label, scannable, 8–12 items max (not exhaustive prose)
- **Conversion goal:** "Can they build what I need?"

## 6. Process — `[x]`

- Understand → Analyze → Design → Develop → Implement → Improve (strategy doc §9)
- Horizontal stepper or vertical timeline, numbered, one line per step
- Visually distinct — connecting line/diagram
- **Conversion goal:** "How does this work?"

## 7. SaaS Portfolio (major section) — `[x]`

- Product cards: Compass, Sanvia, Clubiit, Reviw, Mandhy
- Each: logo, screenshot/mockup, category tag, one-line positioning, "Explorar producto" link
- Grid on desktop, horizontal scroll/carousel on mobile
- First heavy-visual moment on the page — should land with impact
- **Conversion goal:** "They've actually built real things."

## 8. Portfolio Narrative / Industries — `[x]`

- Compact connective strip, not a full-height section
- "Industrias donde ya hemos trabajado" — tag/pill list (loyalty, healthcare, sports, reputation, AI/CRM)
- **Conversion goal:** "They understand different industries."

## 9. Technical Credibility / Architecture — `[~]`

- Security, roles/permissions, multi-tenancy, scalability, integrations
- Icon + label cards, kept light and non-jargony
- Optional subtle architecture illustration
- **Conversion goal:** "Can I trust the engineering?"

## 10. Why Nettyo (Differentiators) — `[x]`

- "We understand before we build" / "Software adapts to you" / "Product-level UI/UX" / "We build our own products too"
- 3–4 column layout, short statements (strategy doc §26)
- **Conversion goal:** "Why them and not someone else?"

## 11. FAQ — `[x]`

- Added after seeing reference sites — not in the original 12-section brief.
- Simple accordion, 4-5 questions (process, timeline, pricing approach, data
  security, does it replace existing tools).
- Sits right before Final CTA — answers "can I trust them" immediately
  before the ask.
- **Conversion goal:** removes last-mile hesitation before contact.

## 12. Final CTA — `[x]`

- Consultative, low-pressure: "Cuéntanos cómo opera tu negocio hoy."
- Form (name, email, company, brief process description) paired with an
  embedded calendar/booking widget — "book a slot" framing, not "submit into
  a void" (see `DESIGN_GUIDELINES.md` reference inspiration).
- **Conversion goal:** conversion

## 13. Footer — `[x]`

- Logo, nav links, product links, contact info, ES/EN, socials, legal

---

## Build notes

- Section 8 must stay compact — treating it as a full-height block slows the
  scroll right after the strongest credibility section (portfolio).
- Sections 3–4 should be the visually quietest on the page — save product
  visuals for section 7 so the portfolio hits harder as proof.
- Spanish is the default language; English via ES/EN switch (strategy doc §27).
- Spanish copy uses neutral Latin American Spanish ("tú/ti" forms) —
  no voseo ("vos", "reconocés", etc.). Keeps copy consistent across
  Spanish-speaking markets rather than reading as Rioplatense-specific.
- CTAs throughout should feel consultative, never aggressive (no "BUY NOW" style).
