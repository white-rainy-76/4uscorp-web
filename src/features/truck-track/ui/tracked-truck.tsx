'use client'

import { TruckMarker } from '@/entities/truck'
import { useConnection } from '@/shared/lib/context/socket-context'
import { useTruckSignalR } from '@/shared/lib/hooks'
import { TruckLocationUpdate } from '@/shared/types/truck'
import { useState } from 'react'

interface Props {
  truckId: string
  unitNumber: string
  clickedOutside: boolean
  resetClick: () => void
}

export const TrackTruck = ({
  truckId,
  unitNumber,
  clickedOutside,
  resetClick,
}: Props) => {
  const { connection, isConnected } = useConnection()
  const [truckInfo, setTruckInfo] = useState<TruckLocationUpdate | null>(null)

  useTruckSignalR({
    connection,
    isConnected,
    truckId,
    onLocationUpdate: (data) => {
      setTruckInfo(data)
    },
  })

  if (!truckInfo) return null

  return (
    <TruckMarker
      unitNumber={unitNumber}
      truckInfo={truckInfo}
      clickedOutside={clickedOutside}
      resetClick={resetClick}
    />
  )
}
