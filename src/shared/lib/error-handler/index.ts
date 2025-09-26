import * as Sentry from '@sentry/react'

export function logError(
  error: Error,
  info: { componentStack?: string | null },
) {
  if (process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT === 'development') {
    console.log('Caught error:', error)
    console.log('Error details:', info)
  } else {
    Sentry.captureException(error, {
      extra: { componentStack: info.componentStack },
    })
  }
}
