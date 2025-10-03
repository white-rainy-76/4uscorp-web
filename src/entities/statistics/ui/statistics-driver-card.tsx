'use client'

import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/ui'
import { DriverStatistics } from '../model/types/driver-statistics'

interface StatisticsDriverCardProps {
  driver: DriverStatistics
  isActive: boolean
  onClick?: () => void
}

export const StatisticsDriverCard = ({
  driver,
  isActive,
  onClick,
}: StatisticsDriverCardProps) => {
  const driverInitials =
    driver.driverName
      ?.split(' ')
      .map((name) => name[0])
      .join('') || '?'

  // Determine background color based on violations
  const backgroundColor =
    driver.unSucssesStationPlanCount > 0
      ? 'bg-[#D84949] border-[#D84949]'
      : 'bg-[#2AC78A] border-[#2AC78A]'

  // Enhanced active styles with complementary colors
  const activeStyles = isActive
    ? driver.unSucssesStationPlanCount > 0
      ? 'ring-2 ring-[#FF6B6B] ring-offset-2' // Light red ring for red cards
      : 'ring-2 ring-[#4ECDC4] ring-offset-2' // Light teal ring for green cards
    : ''

  return (
    <div
      className={`h-[104px] rounded-[24px] cursor-pointer transition-all duration-200 flex items-center justify-between px-4
      ${backgroundColor}
      ${activeStyles}
      hover:opacity-80
      ${isActive && 'hover:opacity-90'}`}
      onClick={onClick}>
      {/* Left part */}
      <div className="flex items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={'https://github.com/shadcn.png'} />
          <AvatarFallback>{driverInitials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-[18px] leading-[32px] font-black text-white">
            #{driver.truckUnit}
          </h2>
          <p className="text-sm font-extrabold text-white">
            {driver.driverName}
          </p>
        </div>
      </div>

      {/* Right part - show violations in X/Y format */}
      <div className="flex items-center">
        <div className="text-right">
          <p className="text-white font-archivo-black text-2xl leading-8 tracking-tight">
            {driver.unSucssesStationPlanCount}/{driver.stationPlanCount}
          </p>
        </div>
      </div>
    </div>
  )
}
