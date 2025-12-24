'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import {
  Directions as DirectionType,
  RouteRequestPayload,
} from '@/features/directions/api'
import { RoutePolylines } from '@/features/directions/ui/route-polylines'
import { RouteMarkers } from '@/features/directions/ui/markers'
import { convertCoordinatePairsToLatLng } from '@/shared/lib/coordinates'
import { useGetNearestDropPointMutation } from '@/features/directions/api/get-nearest-drop-point.mutation'
import {
  useWaypointManagement,
  useRouteSwitching,
  useRouteHover,
} from '@/features/directions/lib'
import { useSavedRoutesStore } from '@/shared/store'
import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'
import { TollMarker, TollPricesSheet } from '@/entities/tolls/ui'
import { convertTollWithSectionToToll } from '@/widgets/map/lib/helpers/convert-toll-with-section'
import { AxelType } from '@/entities/tolls/api'
import { Toll } from '@/entities/tolls'

interface SavedRoutesDirectionsProps {
  data?: DirectionType | undefined
  directionsMutation: UseMutateAsyncFunction<
    DirectionType,
    Error,
    RouteRequestPayload,
    unknown
  >
  tolls?: TollWithSection[]
  onClearWaypointsCallback?: (clearFn: () => void) => void
  selectedAxelType?: AxelType
}

export const SavedRoutesDirections = ({
  data,
  directionsMutation,
  tolls,
  onClearWaypointsCallback,
  selectedAxelType,
}: SavedRoutesDirectionsProps) => {
  const {
    origin,
    destination,
    originName,
    destinationName,
    sectionId,
    setSectionId,
    setRouteId,
  } = useSavedRoutesStore()

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
  const [detailsToll, setDetailsToll] = useState<Toll | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

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
  const {
    wayPoints,
    handleAddWaypoint,
    handleUpdateWaypoint,
    handleDeleteWaypoint,
    clearWayPoints,
  } = useWaypointManagement({
    origin,
    destination,
    originName,
    destinationName,
    directionsMutation,
    dropPointMutation,
    initialWaypoints: data?.waypoints,
  })

  // Хук для переключения маршрутов
  const { switchToAlternative, ALTERNATIVE_ROUTES_START_INDEX } =
    useRouteSwitching({
      mainRoute,
      alternativeRoutes,
      routeSectionIds,
      setMainRoute,
      setAlternativeRoutes,
      setRouteSectionIds,
      onRouteClick: (routeSectionId: string) => {
        setSectionId(routeSectionId)
        if (data?.routeId) {
          setRouteId(data.routeId)
        }
      },
      clearHoverState,
    })

  // В saved routes не очищаем waypoints при изменении origin/destination,
  // так как они должны загружаться из data.waypoints при загрузке маршрута

  // Передаем функцию очистки в родительский компонент
  useEffect(() => {
    if (onClearWaypointsCallback) {
      onClearWaypointsCallback(clearWayPoints)
    }
  }, [onClearWaypointsCallback, clearWayPoints])

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

        const sectionIds = data.route.map((route) => route.routeSectionId)
        setRouteSectionIds(sectionIds)

        // Обновляем sectionId первого маршрута в store при получении новых данных
        if (sectionIds.length > 0) {
          setSectionId(sectionIds[0])
          if (data.routeId) {
            setRouteId(data.routeId)
          }
        }

        if (allShapes[0].length > 0) {
          setStartMarker({ ...allShapes[0][0] })
          setEndMarker({ ...allShapes[0][allShapes[0].length - 1] })
        }
      }
    } catch (error) {
      console.error('Error processing route data:', error)
    }
  }, [data, setSectionId, setRouteId])

  // Обработка клика на hover marker
  const handleHoverMarkerClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (hoveredRouteIndex !== null && hoveredRouteIndex > 0) {
        const altRouteIndex = hoveredRouteIndex - ALTERNATIVE_ROUTES_START_INDEX
        switchToAlternative(altRouteIndex)
      }
    },
    [hoveredRouteIndex, ALTERNATIVE_ROUTES_START_INDEX, switchToAlternative],
  )

  // Обработка drag & drop для добавления нового waypoint
  const handleMarkerOnDragEnd = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      await handleAddWaypoint(e)
      clearHoverState()
    },
    [handleAddWaypoint, clearHoverState],
  )

  // Фильтруем tolls по выбранной секции
  const filteredTolls = useMemo(() => {
    if (!tolls || !sectionId) return []
    return tolls.filter(
      (toll) => toll.routeSection === sectionId && !toll.isDynamic,
    )
  }, [tolls, sectionId])

  return (
    <>
      <TollPricesSheet
        open={detailsOpen}
        toll={detailsToll}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setDetailsToll(null)
        }}
      />

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
        onMarkerDragStart={() => {}}
        onMarkerDragEnd={handleMarkerOnDragEnd}
        onExistingMarkerDragEnd={handleUpdateWaypoint}
        onExistingMarkerClick={handleDeleteWaypoint}
        onHoverMarkerClick={handleHoverMarkerClick}
      />

      {/* Отображение tolls */}
      {filteredTolls.length > 0 &&
        filteredTolls.map((toll) => {
          const mappedToll = convertTollWithSectionToToll(toll)
          return (
            <TollMarker
              key={toll.id}
              toll={mappedToll}
              selectedAxelType={selectedAxelType}
              selectedPaymentType={null}
              onTollOpenDetails={(t) => {
                setDetailsToll(t)
                setDetailsOpen(true)
              }}
            />
          )
        })}
    </>
  )
}
