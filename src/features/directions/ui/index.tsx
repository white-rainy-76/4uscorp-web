import React, { useEffect, useState, useCallback, useRef } from 'react'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { Directions as DirectionType, RouteRequestPayload } from '../api'
import { RoutePolylines } from './route-polylines'
import { RouteMarkers } from './markers'

import { Coordinate } from '@/shared/types'
import { convertCoordinatePairsToLatLng } from '@/shared/lib/coordinates'
import { useGetNearestDropPointMutation } from '../api/get-nearest-drop-point.mutation'
import { useWaypointManagement, useRouteSwitching, useRouteHover } from '../lib'
import { useRouteFormStore, useRouteInfoStore } from '@/shared/store'

interface DirectionsProps {
  data?: DirectionType | undefined
  directionsMutation: UseMutateAsyncFunction<
    DirectionType,
    Error,
    RouteRequestPayload,
    unknown
  >
  truckId: string
  onClearAlternativeRoutes?: (clearFn: () => void) => void
}

export const Directions = ({
  data,
  directionsMutation,
  truckId,
  onClearAlternativeRoutes,
}: DirectionsProps) => {
  // Получаем данные из store
  const { origin, destination, originName, destinationName } =
    useRouteFormStore()
  const { setSelectedSectionId, setRouteInfo } = useRouteInfoStore()
  const [mainRoute, setMainRoute] = useState<google.maps.LatLngLiteral[]>([])
  const [alternativeRoutes, setAlternativeRoutes] = useState<
    google.maps.LatLngLiteral[][]
  >([])
  const [startMarker, setStartMarker] =
    useState<google.maps.LatLngLiteral | null>(null)
  const [endMarker, setEndMarker] = useState<google.maps.LatLngLiteral | null>(
    null,
  )
  const [routeSectionIds, setRouteSectionIds] = useState<string[]>([])

  const dropPointMutation = useGetNearestDropPointMutation({
    onError: (error, variables, context) => {
      console.log(`Drop point mutation error: ${error}`)
      if (context?.abortController) {
        context.abortController.abort(
          'Drop point request cancelled due to error',
        )
      }
    },
  })

  // Хук для управления hover состоянием
  const {
    hoverMarker,
    hoveredRouteSectionId,
    hoveredRouteIndex,
    handleHover,
    handleHoverOut,
    clearHoverState,
  } = useRouteHover()

  // Хук для управления waypoints (drag & drop)
  const { wayPoints, handleAddWaypoint, handleUpdateWaypoint, clearWayPoints } =
    useWaypointManagement({
      truckId,
      origin,
      destination,
      originName,
      destinationName,
      directionsMutation,
      dropPointMutation,
    })

  // Хук для переключения маршрутов (включает очистку hover)
  const { switchToAlternative, ALTERNATIVE_ROUTES_START_INDEX } =
    useRouteSwitching({
      mainRoute,
      alternativeRoutes,
      routeSectionIds,
      setMainRoute,
      setAlternativeRoutes,
      setRouteSectionIds,
      onRouteClick: (routeSectionId: string) => {
        // Находим данные маршрута для выбранной секции
        const selectedRoute = data?.route?.find(
          (r) => r.routeSectionId === routeSectionId,
        )

        if (selectedRoute) {
          setRouteInfo({
            selectedSectionId: routeSectionId,
            miles: selectedRoute.routeInfo.miles,
            driveTime: selectedRoute.routeInfo.driveTime,
          })
        } else {
          setSelectedSectionId(routeSectionId)
        }
      },
      clearHoverState,
    })

  // Сбрасываем wayPoints при изменении origin или destination
  useEffect(() => {
    clearWayPoints()
  }, [origin, destination, clearWayPoints])

  // Функция для очистки альтернативных маршрутов после начала перетаскивания
  const clearAlternatives = useCallback(() => {
    setAlternativeRoutes([])
  }, [])

  //? Передаем функцию очистки в родительский компонент
  useEffect(() => {
    if (onClearAlternativeRoutes) {
      onClearAlternativeRoutes(clearAlternatives)
    }
  }, [onClearAlternativeRoutes, clearAlternatives])

  // Обработка данных маршрута
  useEffect(() => {
    if (!data?.route || data.route.length === 0) return
    try {
      const allShapes: google.maps.LatLngLiteral[][] = data.route.map(
        (route) => {
          return convertCoordinatePairsToLatLng(route.mapPoints)
        },
      )

      if (allShapes.length > 0) {
        setMainRoute([...allShapes[0]])
        setAlternativeRoutes(
          allShapes.length > 1 ? [...allShapes.slice(1)] : [],
        )

        // Сохраняем routeSectionIds для всех маршрутов
        const sectionIds = data.route.map((route) => route.routeSectionId)
        setRouteSectionIds(sectionIds)

        if (allShapes[0].length > 0) {
          setStartMarker({ ...allShapes[0][0] })
          setEndMarker({ ...allShapes[0][allShapes[0].length - 1] })
        }
      }
    } catch (error) {
      console.error('Error processing route data:', error)
    }
  }, [data])

  /**
   * Обработка клика на hover marker
   * Переключается на альтернативный маршрут, если hover на нем
   */
  const handleHoverMarkerClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (hoveredRouteIndex !== null && hoveredRouteIndex > 0) {
        // Преобразуем глобальный индекс в индекс альтернативного маршрута
        const altRouteIndex = hoveredRouteIndex - ALTERNATIVE_ROUTES_START_INDEX
        switchToAlternative(altRouteIndex)
      }
    },
    [hoveredRouteIndex, ALTERNATIVE_ROUTES_START_INDEX, switchToAlternative],
  )

  /**
   * Обработка drag & drop для добавления нового waypoint
   */
  const handleMarkerOnDragEnd = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      await handleAddWaypoint(e)
      clearHoverState()
    },
    [handleAddWaypoint, clearHoverState],
  )

  return (
    <>
      <RoutePolylines
        mainRoute={mainRoute}
        alternativeRoutes={alternativeRoutes}
        routeSectionIds={routeSectionIds}
        onHover={handleHover}
        onHoverOut={handleHoverOut}
        onAltRouteClick={switchToAlternative}
      />
      <RouteMarkers
        hoverMarker={hoverMarker}
        hoveredRouteSectionId={hoveredRouteSectionId}
        wayPoints={wayPoints}
        startMarker={startMarker}
        endMarker={endMarker}
        onMarkerDragStart={clearAlternatives}
        onMarkerDragEnd={handleMarkerOnDragEnd}
        onExistingMarkerDragEnd={handleUpdateWaypoint}
        onHoverMarkerClick={handleHoverMarkerClick}
      />
    </>
  )
}
