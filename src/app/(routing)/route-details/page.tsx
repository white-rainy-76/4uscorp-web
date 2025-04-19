'use client'

import { useConnection } from '@/shared/api/socket'
import { TruckLocationUpdate } from '@/shared/types/truck'
import React, { useEffect, useState } from 'react'

export default function RouteDetails() {
  const { connection, isConnected } = useConnection()
  const [trucks, setTrucks] = useState<Record<string, TruckLocationUpdate>>({})

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
      setTrucks((prev) => ({
        ...prev,
        [data.truckId]: data,
      }))
    })

    return () => {
      connection.off('ReceiveTruckLocationUpdate')
    }
  }, [connection, isConnected])

  const trucksArray = Object.values(trucks)

  return (
    <div>
      {isConnected ? (
        trucksArray.length > 0 ? (
          <ul>
            {trucksArray.map((truck) => (
              <li key={truck.truckId}>
                Truck Id: {truck.truckId}, Lat: {truck.latitude}, Lon:{' '}
                {truck.longitude}
              </li>
            ))}
          </ul>
        ) : (
          <div>Ожидание данных...</div>
        )
      ) : (
        <div>Нет подключения к серверу</div>
      )}
    </div>
  )
}
