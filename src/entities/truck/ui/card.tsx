'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui'
import { Icon } from '@/shared/ui'
import { StatusLabel } from '@/shared/ui'
import { Truck } from '../api/types/truck'

interface CardProps {
  truck: Truck
  isActive: boolean
}

export const Card = ({ truck, isActive }: CardProps) => {
  const router = useRouter()
  const handleClick = () => {
    router.push(`/truck/${truck.id}`)
  }

  return (
    <div
      className={`h-[104px] rounded-[24px] cursor-pointer transition-colors duration-200 flex items-center justify-between px-4 
      bg-[hsl(var(--background))] 
      ${isActive && 'ring-2 ring-[hsl(var(--primary))]'} 
      hover:bg-[hsl(var(--muted))] 
      ${isActive && 'hover:bg-[hsl(var(--accent))]'}`}
      onClick={handleClick}>
      {/* Left part */}
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={'https://github.com/shadcn.png'} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-[24px] leading-[32px] font-black text-[hsl(var(--text-heading))]">
            #{truck.name}
          </h2>
          <p className="text-sm font-extrabold text-[hsl(var(--text-heading))]">
            {truck.driver?.fullName}
          </p>
        </div>
      </div>

      {/* Right part */}
      <div className="flex items-center">
        <div className="w-[70px] flex items-center justify-end">
          <Icon name="common/fuel" width={14.26} height={17} className="mr-1" />
          <span className="text-sm font-extrabold text-[hsl(var(--text-strong))]">
            {45}%
          </span>
        </div>
        <div className="w-[90px] text-right">
          <StatusLabel status={truck.status} />
        </div>
      </div>
    </div>
  )
}
