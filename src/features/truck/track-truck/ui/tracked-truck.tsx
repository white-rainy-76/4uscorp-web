'use client'

import { useConnection } from '@/shared/lib/context/socket-context'
import { TruckStatsUpdate } from '@/shared/types/truck'
import { Polyline } from '@/shared/ui'
import { useEffect, useRef, useState } from 'react'
import { TruckMarker } from './truck-marker'
import { useTruckStats } from '@/entities/truck/lib'

interface Props {
  truckId: string
  unitNumber: string
  clickedOutside: boolean
  resetClick: () => void
  showPolyline?: boolean
}

export const TrackTruck = ({
  truckId,
  unitNumber,
  clickedOutside,
  resetClick,
  showPolyline = true,
}: Props) => {
  const { isConnected } = useConnection()
  const [truckPath, setTruckPath] = useState<google.maps.LatLngLiteral[]>([])
  const truckPathRef = useRef<google.maps.LatLngLiteral[]>([])

  const { stats } = useTruckStats(truckId, isConnected, {
    trackedFields: ['latitude', 'longitude', 'headingDegrees'],
  })

  useEffect(() => {
    if (!stats) return

    const newPoint: google.maps.LatLngLiteral = {
      lat: stats.latitude,
      lng: stats.longitude,
    }
    truckPathRef.current = [...truckPathRef.current, newPoint]
    setTruckPath(truckPathRef.current)
  }, [stats])

  if (!stats) return null

  return (
    <>
      <TruckMarker
        unitNumber={unitNumber}
        truckInfo={stats}
        clickedOutside={clickedOutside}
        resetClick={resetClick}
      />

      {showPolyline && truckPath.length > 1 && (
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
