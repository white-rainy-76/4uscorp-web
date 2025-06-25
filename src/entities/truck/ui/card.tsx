'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage, Spinner } from '@/shared/ui'
import { Icon } from '@/shared/ui'
import { StatusLabel } from '@/shared/ui'
import { Truck } from '../api/types/truck'
import { useConnection } from '@/shared/lib/context'
import { TruckFuelUpdate } from '@/shared/types'
import { useTruckSignalR } from '@/shared/lib/hooks'

interface CardProps {
  truck: Truck
  isActive: boolean
}

export const Card = ({ truck, isActive }: CardProps) => {
  const [fuel, setFuel] = useState<TruckFuelUpdate | null>(null)
  const router = useRouter()
  const [isLoadingFuel, setIsLoadingFuel] = useState(true)

  const handleClick = () => {
    router.push(`/truck/${truck.id}`)
  }

  const handleMouseEnter = () => {
    router.prefetch(`/truck/${truck.id}`)
  }

  const { connection, isConnected } = useConnection()

  // const isLoadingFuel = useTruckSignalR({
  //   connection,
  //   isConnected,
  //   truckId: truck.id,
  //   onFuelUpdate: (data) => {
  //     setFuel(data)
  //   },
  // })

  useEffect(() => {
    if (!connection || !isConnected) return

    setIsLoadingFuel(true)

    connection
      .invoke('JoinTruckGroup', truck.id)
      .catch((err: any) => console.error('Join group error', err))

    connection.on('ReceiveTruckFuelUpdate', (data: TruckFuelUpdate) => {
      if (data.truckId === truck.id) {
        setFuel(data)
        setIsLoadingFuel(false)
      }
    })
  }, [connection, isConnected, truck.id])

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
          <h2 className="text-[24px] leading-[32px] font-black text-text-heading">
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
          {isLoadingFuel ? (
            <Spinner size="sm" color="blue" />
          ) : (
            fuel && (
              <span className="text-sm font-extrabold text-text-strong">
                {fuel.fuelPercentage}%
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
