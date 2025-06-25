import { useEffect, useState } from 'react'
import { HubConnection } from '@microsoft/signalr'
import { TruckFuelUpdate, TruckLocationUpdate } from '@/shared/types'

interface TruckSignalROptions {
  connection: HubConnection | null
  isConnected: boolean
  truckId: string
  onFuelUpdate?: (data: TruckFuelUpdate) => void
  onLocationUpdate?: (data: TruckLocationUpdate) => void
}

export const useTruckSignalR = ({
  connection,
  isConnected,
  truckId,
  onFuelUpdate,
  onLocationUpdate,
}: TruckSignalROptions) => {
  const [isLoadingFuel, setIsLoadingFuel] = useState(true)
  useEffect(() => {
    if (!connection || !isConnected) return

    setIsLoadingFuel(true)
    connection
      .invoke('JoinTruckGroup', truckId)
      .catch((err: any) => console.error('Join group error', err))

    if (onFuelUpdate) {
      connection.on('ReceiveTruckFuelUpdate', (data: TruckFuelUpdate) => {
        if (data.truckId === truckId) {
          onFuelUpdate(data)
          setIsLoadingFuel(false)
        }
      })
    }

    if (onLocationUpdate) {
      connection.on(
        'ReceiveTruckLocationUpdate',
        (data: TruckLocationUpdate) => {
          if (data.truckId === truckId) {
            onLocationUpdate(data)
          }
        },
      )
    }

    return () => {
      if (onFuelUpdate) {
        connection.off('ReceiveTruckFuelUpdate')
      }
      if (onLocationUpdate) {
        connection.off('ReceiveTruckLocationUpdate')
      }
    }
  }, [connection, isConnected, truckId, onFuelUpdate, onLocationUpdate])
  return isLoadingFuel
}
