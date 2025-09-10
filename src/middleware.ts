import { defaultLocale, locales } from '@/shared/config/i18n'
import { NextRequest, NextResponse } from 'next/server'

const localeCodes = locales.map((locale) => locale.code)

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/drivers',
  '/companies',
  '/truck-models',
]
// Public routes that don't require authentication
const publicRoutes = ['/auth/sign-in', '/auth/sign-up']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Check if the pathname starts with a locale
  const pathnameIsMissingLocale = localeCodes.every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Get the preferred locale from the request
    const locale = getLocale(request, localeCodes, defaultLocale)

    // Redirect to the same path with the locale prefix
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
  }

  // Extract locale from pathname
  const pathnameHasLocale = localeCodes.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  if (pathnameHasLocale) {
    // Let the client-side handle authentication and other logic
    return NextResponse.next()
  }

  return NextResponse.next()
}

function getLocale(
  request: NextRequest,
  localeCodes: string[],
  defaultLocale: string,
): string {
  // Try to get locale from cookie
  const cookieLocale = request.cookies.get('locale')?.value
  if (cookieLocale && localeCodes.includes(cookieLocale)) {
    return cookieLocale
  }

  // Try to get locale from Accept-Language header
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage) {
    for (const locale of localeCodes) {
      if (acceptLanguage.includes(locale)) {
        return locale
      }
    }
  }

  return defaultLocale
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, static files)
    '/((?!_next|api|favicon.ico|.*\\.).*)',
  ],
}
