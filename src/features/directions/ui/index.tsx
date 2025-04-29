import React, { useEffect, useState } from 'react'
import { convertToLatLngLiteral } from '../lib'
import { UseMutateAsyncFunction, useMutation } from '@tanstack/react-query'

import { Directions as DirectionType } from '../model'
import { RoutePolylines } from './directions'
import { RouteMarkers } from './markers'

import { getNearestDropPoint } from '../api/get-nearest-drop-point'
import { RouteRequestPayload } from '../api/payload/directions.payload'
import { Coordinate } from '@/shared/types'

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
}

export const Directions = ({
  data,
  directionsMutation,
  origin,
  destination,
}: DirectionsProps) => {
  const [mainRoute, setMainRoute] = useState<google.maps.LatLngLiteral[]>([])
  const [alternativeRoutes, setAlternativeRoutes] = useState<
    google.maps.LatLngLiteral[][]
  >([])
  const [hoverMarker, setHoverMarker] =
    useState<google.maps.LatLngLiteral | null>(null)
  const [wayPoints, setWayPoints] = useState<google.maps.LatLngLiteral[]>([])
  const [startMarker, setStartMarker] =
    useState<google.maps.LatLngLiteral | null>(null)
  const [endMarker, setEndMarker] = useState<google.maps.LatLngLiteral | null>(
    null,
  )

  const dropPointMutation = useMutation({
    mutationFn: getNearestDropPoint,
    onError: (error, variables, context) => {
      console.log(`${error}`)
    },
  })

  // Сбрасываем wayPoints при изменении origin или destination
  useEffect(() => {
    setWayPoints([])
  }, [origin, destination])

  // Обработка данных маршрута
  useEffect(() => {
    console.log(data?.routeDtos)
    if (!data?.routeDtos || data.routeDtos.length === 0) return
    try {
      const allShapes: google.maps.LatLngLiteral[][] = data.routeDtos.map(
        (route) => {
          return convertToLatLngLiteral(route.mapPoints)
        },
      )

      if (allShapes.length > 0) {
        setMainRoute([...allShapes[0]])
        setAlternativeRoutes(
          allShapes.length > 1 ? [...allShapes.slice(1)] : [],
        )

        if (allShapes[0].length > 0) {
          setStartMarker({ ...allShapes[0][0] })
          setEndMarker({ ...allShapes[0][allShapes[0].length - 1] })
        }
      }
    } catch (error) {
      console.error('Error processing route data:', error)
    }
  }, [data])

  const handleAltRouteClick = (index: number) => {
    setMainRoute(alternativeRoutes[index])
    setAlternativeRoutes((prevRoutes) => {
      const newAlts = [...prevRoutes]
      newAlts.splice(index, 1)
      return [mainRoute, ...newAlts]
    })
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
        origin: origin || { latitude: 0, longitude: 0 },
        destination: destination || { latitude: 0, longitude: 0 },
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
        origin: origin || { latitude: 0, longitude: 0 },
        destination: destination || { latitude: 0, longitude: 0 },
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
        onHover={(e) => {
          if (e.latLng) {
            setHoverMarker({
              lat: e.latLng.lat(),
              lng: e.latLng.lng(),
            })
          }
        }}
        onHoverOut={() => setHoverMarker(null)}
        onAltRouteClick={handleAltRouteClick}
      />
      <RouteMarkers
        hoverMarker={hoverMarker}
        wayPoints={wayPoints}
        startMarker={startMarker}
        endMarker={endMarker}
        onMarkerDragStart={() => setAlternativeRoutes([])}
        onMarkerDragEnd={handleMarkerOnDragEnd}
        onExistingMarkerDragEnd={handleExistingMarkerOnDragEnd}
      />
    </>
  )
}
