import React from 'react'
import { AuthProtectedRoute } from '@/shared/ui/auth-protected-route'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProtectedRoute>
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </AuthProtectedRoute>
  )
}
