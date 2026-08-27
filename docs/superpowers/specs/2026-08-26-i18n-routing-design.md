# ES/EN i18n routing

Status: approved, ready for implementation plan.

## Purpose

The site currently has a decorative "ES / EN" button in the header
(`app/components/Header.tsx:44-52`) with no href, no handler, and no
translation layer at all — every section has Spanish hardcoded directly
in JSX. `docs/LANDING_STRUCTURE.md` already documents "Spanish is the
default language; English via ES/EN switch" as intent; this implements
it.

User requirement: real `/es` and `/en` routes, with automatic redirect
based on the visitor's browser language on first visit.

## Next.js 16 note

Confirmed via `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md`:
Next.js 16 renamed Middleware to Proxy. The file is `proxy.ts` at the
project root, exporting `function proxy(request)` (not `middleware`).
Same capabilities as the old middleware, different name and export.

## Routing structure

- `app/layout.tsx` → `app/[lang]/layout.tsx`
- `app/page.tsx` → `app/[lang]/page.tsx`
- `app/globals.css` and `app/favicon.ico` stay at `app/` root — Next's
  root-level special files apply site-wide regardless of `[lang]`
  nesting, no change needed.
- `app/[lang]/layout.tsx` exports `generateStaticParams` returning
  `[{ lang: 'es' }, { lang: 'en' }]`, so both locales are statically
  generated.
- There is no page at literal `/` anymore — every request to `/` is
  redirected by the proxy. This is expected and matches the official
  Next.js i18n pattern.

## `proxy.ts` (project root)

- Matcher excludes `_next`, files with extensions, and `favicon.ico`.
- If the request path is already prefixed `/es` or `/en`: let it pass
  through, and set/refresh a `NEXT_LOCALE` cookie (1 year) to that
  locale on the response. This is what makes "manual choice sticks"
  work with zero client-side JS — visiting either locale's URL (via the
  header's plain links) naturally re-stamps the cookie on the next
  request.
- If the request path has no locale prefix (i.e. `/`):
  1. Check the `NEXT_LOCALE` cookie. If it's a valid locale, redirect to
     `/${cookieLocale}`.
  2. Otherwise, negotiate the `Accept-Language` header via `negotiator`
     + `@formatjs/intl-localematcher` against `['es', 'en']` with `es`
     as the default locale (matches the documented "Spanish is the
     default language"). Redirect to `/${negotiatedLocale}`.

## Dictionaries

- `app/[lang]/dictionaries/es.json` and `app/[lang]/dictionaries/en.json`
  — one JSON file per locale, nested by section. Top-level keys match
  section components: `header`, `hero`, `clientsMarquee`, `problem`,
  `solution`, `capabilities`, plus a `metadata` key for page
  title/description.
- `app/[lang]/dictionaries.ts` exports:
  - `type Dictionary = typeof import('./dictionaries/es.json')` (`es.json`
    is the canonical shape; `en.json` is typed against it, so a missing
    English key is a compile error, not a silent Spanish fallback).
  - `hasLocale(locale): locale is 'es' | 'en'`
  - `getDictionary(): Promise<Dictionary>` — takes no argument. Reads
    the locale internally via `next/root-params`'s `lang()` getter (per
    the official docs' "sharing the locale across your app" pattern),
    so callers never need `lang` prop-drilled down from `page.tsx`.

Example shape (`es.json`):

```json
{
  "metadata": { "title": "Nettyo Solutions", "description": "..." },
  "header": { "servicios": "Servicios", "productos": "Productos", "proceso": "Proceso", "contacto": "Contacto", "cta": "Cuéntanos tu proceso" },
  "hero": { "headline": ["Procesos únicos.", "Software que", "se adapta a ti."], "subhead": [...], "ctaPrimary": "...", "ctaSecondary": "..." },
  "clientsMarquee": { "label": "Confían en nosotros" },
  "problem": { "headline": [...], "supporting": "...", "painPoints": [{ "label": "...", "detail": "..." }] },
  "solution": { "headline": "...", "supporting": "..." },
  "capabilities": { "headline": "...", "items": ["CRM", "Portales", ...] }
}
```

## Component pattern (applies to every current and future section)

- Every section component that renders copy becomes an `async function`
  Server Component and calls `const t = (await getDictionary()).<section>`
  internally.
- `FadeIn.tsx` (Client Component) is untouched — it only wraps
  already-translated text/elements passed as `children` from its
  Server Component parent, never touches the dictionary itself.
- `page.tsx` does not pass `lang` or dictionary props to any section —
  each section is self-sufficient via `getDictionary()`.

## Header

- Becomes `async`, sources nav labels and CTA text from the dictionary.
- The decorative ES/EN button becomes two real links: `<a href="/es">ES</a>`
  and `<a href="/en">EN</a>`. Since this is currently a single-page
  site, both just point at the locale root — no path-swapping logic
  needed yet. Revisit only if the site grows additional routes later.

## Metadata

- `app/[lang]/layout.tsx`: `<html lang={lang}>` set dynamically from the
  route param (currently hardcoded to `"en"` even though the whole site
  is Spanish — this fixes that live bug). `title`/`description` sourced
  from `dict.metadata`.

## Migration of existing sections

All 5 already-built sections get their hardcoded Spanish strings
extracted into `es.json`, then rewritten to source strings from the
dictionary instead of literals:

- `Header.tsx`
- `Hero.tsx`
- `ClientsMarquee.tsx` (only the "Confían en nosotros" label; client
  logos/names stay as-is, they're proper nouns)
- `Problem.tsx`
- `Solution.tsx`
- `Capabilities.tsx`

`en.json` gets real English copy for the same keys, matching the
existing consultative, non-corporate tone (not machine-translated
literalism).

## New dependencies

- `negotiator` — parses `Accept-Language`.
- `@formatjs/intl-localematcher` — matches negotiated languages against
  supported locales. Both are small and used only in `proxy.ts`.

## Out of scope

- No path-swapping/locale-aware link rewriting beyond the two static
  `/es` `/en` header links (single-page site today).
- No third-party i18n library (`next-intl`, etc.) — the official
  Next.js dictionary pattern is sufficient at this content size.
- Sections not yet built (Process, Portfolio, Industries, Technical
  Credibility, Why Nettyo, FAQ, Final CTA, Footer) are not migrated
  here since they don't exist yet — they should follow this same
  `getDictionary()` pattern when built.
