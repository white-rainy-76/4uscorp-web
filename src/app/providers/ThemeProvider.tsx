'use client'

import { ThemeProvider } from '@/features/theme/theme-provider'
import { ComposeChildren } from '@/shared/lib/react'
import { APIProvider } from '@vis.gl/react-google-maps'

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ComposeChildren>
      <APIProvider
        // @ts-ignore
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        libraries={['marker']}>
        <ThemeProvider />
        {children}
      </APIProvider>
    </ComposeChildren>
  )
}
