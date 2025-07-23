import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { truckQueries } from '@/entities/truck/api'
import { useConnection } from '@/shared/lib/context'
import { TruckFuelUpdate } from '@/shared/types'

export function useTruck(truckId: string | undefined) {
  const [fuel, setFuel] = useState<TruckFuelUpdate | null>(null)
  const [isLoadingFuel, setIsLoadingFuel] = useState(true)
  const { connection, isConnected } = useConnection()

  const {
    data: truckData,
    isLoading: isTruckLoading,
    isError: isTruckError,
  } = useQuery({
    ...truckQueries.truck(truckId!),
    enabled: !!truckId,
  })

  // Socket logic for fuel updates
  useEffect(() => {
    if (!connection || !isConnected) return

    setIsLoadingFuel(true)

    const handleFuelUpdate = (data: TruckFuelUpdate) => {
      if (truckData && data.truckId === truckData.id) {
        setFuel(data)
        setIsLoadingFuel(false)
      }
    }

    connection.on('ReceiveTruckFuelUpdate', handleFuelUpdate)

    return () => {
      connection.off('ReceiveTruckFuelUpdate', handleFuelUpdate)
    }
  }, [connection, isConnected, truckData])

  return {
    truckData,
    fuel,
    isLoadingFuel,
    isTruckLoading,
    isTruckError,
  }
}
