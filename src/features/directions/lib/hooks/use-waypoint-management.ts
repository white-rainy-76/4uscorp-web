import { useState, useCallback } from 'react'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { Coordinate } from '@/shared/types'
import { convertLatLngToCoordinates } from '@/shared/lib/coordinates'
import { Directions, RouteRequestPayload } from '../../api'

interface NearestPointResponse {
  latitude: number
  longitude: number
}

interface UseWaypointManagementProps {
  truckId: string
  origin: Coordinate | null
  destination: Coordinate | null
  originName: string | undefined
  destinationName: string | undefined
  directionsMutation: UseMutateAsyncFunction<
    Directions,
    Error,
    RouteRequestPayload,
    unknown
  >
  dropPointMutation: {
    mutateAsync: (variables: {
      latitude: number
      longitude: number
    }) => Promise<NearestPointResponse>
  }
}

export const useWaypointManagement = ({
  truckId,
  origin,
  destination,
  originName,
  destinationName,
  directionsMutation,
  dropPointMutation,
}: UseWaypointManagementProps) => {
  const [wayPoints, setWayPoints] = useState<google.maps.LatLngLiteral[]>([])

  // Создание payload для directions API
  const createDirectionsPayload = useCallback(
    (viaPoints: google.maps.LatLngLiteral[]): RouteRequestPayload => ({
      TruckId: truckId,
      origin: origin || { latitude: 0, longitude: 0 },
      destination: destination || { latitude: 0, longitude: 0 },
      destinationName: destinationName || '',
      originName: originName || '',
      ViaPoints: convertLatLngToCoordinates(viaPoints),
    }),
    [truckId, origin, destination, originName, destinationName],
  )

  // Обработка drag & drop waypoint (добавление или обновление)
  const handleWaypointDrop = useCallback(
    async (
      e: google.maps.MapMouseEvent,
      action: 'add' | 'update',
      updateIndex?: number,
    ) => {
      if (!e.latLng) return

      const newPosition = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      }

      try {
        // Получаем ближайшую точку на дороге
        const nearestPoint = await dropPointMutation.mutateAsync({
          latitude: newPosition.lat,
          longitude: newPosition.lng,
        })

        const nearestLatLng = {
          lat: nearestPoint.latitude,
          lng: nearestPoint.longitude,
        }

        // Обновляем wayPoints в зависимости от действия
        const updatedWayPoints =
          action === 'add'
            ? [...wayPoints, nearestLatLng]
            : wayPoints.map((wp, i) => (i === updateIndex ? nearestLatLng : wp))

        setWayPoints(updatedWayPoints)

        // Запрашиваем новый маршрут с обновленными waypoints
        await directionsMutation(createDirectionsPayload(updatedWayPoints))
      } catch (error) {
        console.error(`Error handling waypoint ${action}:`, error)
      }
    },
    [wayPoints, dropPointMutation, directionsMutation, createDirectionsPayload],
  )

  // Добавление нового waypoint
  const handleAddWaypoint = useCallback(
    (e: google.maps.MapMouseEvent) => handleWaypointDrop(e, 'add'),
    [handleWaypointDrop],
  )

  // Обновление существующего waypoint
  const handleUpdateWaypoint = useCallback(
    (index: number) => (e: google.maps.MapMouseEvent) =>
      handleWaypointDrop(e, 'update', index),
    [handleWaypointDrop],
  )

  // Очистка waypoints при изменении origin/destination
  const clearWayPoints = useCallback(() => {
    setWayPoints([])
  }, [])

  return {
    wayPoints,
    handleAddWaypoint,
    handleUpdateWaypoint,
    clearWayPoints,
  }
}
