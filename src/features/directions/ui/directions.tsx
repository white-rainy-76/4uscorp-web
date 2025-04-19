import React, { useEffect, useState } from 'react'
import { Marker } from '@vis.gl/react-google-maps'
import { convertToLatLngLiteral } from '../lib'
import { rawData } from '../const/rawData'
import { Polyline } from '@/shared/ui/map'
import { useRouteStore } from '@/shared/store/route-store'
import { useQuery } from '@tanstack/react-query'
import { directionsQueries } from '../api/directions.queries'
import { Coordinates } from '../api/payload/directions.payload'

export const Directions = () => {
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

  const { origin, destination } = useRouteStore()

  const { data, isLoading, isError, error } = useQuery({
    ...directionsQueries.detailsQuery({
      origin: origin as Coordinates,
      destination: destination as Coordinates,
    }),
    enabled: !!origin && !!destination,
  })

  useEffect(() => {
    if (!data?.routeIds || data.routeIds.length === 0) return

    try {
      // Обрабатываем маршруты на основе предоставленной структуры данных
      const allShapes: google.maps.LatLngLiteral[][] = data.routeIds.map(
        (route) => {
          // Используем функцию convertToLatLngLiteral для преобразования координат
          return convertToLatLngLiteral(route.mapPoints)
        },
      )

      console.log('Extracted routes:', allShapes)

      if (allShapes.length > 0) {
        // Устанавливаем основной маршрут и альтернативные
        setMainRoute([...allShapes[0]])
        setAlternativeRoutes(
          allShapes.length > 1 ? [...allShapes.slice(1)] : [],
        )

        // Устанавливаем маркеры начала и конца маршрута
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
    setMainRoute(alternativeRoutes[index]) // делаем выбранный маршрут основным
    setAlternativeRoutes((prevRoutes) => {
      const newAlts = [...prevRoutes]
      newAlts.splice(index, 1) // удаляем выбранный из альтернативных
      return [mainRoute, ...newAlts] // перемещаем старый основной в начало
    })
  }
  const handleExistingMarkerOnDragEnd = (
    index: number,
    e: google.maps.MapMouseEvent,
  ) => {
    if (!e.latLng) return

    const newMarkers = [...wayPoints]
    console.log('A Lat: ' + newMarkers[index].lat)
    console.log('A Lng: ' + newMarkers[index].lng)
    console.log('B Lat: ' + e.latLng.lat())
    console.log('B Lng: ' + e.latLng.lng())
    newMarkers[index] = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }
    setWayPoints(newMarkers)
  }
  const handleMarkerOnDragEnd = (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return
    const newPosition = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }
    console.log('A Lat: ' + e.latLng.lat())
    console.log('A Lng: ' + e.latLng.lng())
    setWayPoints((prev) => [...prev, newPosition])
    setHoverMarker(null)
  }

  return (
    <>
      {mainRoute.length > 0 && (
        <Polyline
          path={mainRoute}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={6}
          onMouseMove={(e: any) => {
            if (e.latLng) {
              setHoverMarker({
                lat: e.latLng.lat(),
                lng: e.latLng.lng(),
              })
            }
          }}
          onMouseOut={() => {
            setHoverMarker(null)
          }}
        />
      )}

      {/* Отрисовка маркера под курсором */}
      {hoverMarker && (
        <Marker
          position={hoverMarker}
          draggable
          onDragStart={() => {
            setAlternativeRoutes([])
          }}
          onDragEnd={(e) => {
            handleMarkerOnDragEnd(e)
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#FF0000',
            fillOpacity: 1,
            strokeWeight: 2,
          }}
        />
      )}
      {wayPoints.map((marker, index) => (
        <Marker
          key={`draggable-${index}`}
          position={marker}
          draggable
          onDragEnd={(e) => handleExistingMarkerOnDragEnd(index, e)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#00AA00',
            fillOpacity: 1,
            strokeWeight: 2,
          }}
        />
      ))}
      {alternativeRoutes.map((altRoute, index) => (
        <Polyline
          key={`alt-route-${index}`}
          path={altRoute}
          strokeColor="#141414"
          strokeOpacity={0.5}
          strokeWeight={3}
          onClick={() => handleAltRouteClick(index)}
        />
      ))}

      {startMarker && (
        <Marker
          position={startMarker}
          label={{
            text: 'A',
            color: 'white',
            fontSize: '16px',
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: 'green',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: 'white',
          }}
        />
      )}

      {endMarker && (
        <Marker
          position={endMarker}
          label={{
            text: 'B',
            color: 'white',
            fontSize: '16px',
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: 'red',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: 'white',
          }}
        />
      )}
    </>
  )
}
