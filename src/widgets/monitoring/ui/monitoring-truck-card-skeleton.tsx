'use client'

import React from 'react'
import { cn } from '@/shared/ui/utils'

export function MonitoringTruckCardSkeleton({
  className,
}: {
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4',
        className,
      )}>
      <div className="h-12 w-12 shrink-0 rounded-xl bg-muted animate-pulse" />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
        <div className="h-4 w-48 rounded bg-muted animate-pulse" />
        <div className="h-3 w-24 rounded bg-muted animate-pulse" />
      </div>
      <div className="h-5 w-16 shrink-0 rounded bg-muted animate-pulse" />
    </div>
  )
}
