'use client'

import { TruckMarker } from '@/entities/truck'
import { useConnection } from '@/shared/lib/context/socket-context'
import { TruckLocationUpdate } from '@/shared/types/truck'
import { useEffect, useState } from 'react'

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
  const [truckInfo, setTruckInfo] = useState<TruckLocationUpdate>()
  useEffect(() => {
    if (!connection || !isConnected) return
    connection
      .invoke('JoinTruckGroup', truckId)
      .catch((err: any) => console.error('Join group error', err))

    connection.on('ReceiveTruckLocationUpdate', (data: TruckLocationUpdate) => {
      if (data.truckId === truckId) {
        setTruckInfo(data)
      }
    })
    return () => {
      connection.off('ReceiveTruckLocationUpdate')
    }
  }, [connection, isConnected, unitNumber])

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
