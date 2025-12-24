import { useEffect, useState } from 'react'
import signalRService from '@/shared/socket/signalRService'
import { TruckStatsUpdate } from '@/shared/types'

type TrackedFields = (keyof TruckStatsUpdate)[]

function hasTrackedFieldsChanged(
  prev: TruckStatsUpdate | null,
  next: TruckStatsUpdate,
  trackedFields?: TrackedFields,
): boolean {
  if (!prev) return true

  // Если не указаны поля, отслеживаем все
  if (!trackedFields || trackedFields.length === 0) {
    return Object.keys(next).some(
      (key) =>
        prev[key as keyof TruckStatsUpdate] !==
        next[key as keyof TruckStatsUpdate],
    )
  }

  // Проверяем только указанные поля
  return trackedFields.some((field) => prev[field] !== next[field])
}

export function useTruckStats(
  truckId: string | undefined,
  isConnected: boolean,
  options?: {
    trackedFields?: TrackedFields
  },
) {
  const [stats, setStats] = useState<TruckStatsUpdate | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isConnected || !truckId) {
      setStats(null)
      return
    }

    const handleUpdate = (update: TruckStatsUpdate) => {
      setStats((prevStats) => {
        // Проверяем только указанные поля
        if (
          !hasTrackedFieldsChanged(prevStats, update, options?.trackedFields)
        ) {
          return prevStats // Не вызываем ререндер
        }
        return update
      })
      setIsLoading(false)
    }

    signalRService.subscribe(truckId, handleUpdate)
    return () => {
      signalRService.unsubscribe(truckId, handleUpdate)
    }
  }, [truckId, isConnected, options?.trackedFields])

  return { stats, isLoading }
}
