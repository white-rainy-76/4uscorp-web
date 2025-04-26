'use client'

import { useConnection } from '@/shared/api/socket'
import { TruckLocationUpdate } from '@/shared/types/truck'
import React, { useEffect, useState } from 'react'

export default function RouteDetails() {
  const { connection, isConnected } = useConnection()
  const [truck, setTruck] = useState<TruckLocationUpdate>()

  useEffect(() => {
    if (!connection || !isConnected) return
    const truckId = 'e1a61735-4191-417c-a5bd-ceafa823481d'
    connection
      .invoke('JoinTruckGroup', truckId)
      .then(() => {
        console.log('Successfully joined truck group')
      })
      .catch((err: any) => {
        console.error(`Failed to join truck group: ${truckId}`, err)
      })

    connection.on('ReceiveTruckLocationUpdate', (data: TruckLocationUpdate) => {
      console.log(data)
      setTruck(data)
    })

    return () => {
      connection.off('ReceiveTruckLocationUpdate')
    }
  }, [connection, isConnected])

  return (
    <div>
      {isConnected ? (
        <ul>
          <div>
            {truck?.truckId} {truck?.longitude} {truck?.latitude}
          </div>
        </ul>
      ) : (
        <div>Ожидание данных...</div>
      )}
    </div>
  )
}
