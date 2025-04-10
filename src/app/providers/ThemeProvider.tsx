'use client'

import { ThemeProvider } from '@/features/theme/theme-provider'
import { ComposeChildren } from '@/shared/lib/hooks/react-hooks'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ComposeChildren>
      <ThemeProvider />
      {children}
    </ComposeChildren>
  )
}
