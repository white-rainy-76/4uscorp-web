'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui'
import { Driver } from '../model/types/driver'

interface DriverCardProps {
  driver: Driver
  isActive: boolean
}

export const DriverCard = ({ driver, isActive }: DriverCardProps) => {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/drivers/driver/${driver.id}`)
  }

  const handleMouseEnter = () => {
    router.prefetch(`/drivers/driver/${driver.id}`)
  }

  const driverInitials =
    driver.fullName
      ?.split(' ')
      .map((name) => name[0])
      .join('') || '?'

  return (
    <div
      className={`h-[104px] rounded-[24px] cursor-pointer transition-colors duration-200 flex items-center justify-between px-4
      bg-background
      ${isActive && 'ring-2 ring-primary'}
      hover:bg-muted
      ${isActive && 'hover:bg-accent'}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}>
      {/* Left part */}
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={'https://github.com/shadcn.png'} />
          <AvatarFallback>{driverInitials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-[18px] leading-[32px] font-black text-text-heading">
            {driver.truck?.unitNumber}
          </h2>
          <p className="text-sm font-extrabold text-text-heading">
            {driver.fullName}
          </p>
        </div>
      </div>

      {/* Right part */}
      <div className="flex items-center">
        <div className="text-right">
          <p className="text-sm font-semibold text-[#FFAF2A]">
            Bonus: {driver.bonus}
          </p>
        </div>
      </div>
    </div>
  )
}
