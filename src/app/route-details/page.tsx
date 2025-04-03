'use client'

import { useConnection } from '@/shared/api/socket'
import { TruckLocationUpdate } from '@/shared/types/truck'
import React, { useEffect, useState } from 'react'

export default function RouteDetails() {
  const { connection, isConnected } = useConnection()
  const [routeStatus, setRouteStatus] = useState<TruckLocationUpdate | null>(
    null,
  )

  useEffect(() => {
    if (!connection || !isConnected) return

    // Subscription truck-tracking
    connection.on('ReceiveTruckLocationUpdate', (data: TruckLocationUpdate) => {
      console.log('Data:', data)
      setRouteStatus(data)
    })

    // Clear subscription on unmount
    return () => {
      connection.off('ReceiveTruckLocationUpdate')
    }
  }, [connection, isConnected])

  return (
    <div>
      {isConnected ? (
        routeStatus ? (
          <div>
            Truck Id: {routeStatus.truckId}, Lat: {routeStatus.latitude}, Lon:{' '}
            {routeStatus.longitude}
          </div>
        ) : (
          <div>Ожидание данных...</div>
        )
      ) : (
        <div>Нет подключения к серверу</div>
      )}
    </div>
  )
}
