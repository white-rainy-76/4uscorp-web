'use client'

import { TruckMarker } from '@/entities/truck'
import { useConnection } from '@/shared/api/socket'
import { TruckLocationUpdate } from '@/shared/types/truck'
import { useEffect, useState } from 'react'

interface Props {
  truckId: string
  unitNumber: string
}

export const TrackTruck = ({ truckId, unitNumber }: Props) => {
  const { connection, isConnected } = useConnection()
  const [location, setLocation] = useState<TruckLocationUpdate>()

  useEffect(() => {
    if (!connection || !isConnected) return

    connection
      .invoke('JoinTruckGroup', truckId)
      .catch((err: any) => console.error('Join group error', err))

    connection.on('ReceiveTruckLocationUpdate', (data: TruckLocationUpdate) => {
      if (data.truckId === truckId) {
        setLocation(data)
      }
    })

    return () => {
      connection.off('ReceiveTruckLocationUpdate')
    }
  }, [connection, isConnected, truckId])

  if (!location) return null

  return (
    <TruckMarker
      unitNumber={unitNumber}
      lat={location.latitude}
      lng={location.longitude}
    />
  )
}
