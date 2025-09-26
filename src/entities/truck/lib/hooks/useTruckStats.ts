import { useEffect, useState } from 'react'
import signalRService from '@/shared/socket/signalRService'
import { TruckStatsUpdate } from '@/shared/types'

export function useTruckStats(
  truckId: string | undefined,
  isConnected: boolean,
) {
  const [stats, setStats] = useState<TruckStatsUpdate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isConnected || !truckId) {
      setStats(null)
      return
    }

    const handleUpdate = (update: TruckStatsUpdate) => {
      setStats(update)
      setIsLoading(false)
    }

    signalRService.subscribe(truckId, handleUpdate)
    return () => {
      signalRService.unsubscribe(truckId, handleUpdate)
    }
  }, [truckId, isConnected])

  return { stats, isLoading }
}
