'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui/avatar'
import { TruckCard } from '../model/truckCard'
import { Icon } from '@/shared/ui/Icon'

const Card = ({
  avatarImage,
  unitNumber,
  name,
  fuelPercentage,
  status,
  isActive,
  setIsActive,
}: TruckCard) => {
  const router = useRouter()

  const handleClick = () => {
    setIsActive()
    setTimeout(() => {
      router.push(`/truck/${unitNumber}`)
    }, 200)
  }

  return (
    <div
      className={`h-[104px] rounded-[24px] cursor-pointer transition-colors duration-200 flex items-center justify-between px-4 
      bg-[hsl(var(--background))] 
      ${isActive ? 'ring-2 ring-[hsl(var(--primary))]' : ''} 
      hover:bg-[hsl(var(--muted))] 
      ${isActive ? 'hover:bg-[hsl(var(--accent))]' : ''}`}
      onClick={handleClick}>
      {/* Left part */}
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={avatarImage || 'https://github.com/shadcn.png'} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-[24px] leading-[32px] font-black text-[hsl(var(--text-heading))]">
            #{unitNumber}
          </h2>
          <p className="text-sm font-extrabold text-[hsl(var(--text-heading))]">
            {name}
          </p>
        </div>
      </div>

      {/* Right part */}
      <div className="flex items-center">
        <div className="w-[70px] flex items-center justify-end">
          <Icon name="common/fuel" width={14.26} height={17} className="mr-1" />
          <span className="text-sm font-extrabold text-[hsl(var(--text-strong))]">
            {fuelPercentage}%
          </span>
        </div>
        <div className="w-[90px] text-right">
          <span
            className={`text-sm font-bold ${
              status === 'EN_ROUTE'
                ? 'text-green-600'
                : status === 'IDLE'
                  ? 'text-yellow-500'
                  : 'text-red-500'
            }`}>
            {status}
          </span>
        </div>
      </div>
    </div>
  )
}

export default Card
