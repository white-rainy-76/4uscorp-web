import React, { useEffect, useState } from 'react'
import { convertToLatLngLiteral } from '../lib'
import {
  UseMutateAsyncFunction,
  useMutation,
  useQuery,
} from '@tanstack/react-query'
import { Directions as DirectionType, RouteRequestPayload } from '../api'
import { RoutePolylines } from './directions'
import { RouteMarkers } from './markers'

import { Coordinate } from '@/shared/types'
import { useGetNearestDropPointMutation } from '../api/get-nearest-drop-point.mutation'
import { routeQueries } from '@/entities/route'

interface DirectionsProps {
  data?: DirectionType | undefined
  directionsMutation: UseMutateAsyncFunction<
    DirectionType,
    Error,
    RouteRequestPayload,
    unknown
  >
  origin: Coordinate | null
  destination: Coordinate | null
  onRouteClick?: (routeIndex: number) => void
  truckId: string
  destinationName: string | undefined
  originName: string | undefined
}

export const Directions = ({
  data,
  directionsMutation,
  origin,
  destination,
  onRouteClick,
  truckId,
  destinationName,
  originName,
}: DirectionsProps) => {
  const [mainRoute, setMainRoute] = useState<google.maps.LatLngLiteral[]>([])
  const [alternativeRoutes, setAlternativeRoutes] = useState<
    google.maps.LatLngLiteral[][]
  >([])
  const [routeIndexMapping, setRouteIndexMapping] = useState<number[]>([])
  const [hoverMarker, setHoverMarker] =
    useState<google.maps.LatLngLiteral | null>(null)
  const [wayPoints, setWayPoints] = useState<google.maps.LatLngLiteral[]>([])
  const [startMarker, setStartMarker] =
    useState<google.maps.LatLngLiteral | null>(null)
  const [endMarker, setEndMarker] = useState<google.maps.LatLngLiteral | null>(
    null,
  )
  const [routeSectionIds, setRouteSectionIds] = useState<string[]>([])
  const [hoveredRouteSectionId, setHoveredRouteSectionId] = useState<
    string | null
  >(null)
  const [hoverCoordinates, setHoverCoordinates] = useState<{
    lat: number
    lng: number
  } | null>(null)

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

  // Query для получения расстояния при наведении на полилайн
  const { data: distanceData, isLoading: isDistanceLoading } = useQuery({
    ...routeQueries.distance({
      routeSectionId: hoveredRouteSectionId || '',
      latitude: hoverCoordinates?.lat || 0,
      longitude: hoverCoordinates?.lng || 0,
    }),
    enabled: !!hoveredRouteSectionId && !!hoverCoordinates,
  })

  // Сбрасываем wayPoints при изменении origin или destination
  useEffect(() => {
    setWayPoints([])
  }, [origin, destination])

  // Обработка данных маршрута
  useEffect(() => {
    if (!data?.route || data.route.length === 0) return
    try {
      const allShapes: google.maps.LatLngLiteral[][] = data.route.map(
        (route) => {
          return convertToLatLngLiteral(route.mapPoints)
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

        // Инициализируем маппинг индексов маршрутов
        const initialMapping = allShapes.map((_, index) => index)
        setRouteIndexMapping(initialMapping)

        if (allShapes[0].length > 0) {
          setStartMarker({ ...allShapes[0][0] })
          setEndMarker({ ...allShapes[0][allShapes[0].length - 1] })
        }
      }
    } catch (error) {
      console.error('Error processing route data:', error)
    }
  }, [data])

  // Уведомляем родительский компонент об изменении выбранного маршрута
  useEffect(() => {
    if (onRouteClick && routeIndexMapping.length > 0) {
      const actualRouteIndex = routeIndexMapping[0] || 0
      onRouteClick(actualRouteIndex)
    }
  }, [routeIndexMapping, onRouteClick])

  const handleAltRouteClick = (index: number) => {
    // Сохраняем текущий главный маршрут
    const currentMainRoute = [...mainRoute]
    const currentMainRouteIndex = routeIndexMapping[0]

    // Устанавливаем новый главный маршрут
    setMainRoute(alternativeRoutes[index])

    // Обновляем альтернативные маршруты
    setAlternativeRoutes((prevRoutes) => {
      const newAlts = [...prevRoutes]
      newAlts.splice(index, 1)
      return [currentMainRoute, ...newAlts]
    })

    // Обновляем маппинг индексов
    setRouteIndexMapping((prevMapping) => {
      const newMapping = [...prevMapping]
      const selectedRouteOriginalIndex = newMapping[index + 1] // +1 потому что первый элемент - это главный маршрут

      // Перемещаем выбранный маршрут в начало
      newMapping.splice(index + 1, 1)
      newMapping.unshift(selectedRouteOriginalIndex)

      return newMapping
    })

    // Немедленно уведомляем родительский компонент о переключении маршрута
    if (onRouteClick) {
      const selectedRouteOriginalIndex = routeIndexMapping[index + 1]
      onRouteClick(selectedRouteOriginalIndex)
    }
  }

  interface Coordinate {
    latitude: number
    longitude: number
  }

  const transformWayPointsToCoordinates = (
    points: { lat: number; lng: number }[],
  ): Coordinate[] => {
    return points.map((point) => ({
      latitude: point.lat,
      longitude: point.lng,
    }))
  }

  const handleError = (error: any, context: string) => {
    console.error(`Error ${context}:`, error)
  }

  const handleExistingMarkerOnDragEnd = async (
    index: number,
    e: google.maps.MapMouseEvent,
  ) => {
    if (!e.latLng) return

    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }

    try {
      const nearestPoint = await dropPointMutation.mutateAsync({
        latitude: newPosition.lat,
        longitude: newPosition.lng,
      })
      console.log(nearestPoint)
      const newMarkers = [...wayPoints]
      newMarkers[index] = {
        lat: nearestPoint.latitude,
        lng: nearestPoint.longitude,
      }
      setWayPoints(newMarkers)

      // Используем переданную мутацию вместо локальной
      await directionsMutation({
        TruckId: truckId,
        origin: origin || { latitude: 0, longitude: 0 },
        destination: destination || { latitude: 0, longitude: 0 },
        destinationName: destinationName || '',
        originName: originName || '',
        ViaPoints: transformWayPointsToCoordinates(newMarkers),
      })
    } catch (error) {
      handleError(error, 'handling drop point for existing marker')
    }
  }

  const handleMarkerOnDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return

    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }

    try {
      const nearestPoint = await dropPointMutation.mutateAsync({
        latitude: newPosition.lat,
        longitude: newPosition.lng,
      })
      console.log(nearestPoint)
      const newPoint = {
        lat: nearestPoint.latitude,
        lng: nearestPoint.longitude,
      }

      const updatedWayPoints = [...wayPoints, newPoint]
      setWayPoints(updatedWayPoints)
      setHoverMarker(null)

      // Используем переданную мутацию вместо локальной
      await directionsMutation({
        TruckId: truckId,
        origin: origin || { latitude: 0, longitude: 0 },
        destination: destination || { latitude: 0, longitude: 0 },
        destinationName: destinationName || '',
        originName: originName || '',
        ViaPoints: transformWayPointsToCoordinates(updatedWayPoints),
      })
    } catch (error) {
      handleError(error, 'handling drop point for new marker')
    }
  }

  return (
    <>
      <RoutePolylines
        mainRoute={mainRoute}
        alternativeRoutes={alternativeRoutes}
        routeSectionIds={routeSectionIds}
        onHover={(e, routeSectionId) => {
          if (e.latLng) {
            const coordinates = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            }
            setHoverMarker(coordinates)
            setHoverCoordinates(coordinates)
            setHoveredRouteSectionId(routeSectionId)
          }
        }}
        onHoverOut={() => {
          setHoverMarker(null)
          setHoverCoordinates(null)
          setHoveredRouteSectionId(null)
        }}
        onAltRouteClick={handleAltRouteClick}
      />
      <RouteMarkers
        hoverMarker={hoverMarker}
        wayPoints={wayPoints}
        startMarker={startMarker}
        endMarker={endMarker}
        distanceData={distanceData}
        isDistanceLoading={isDistanceLoading}
        onMarkerDragStart={() => setAlternativeRoutes([])}
        onMarkerDragEnd={handleMarkerOnDragEnd}
        onExistingMarkerDragEnd={handleExistingMarkerOnDragEnd}
      />
    </>
  )
}
