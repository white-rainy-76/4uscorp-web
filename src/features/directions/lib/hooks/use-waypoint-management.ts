import { useState, useCallback, useEffect, useRef } from 'react'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { Coordinate } from '@/shared/types'
import {
  convertLatLngToCoordinates,
  sortWaypointsAlongRoute,
} from '@/shared/lib/coordinates'
import { Directions, RouteRequestPayload } from '../../api'

interface NearestPointResponse {
  latitude: number
  longitude: number
}

interface UseWaypointManagementProps {
  truckId?: string
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
  initialWaypoints?: Array<{
    latitude: number
    longitude: number
    stopOrder: number
  }>
}

export const useWaypointManagement = ({
  truckId,
  origin,
  destination,
  originName,
  destinationName,
  directionsMutation,
  dropPointMutation,
  initialWaypoints,
}: UseWaypointManagementProps) => {
  // Инициализируем wayPoints из initialWaypoints, если они есть
  const [wayPoints, setWayPoints] = useState<google.maps.LatLngLiteral[]>(
    () => {
      if (initialWaypoints && initialWaypoints.length > 0) {
        // Сортируем по stopOrder и преобразуем в LatLngLiteral
        return initialWaypoints
          .sort((a, b) => a.stopOrder - b.stopOrder)
          .map((wp) => ({ lat: wp.latitude, lng: wp.longitude }))
      }
      return []
    },
  )

  // Создание payload для directions API
  const createDirectionsPayload = useCallback(
    (viaPoints: google.maps.LatLngLiteral[]): RouteRequestPayload => {
      // Сортируем viaPoints по их положению вдоль маршрута от origin к destination
      const sortedViaPoints = sortWaypointsAlongRoute(
        viaPoints,
        origin,
        destination,
      )

      return {
        ...(truckId && { TruckId: truckId }),
        origin: origin || { latitude: 0, longitude: 0 },
        destination: destination || { latitude: 0, longitude: 0 },
        destinationName: destinationName || '',
        originName: originName || '',
        ViaPoints: convertLatLngToCoordinates(sortedViaPoints),
      }
    },
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

  // Удаление waypoint
  const handleDeleteWaypoint = useCallback(
    async (index: number) => {
      const updatedWayPoints = wayPoints.filter((_, i) => i !== index)
      setWayPoints(updatedWayPoints)

      // Запрашиваем новый маршрут без удаленного waypoint
      try {
        await directionsMutation(createDirectionsPayload(updatedWayPoints))
      } catch (error) {
        console.error('Error deleting waypoint:', error)
        // Восстанавливаем waypoints в случае ошибки
        setWayPoints(wayPoints)
      }
    },
    [wayPoints, directionsMutation, createDirectionsPayload],
  )

  // Синхронизация wayPoints с initialWaypoints из Directions
  const prevInitialWaypointsRef = useRef<typeof initialWaypoints>(undefined)
  const prevInitialWaypointsStringRef = useRef<string>('')

  useEffect(() => {
    // Создаём строку для сравнения
    const currentString = initialWaypoints
      ? JSON.stringify(
          initialWaypoints
            .slice()
            .sort((a, b) => a.stopOrder - b.stopOrder)
            .map((wp) => ({ lat: wp.latitude, lng: wp.longitude })),
        )
      : ''

    // Проверяем, изменились ли initialWaypoints
    // Важно: проверяем и по ссылке, и по содержимому
    const prevWasUndefined = prevInitialWaypointsRef.current === undefined
    const currIsDefined = initialWaypoints !== undefined
    const referenceChanged =
      prevInitialWaypointsRef.current !== initialWaypoints
    const contentChanged =
      prevInitialWaypointsStringRef.current !== currentString

    // Синхронизируем если:
    // 1. Изменилась ссылка И содержимое
    // 2. ИЛИ изменилось состояние undefined -> определено (или наоборот)
    const hasChanged =
      (referenceChanged && contentChanged) ||
      (prevWasUndefined && currIsDefined) ||
      (!prevWasUndefined && !currIsDefined && contentChanged)

    if (hasChanged) {
      prevInitialWaypointsRef.current = initialWaypoints
      prevInitialWaypointsStringRef.current = currentString

      if (initialWaypoints && initialWaypoints.length > 0) {
        const sortedWaypoints = initialWaypoints
          .sort((a, b) => a.stopOrder - b.stopOrder)
          .map((wp) => ({ lat: wp.latitude, lng: wp.longitude }))
        setWayPoints(sortedWaypoints)
      } else if (
        initialWaypoints !== undefined &&
        initialWaypoints.length === 0
      ) {
        // Очищаем только если initialWaypoints явно пустой массив
        setWayPoints([])
      }
      // Если initialWaypoints === undefined, не трогаем wayPoints (могут быть пользовательские изменения)
    }
  }, [initialWaypoints])

  // Очистка waypoints при изменении origin/destination
  const clearWayPoints = useCallback(() => {
    setWayPoints([])
  }, [])

  return {
    wayPoints,
    handleAddWaypoint,
    handleUpdateWaypoint,
    handleDeleteWaypoint,
    clearWayPoints,
  }
}
