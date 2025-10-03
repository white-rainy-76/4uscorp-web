'use client'

import React from 'react'
import { Skeleton } from '@/shared/ui'

export const StatisticsDriverCardSkeleton = () => {
  return (
    <div className="h-[104px] rounded-[24px] flex items-center justify-between px-4 bg-background">
      {/* Left part */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Right part */}
      <div className="flex items-center">
        <div className="text-right space-y-1">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}
