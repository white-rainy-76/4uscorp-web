'use client'

import { useTheme } from 'next-themes'
import { Toaster as Sonner, ToasterProps } from 'sonner'

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme()

  console.log('Toaster component rendered with theme:', theme)

  return (
    <>
      {/* Видимый индикатор для проверки рендера */}
      <div
        style={{
          position: 'fixed',
          top: '10px',
          left: '10px',
          background: 'red',
          color: 'white',
          padding: '5px',
          zIndex: 10000,
          fontSize: '12px',
        }}>
        Toaster Rendered
      </div>

      <Sonner
        theme={theme as ToasterProps['theme']}
        className="toaster group"
        position="top-right"
        richColors
        closeButton
        style={
          {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)',
          } as React.CSSProperties
        }
        {...props}
      />
    </>
  )
}

export { Toaster }
