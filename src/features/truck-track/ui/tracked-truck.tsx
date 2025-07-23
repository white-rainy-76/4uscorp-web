'use client'

import { TruckMarker } from '@/entities/truck'
import { useConnection } from '@/shared/lib/context/socket-context'
import signalRService from '@/shared/socket/signalRService'
import { TruckStatsUpdate } from '@/shared/types/truck'
import { Polyline } from '@/shared/ui'
import { useEffect, useRef, useState } from 'react'

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
  const [truckPath, setTruckPath] = useState<google.maps.LatLngLiteral[]>([])
  const truckPathRef = useRef<google.maps.LatLngLiteral[]>([])

  const [stats, setStats] = useState<TruckStatsUpdate | null>(null)
  useEffect(() => {
    if (!isConnected) {
      setStats(null)
      return
    }

    if (!truckId) return

    const handleUpdate = (update: TruckStatsUpdate) => {
      setStats(update)
      const newPoint: google.maps.LatLngLiteral = {
        lat: update.latitude,
        lng: update.longitude,
      }
      truckPathRef.current = [...truckPathRef.current, newPoint]
      setTruckPath(truckPathRef.current)
    }

    signalRService.subscribe(truckId, handleUpdate)

    return () => {
      signalRService.unsubscribe(truckId, handleUpdate)
    }
  }, [truckId, isConnected])

  if (!stats) return null

  return (
    <>
      <TruckMarker
        unitNumber={unitNumber}
        truckInfo={stats}
        clickedOutside={clickedOutside}
        resetClick={resetClick}
      />

      {truckPath.length > 1 && (
        <Polyline
          path={truckPath}
          strokeColor="#2D8CFF"
          strokeOpacity={0.8}
          strokeWeight={4}
        />
      )}
    </>
  )
}
