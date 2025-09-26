'use client'

import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/shared/store/auth-store'
import { useRouter } from 'next/navigation'
import { hasAccessToCompanies } from '@/shared/types/roles'

interface RoleProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  requiredRole?: (role: string) => boolean
}

export const RoleProtectedRoute = ({
  children,
  fallback,
  requiredRole = hasAccessToCompanies,
}: RoleProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/sign-in')
      return
    }

    if (!isLoading && isAuthenticated && user && !requiredRole(user.role)) {
      router.push('/')
    }
  }, [isAuthenticated, isLoading, user, requiredRole, router])

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

  if (user && !requiredRole(user.role)) {
    return null
  }

  return <>{children}</>
}




