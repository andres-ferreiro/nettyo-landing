import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { locales, defaultLocale, hasLocale } from "./app/[lang]/locales";

const LOCALE_COOKIE = "NEXT_LOCALE";

function getLocaleFromCookie(request: NextRequest) {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  return cookieLocale && hasLocale(cookieLocale) ? cookieLocale : null;
}

function negotiateLocale(request: NextRequest) {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const languages = new Negotiator({ headers })
    .languages()
    .filter((language) => language !== "*");
  if (languages.length === 0) return defaultLocale;
  return match(languages, [...locales], defaultLocale);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameLocale = locales.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameLocale) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, pathnameLocale, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  const locale = getLocaleFromCookie(request) ?? negotiateLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|.*\\.[\\w]+$).*)",
  ],
};
