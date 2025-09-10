'use client'

import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/shared/store/auth-store'
import { useRouter, usePathname } from 'next/navigation'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export const ProtectedRoute = ({ children, fallback }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Extract locale from current pathname
      const segments = pathname?.split('/') || []
      const locale =
        segments[1] && ['en', 'ru'].includes(segments[1]) ? segments[1] : 'en'

      router.push(`/${locale}/auth/sign-in`)
    }
  }, [isAuthenticated, isLoading, router, pathname])

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
