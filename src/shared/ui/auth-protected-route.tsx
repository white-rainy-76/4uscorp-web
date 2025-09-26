'use client'

import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/shared/store/auth-store'
import { useRouter } from 'next/navigation'

interface AuthProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
}

export const AuthProtectedRoute = ({
  children,
  fallback,
}: AuthProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )
    )
  }

  if (isAuthenticated) {
    return null
  }

  return <>{children}</>
}




