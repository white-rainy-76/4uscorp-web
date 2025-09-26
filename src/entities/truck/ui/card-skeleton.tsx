'use client'

import React from 'react'
import { Skeleton } from '@/shared/ui/skeleton'
import { cn } from '@/shared/ui/utils'

interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardSkeleton = ({ className, ...props }: SkeletonCardProps) => {
  return (
    <div
      className={cn(
        'h-[104px] rounded-[24px] flex items-center justify-between px-4 bg-muted',
        className,
      )}
      {...props}>
      {/* Left part skeleton */}
      <div className="flex items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div>
          <Skeleton className="w-[80px] h-[24px] rounded-md" />
          <Skeleton className="w-[100px] h-[16px] rounded-md mt-1" />
        </div>
      </div>

      {/* Right part skeleton */}
      <div className="flex items-center">
        <Skeleton className="w-[170px] h-[40px] rounded-md" />
      </div>
    </div>
  )
}
