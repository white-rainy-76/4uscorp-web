'use client'

import React from 'react'
import { Skeleton } from '@/shared/ui'

export const CompanyCardSkeleton = () => {
  return (
    <div className="h-[104px] rounded-[24px] bg-background p-4 flex items-center justify-between">
      {/* Left part */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}
