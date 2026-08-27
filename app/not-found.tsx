import Image from "next/image";
import Link from "next/link";
import "./globals.css";

// Root-level fallback only — reachable for paths outside the /[lang] segment
// (e.g. proxy.ts's matcher excludes _next and dotted files; app/[lang]/
// [...rest]/page.tsx now catches everything else and routes it to the real
// branded 404 instead). Can't call lang()/getDictionary() reliably here, so
// this stays static and minimal. Needs its own globals.css import — it sits
// outside app/[lang]/layout.tsx, which is the only other place that imports
// it, so without this line every Tailwind class here is inert (this is what
// produced the completely unstyled page seen at /es/lol before the catch-all
// route above existed).
export default function RootNotFound() {
  return (
    <html lang="es">
      <body className="flex min-h-svh flex-col items-center justify-center gap-2 bg-[#f1f0ed] px-6 text-center font-sans text-[#12181a]">
        <Image src="/icon.png" alt="" width={32} height={32} className="object-contain" />
        <h1 className="mt-4 text-2xl font-medium tracking-tight">Página no encontrada</h1>
        <p className="max-w-sm text-sm text-[#6b665e]">Page not found.</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-11 items-center justify-center bg-[#12181a] px-6 font-mono text-xs tracking-wider text-[#f1f0ed] uppercase"
        >
          Inicio / Home
        </Link>
      </body>
    </html>
  );
}
