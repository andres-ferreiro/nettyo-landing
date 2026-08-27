# /contacto rebuild: fullscreen split + GHL-connected form

Status: approved, ready for implementation.

## Purpose

Replace the current `/contacto` (centered headline + raw GHL booking iframe)
with a real lead-capture form: fullscreen two-column split (image left with
overlaid headline, form right), styled to match this site's design system,
submitting real leads into the user's GoHighLevel CRM subaccount server-side.
Reference: a Framer template ("Claura") the user supplied a screenshot of —
mechanic (split layout, pill single-selects) adapted, not copied (no orange,
no stock photo, no fabricated stats — see below).

## Decisions

- **Data mapping**: name/email as standard GHL contact fields; interest,
  challenge, and business description combined into one note. User's explicit
  choice — needs zero custom-field setup in GHL.
- **Booking calendar**: existing iframe stays, but only reachable via a
  "prefer to book a call instead?" CTA in the post-submit success state — not
  shown upfront.
- **Left panel**: real photo comes later. Meanwhile a new generated artwork
  panel (`scripts/artwork.py`'s `contacto-panel` slot, masked by the real
  Nettyo mark, dark near-black-teal) fills the space — one-line `src` swap to
  a real photo later.
- **Server Action**, not an API route — `useActionState` gives pending/error
  state for free, GHL token stays server-only by construction.
- **No Footer on this page** — a true fullscreen split with Footer appended
  either breaks the fullscreen feel or gets pushed below the fold; the
  reference itself has no footer chrome; Header's logo already provides a way
  back to the main site.
- **No client-logo strip** — `ClientsMarquee`'s logos are black-silhouette
  styled for a light background; over the dark placeholder panel they'd be
  nearly invisible. Revisit once the real photo lands.

## Content — dropped from the reference, on purpose

- No orange numbered eyebrow, no stock headshot/testimonial (same house rule
  already applied to FAQ's build).
- No "★★★★★ Helped over 100+ businesses" — no fabricated stats anywhere on
  this site.
- No "you agree to our terms of service" link — no privacy/terms pages exist
  anywhere on this site. Any reassurance line is plain text, no dead link.

## Fields

Name*, Email*, Company (optional) — per `LANDING_STRUCTURE.md`'s original §12
spec (name/email/company/brief description).

**Interest** (single-select pills) — reuses `capabilities.items[].label`
directly: Software a medida, Apps y plataformas, Landing pages y sitios,
Automatización con IA, Hardware + software, Integraciones, plus "Todo lo
anterior."

**Challenge** (single-select pills) — new copy, first-person reworded from
`problem.painPoints[].label` (not verbatim, needs to read as a challenge
statement): "Todo vive en hojas de cálculo," "Las decisiones se pierden en
WhatsApp/chats," "Mis herramientas no se hablan entre sí," "Repito a mano
procesos que deberían estar automatizados."

Free-text: "Cuéntanos sobre tu negocio."

Submit: "Enviar" (not "Book a call" — booking is the secondary post-submit
path now, not this button's job).

## Environment variables (new)

`.env.example` (committed, placeholders): `GHL_API_TOKEN`, `GHL_LOCATION_ID`.
`.env.local` (gitignored, real values added once the user has a token).
`GHL_LOCATION_ID` is likely the subaccount ID mentioned earlier in this
project's history (`geeYLjEZeQBj6RVIBzSq`) — confirm before treating as
certain.

## Server Action — `app/[lang]/contacto/actions.ts`

Native validation (no library): required name/email/interest/challenge,
optional company/message, minimal email regex, single-select values
re-validated server-side against the known option list (never trust
client-submitted values blindly).

Honeypot field (`company_website`, visually hidden, not tab-reachable): if
populated, fake success without calling GHL — minimal standard spam guard, no
CAPTCHA/rate-limiting infra added (disproportionate for this scale).

GHL call: `POST https://services.leadconnectorhq.com/contacts/`, Bearer token
+ `Version` header, `locationId` + name/email/company. Combined note (interest
+ challenge + message) sent via an isolated `addContactNote` function — **flag,
not fabricated as verified**: whether this rides in the same call or needs a
second `POST /contacts/{id}/notes` call needs confirming against GHL's actual
API behavior once a real token exists.

Error handling: try/catch, real user-facing error state on failure (not a
silent swallow), details logged server-side only. A note-call failure after
successful contact creation still reports success to the user (the lead is
captured) — just logged.

## Components

- `page.tsx` (rewritten, stays async Server Component): `<Header />` reused,
  bespoke two-column shell (not the 6-col `Grid` — deliberate one-off
  full-bleed layout).
- `ContactForm.tsx` (`"use client"`): owns `useActionState`. Single-selects as
  native `<input type="radio" className="sr-only peer">` + `peer-checked:`
  labels — whole form stays FormData-driven, no extra client state for the
  selects. Success panel renders in place, no navigation/redirect.
- `BookingReveal.tsx` (small client component): local toggle; on click mounts
  the existing booking iframe + script verbatim, not present on initial load.
- `FormField.tsx`, `PillOption.tsx` (small, scoped to this route only — not
  promoted to `app/components/`, nothing else uses a form yet): shared
  text-input markup (3x reuse: name/email/company) and pill-option markup (2x
  reuse: interest/challenge groups).

All new interactive elements: `rounded-none` (never add a `rounded-*` class),
`focus-visible:outline-2 focus-visible:outline-offset-2
focus-visible:outline-accent-strong` (site's universal ring, replacing native
browser outlines). Labels mono/uppercase/tracking-wide. Submit button matches
`FinalCta.tsx`'s primary-button treatment.

## Artwork — new `contacto-panel` slot

Masked by the real Nettyo mark (same source `cta` uses), landing on a
genuinely dark near-black-teal stop (not `cta`'s lighter capped ramp) — needs
to read as dark enough for reversed light-on-dark headline text and to
correctly trigger the header's `[data-dark]` inversion. Tall portrait size.
`mask_anchor: "center"` (not `cta`'s bottom-peek) — full standalone panel, not
a backdrop behind separately-centered text. Contrast of overlaid headline text
verified empirically (pixel-sampling), not eyeballed. Output:
`public/media/contacto-panel.avif`, referenced with a code comment marking it
as a placeholder for a real photo.

## Responsive

Desktop (`lg+`): `flex-row`, `lg:w-1/2` each, `min-h-svh`, left panel `sticky
top-0`. Mobile (`<lg`): stacks, image panel becomes a shorter fixed band (not
a 50/50 split — unusable for the form on a phone), page scrolls normally,
`svh`/`sticky` dropped. `sticky` + `svh` + the header's `z-30` fixed
positioning needs a real browser check, not just a code review.

## Out of scope

- CAPTCHA/rate-limiting beyond the honeypot.
- Client-logo strip on the left panel (until the real photo replaces the
  placeholder).
- Footer on this page.
