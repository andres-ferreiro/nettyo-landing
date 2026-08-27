import { notFound } from "next/navigation";

// No page matches an arbitrary unmatched sub-path (e.g. /es/lol) on its own,
// and Next's nested not-found.tsx files only fire on an explicit notFound()
// call — they don't automatically catch unmatched routes the way you'd
// expect. Without this catch-all, an unmatched path falls all the way
// through to the plain root app/not-found.tsx instead of the branded,
// locale-aware app/[lang]/not-found.tsx. This route exists only to trigger
// that call.
export default function CatchAll(): never {
  notFound();
}
