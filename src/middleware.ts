import {
  defaultLocale,
  handleLocaleRedirection,
  locales,
} from '@/shared/config/i18n'
import { NextRequest, NextResponse } from 'next/server'

const localeCodes = locales.map((locale) => locale.code)

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/drivers', '/docs']
// Public routes that don't require authentication
const publicRoutes = ['/auth/sign-in', '/auth/sign-up']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Handle locale redirection first
  const redirectResponse = handleLocaleRedirection(
    request,
    localeCodes,
    defaultLocale,
  )
  if (redirectResponse) {
    return redirectResponse
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  )

  // For protected routes, we'll let the client-side handle authentication
  // The middleware can't access localStorage, so we'll rely on the AuthProvider
  // to handle redirects on the client side
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
  ],
}
