'use client'

import { ThemeProvider } from '@/features/theme/theme-provider'
import { ComposeChildren } from '@/shared/lib/react'
import { APIProvider } from '@vis.gl/react-google-maps'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ComposeChildren>
      <ThemeProvider />
      {children}
    </ComposeChildren>
  )
}
