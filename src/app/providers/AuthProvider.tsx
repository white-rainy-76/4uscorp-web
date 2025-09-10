'use client'

import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/shared/store/auth-store'
import { useRouter, usePathname } from 'next/navigation'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { initializeAuth, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Initialize authentication state on app load
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname

      // Check if we're already on an auth page with locale
      const isOnAuthPage =
        currentPath.includes('/auth/sign-in') ||
        currentPath.includes('/auth/sign-up')

      if (!isOnAuthPage) {
        // Extract locale from current pathname
        const segments = pathname?.split('/') || []
        const locale =
          segments[1] && ['en', 'ru'].includes(segments[1]) ? segments[1] : 'en'

        router.push(`/${locale}/auth/sign-in`)
      }
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // Show loading state while initializing
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return <>{children}</>
}
