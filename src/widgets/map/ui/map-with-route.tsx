'use client'

import React, { useRef, useState, useMemo, useCallback } from 'react'
import { MapBase, Polyline } from '@/shared/ui'
import { ClusteredGasStationMarkers } from '@/entities/gas-station/ui/clustered-gas-station-markers'
import { FullScreenController } from './controlers/fullscreen'
import { ZoomControl } from './controlers/zoom'
import { Directions, RouteRequestPayload } from '@/features/directions/api'
import { DirectionsRoutes } from '@/features/directions'
import { Truck } from '@/entities/truck'
import { RoutePanelOnMap } from './route-panel'
import { useMap } from '@vis.gl/react-google-maps'
import {
  GasStation,
  GetGasStationsResponse,
  FuelRouteInfo,
} from '@/entities/gas-station'
import { RouteByIdData } from '@/entities/route'
import { GetGasStationsPayload } from '@/entities/gas-station/model/types/gas-station.payload'
import { RouteData } from '@/entities/route'
import { TrackTruck } from '@/features/truck/track-truck'
import { MapErrorsOverlay, MapLoadingOverlay } from './components'
import { useGasStationCart, useGasStationFilters } from '../lib/hooks'
import { useRouteInfoStore } from '@/shared/store'

interface MapWithRouteProps {
  directionsData: Directions | undefined
  gasStations: GasStation[] | undefined
  isPending: boolean
  truck: Truck
  mutateAsync: (variables: RouteRequestPayload) => Promise<Directions>
  updateGasStations: (
    variables: GetGasStationsPayload,
  ) => Promise<GetGasStationsResponse>
  routeData: RouteData | undefined
}

export const MapWithRoute = ({
  directionsData,
  gasStations,
  isPending,
  truck,
  mutateAsync,
  updateGasStations,
  routeData,
}: MapWithRouteProps) => {
  const { selectedSectionId } = useRouteInfoStore()

  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [clickedOutside, setClickedOutside] = useState(false)
  const [clearAlternativeRoutes, setClearAlternativeRoutes] = useState<
    (() => void) | null
  >(null)

  const {
    isStationInCart,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateRefillLiters,
  } = useGasStationCart({
    clearAlternativeRoutes,
  })

  const { markersKey, handleFilterChange } = useGasStationFilters({
    updateGasStations,
  })

  const map = useMap()

  // Фильтруем заправки по выбранному маршруту
  const filteredGasStations = useMemo(() => {
    if (!gasStations || !selectedSectionId) return []
    return gasStations.filter(
      (station) => station.roadSectionId === selectedSectionId,
    )
  }, [gasStations, selectedSectionId])

  const handleGasStationClick = (lat: number, lng: number) => {
    if (map) {
      map.panTo({ lat, lng })
      map.setZoom(15)
    }
  }

  // Функция для получения функции очистки альтернативных маршрутов
  const handleGetClearAlternativeRoutes = useCallback((clearFn: () => void) => {
    setClearAlternativeRoutes(() => clearFn)
  }, [])

  return (
    <div ref={mapContainerRef}>
      <MapBase onMapClick={() => setClickedOutside(true)}>
        <MapLoadingOverlay isPending={isPending} />

        {/* Отображение ошибок поверх карты */}
        <MapErrorsOverlay />

        <DirectionsRoutes
          data={directionsData}
          directionsMutation={mutateAsync}
          truckId={truck.id}
          onClearAlternativeRoutes={handleGetClearAlternativeRoutes}
        />

        {filteredGasStations.length > 0 && (
          <ClusteredGasStationMarkers
            key={markersKey}
            gasStations={filteredGasStations}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateRefillLiters={handleUpdateRefillLiters}
            isStationInCart={isStationInCart}
          />
        )}
        {truck && (
          <TrackTruck
            key={truck.id}
            truckId={truck.id}
            unitNumber={truck.name}
            clickedOutside={clickedOutside}
            resetClick={() => setClickedOutside(false)}
          />
        )}

        {routeData && !directionsData && (
          <Polyline
            path={routeData.route.mapPoints}
            strokeColor="#ff2db5"
            strokeOpacity={0.8}
            strokeWeight={4}
          />
        )}
        <RoutePanelOnMap
          onDeleteGasStation={handleRemoveFromCart}
          onFilterChange={handleFilterChange}
          onGasStationClick={handleGasStationClick}
          gasStations={filteredGasStations}
        />

        <FullScreenController mapRef={mapContainerRef} />
        <ZoomControl />
      </MapBase>
    </div>
  )
}
