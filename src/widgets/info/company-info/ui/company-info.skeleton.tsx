import { Skeleton } from '@/shared/ui'

export const CompanyInfoSkeleton = () => {
  return (
    <>
      {/* Top section with three columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Driver information Skeleton */}
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-full" />{' '}
          {/* Skeleton for Avatar */}
          <div>
            <Skeleton className="h-5 w-32 mb-1" />{' '}
            {/* Skeleton for Driver Name */}
            <Skeleton className="h-4 w-20" /> {/* Skeleton for Driver Status */}
          </div>
        </div>

        {/* Fuel and bonuses Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 border border-dashed rounded-xl pl-[14px] pr-14 py-2 border-spacing-10">
            <Skeleton className="w-7 h-8" /> {/* Skeleton for Fuel Icon */}
            <div>
              <Skeleton className="h-5 w-16 mb-1" />{' '}
              {/* Skeleton for Fuel Percentage */}
              <Skeleton className="h-4 w-24" /> {/* Skeleton for Fuel Text */}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5" />{' '}
            {/* Skeleton for Bonus Icon (SVG) */}
            <Skeleton className="h-5 w-28" /> {/* Skeleton for Bonus Text */}
          </div>
        </div>

        {/* Actions Skeletons */}
        <div className="flex gap-3 justify-start sm:justify-end">
          <Skeleton className="w-10 h-10 rounded-full" />{' '}
          {/* Skeleton for Phone Button */}
          <Skeleton className="w-10 h-10 rounded-full" />{' '}
          {/* Skeleton for Message Button */}
        </div>
      </div>

      {/* Bottom table/details section Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-4 text-sm">
        <div>
          <Skeleton className="h-4 w-24 mb-1" />{' '}
          {/* Skeleton for Unit Number Label */}
          <Skeleton className="h-4 w-20" />{' '}
          {/* Skeleton for Unit Number Value */}
        </div>
        <div className="border-l pl-4">
          <Skeleton className="h-4 w-20 mb-1" />{' '}
          {/* Skeleton for Truck Label */}
          <Skeleton className="h-4 w-40" />{' '}
          {/* Skeleton for Truck Model Value */}
        </div>
        <div /> {/* This empty div remains for layout consistency */}
      </div>
    </>
  )
}
