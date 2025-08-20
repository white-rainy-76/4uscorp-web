'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage, Spinner } from '@/shared/ui'
import { Icon } from '@/shared/ui'
import { StatusLabel } from '@/shared/ui'
import { Truck } from '../model/types/truck'
import { useConnection } from '@/shared/lib/context'
import { useTruckStats } from '../lib'

interface CardProps {
  truck: Truck
  isActive: boolean
}

export const Card = ({ truck, isActive }: CardProps) => {
  const router = useRouter()
  const { isConnected } = useConnection()

  const handleClick = () => {
    router.push(`/truck/${truck.id}`)
  }

  const handleMouseEnter = () => {
    router.prefetch(`/truck/${truck.id}`)
  }

  const { stats, isLoading } = useTruckStats(truck.id, isConnected)

  const driverInitials =
    truck.driver?.fullName
      ?.split(' ')
      .map((name) => name[0])
      .join('') || ''

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
          <AvatarFallback> {driverInitials || '?'}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-[18px] leading-[32px] font-black text-text-heading">
            #{truck.name}
          </h2>
          <p className="text-sm font-extrabold text-text-heading">
            {truck.driver?.fullName}
          </p>
        </div>
      </div>

      {/* Right part */}
      <div className="flex items-center">
        <div className="w-[70px] flex items-center justify-end">
          <Icon name="common/fuel" width={14.26} height={17} className="mr-1" />
          {isLoading ? (
            <Spinner size="sm" color="blue" />
          ) : (
            stats && (
              <span className="text-sm font-extrabold text-text-strong">
                {stats.fuelPercentage}%
              </span>
            )
          )}
        </div>
        <div className="w-[90px] text-right">
          <StatusLabel status={truck.status} />
        </div>
      </div>
    </div>
  )
}
