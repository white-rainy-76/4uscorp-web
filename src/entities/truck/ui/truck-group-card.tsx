'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/shared/ui'
import { TruckGroup } from '../model'
import { useDictionary } from '@/shared/lib/hooks'

interface TruckGroupCardProps {
  truckGroup: TruckGroup
  isActive: boolean
}

export const TruckGroupCard = ({
  truckGroup,
  isActive,
}: TruckGroupCardProps) => {
  const router = useRouter()
  const { lang } = useDictionary()

  const handleClick = () => {
    router.push(`/${lang}/truck-models/truck-model/${truckGroup.id}`)
  }

  const handleMouseEnter = () => {
    router.prefetch(`/${lang}/truck-models/truck-model/${truckGroup.id}`)
  }

  return (
    <div
      className={`h-[104px] rounded-[24px] cursor-pointer transition-colors duration-200 flex items-center justify-between px-4
      bg-background
      ${isActive && 'ring-2 ring-primary'}
      hover:bg-muted
      ${isActive && 'hover:bg-accent'}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}>
      {/* Left part - Truck Group Name */}
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-[18px] leading-[32px] font-black text-text-heading">
            {truckGroup.truckGroupName}
          </h2>
        </div>
      </div>

      {/* Right part - Trucks Count with Icon */}
      <div className="flex items-center gap-2">
        <Icon name="common/truck-model" className="w-5 h-5 text-text-heading" />
        <span className="text-sm font-semibold text-text-heading">
          {truckGroup.trucksCount}
        </span>
      </div>
    </div>
  )
}
