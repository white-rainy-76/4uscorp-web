'use client'

import { ReactNode, useEffect } from 'react'
import { useAuthStore } from '@/shared/store/auth-store'
import { useRouter } from 'next/navigation'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { initializeAuth, isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    // Initialize authentication state on app load
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    // Redirect to login if not authenticated and not loading
    if (!isLoading && !isAuthenticated) {
      const currentPath = window.location.pathname
      if (currentPath !== '/auth/sign-in' && currentPath !== '/auth/sign-up') {
        router.push('/auth/sign-in')
      }
    }
  }, [isAuthenticated, isLoading, router])

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
