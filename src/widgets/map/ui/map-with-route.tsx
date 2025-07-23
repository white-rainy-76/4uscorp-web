'use client'

import React, { useRef, useState, useMemo, useEffect } from 'react'
import { MapBase, Polyline, Spinner } from '@/shared/ui'
import { ClusteredGasStationMarkers } from '@/entities/gas-station/ui/clustered-gas-station-markers'
import { FullScreenController } from './controlers/fullscreen'
import { ZoomControl } from './controlers/zoom'
import { Coordinate } from '@/shared/types'
import { Directions, RouteRequestPayload } from '@/features/directions/api'
import { DirectionsRoutes } from '@/features/directions'
import { TrackTruck } from '@/features/truck-track/ui/tracked-truck'
import { Truck } from '@/entities/truck'
import { RoutePanelOnMap } from './route-panel'
import { useMap } from '@vis.gl/react-google-maps'
import { GasStation, GetGasStationsResponse } from '@/entities/gas-station'
import { UpdateGasStationsPayload } from '@/entities/gas-station/api/types/gas-station.payload'
import { RouteData } from '@/entities/route/api/types/route'

interface MapWithRouteProps {
  origin: Coordinate | null
  destination: Coordinate | null
  destinationName: string | undefined
  originName: string | undefined
  directionsData: Directions | undefined
  gasStations: GasStation[] | undefined
  remainingFuelLiters: number | undefined
  isDirectionsPending: boolean
  isGasStationsPending: boolean
  isRoutePending: boolean
  truck: Truck
  selectedRouteId: string | null
  handleRouteClick: (routeIndex: number) => void
  mutateAsync: (variables: RouteRequestPayload) => Promise<Directions>
  updateGasStations: (
    variables: UpdateGasStationsPayload,
  ) => Promise<GetGasStationsResponse>
  finishFuel: number | undefined
  selectedProviders: string[]
  setSelectedProviders: (value: string[]) => void
  fuel: string | undefined
  truckWeight: number | undefined
  routeData: RouteData | undefined
}

export const MapWithRoute = ({
  origin,
  destination,
  directionsData,
  gasStations,
  remainingFuelLiters,
  isDirectionsPending,
  isRoutePending,
  isGasStationsPending,
  handleRouteClick,
  selectedRouteId,
  truck,
  mutateAsync,
  updateGasStations,
  selectedProviders,
  setSelectedProviders,
  finishFuel,
  fuel,
  truckWeight,
  routeData,
  originName,
  destinationName,
}: MapWithRouteProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [clickedOutside, setClickedOutside] = useState(false)
  const [markersKey, setMarkersKey] = useState(0)
  const [cart, setCart] = useState<GasStation[]>([])

  const map = useMap()

  const filteredGasStations = useMemo(() => {
    if (!gasStations || !selectedRouteId) return []
    return gasStations.filter(
      (station) => station.roadSectionId === selectedRouteId,
    )
  }, [gasStations, selectedRouteId])

  const handleAddToCart = async (station: GasStation) => {
    const newCart = [...cart, { ...station, refillLiters: station.refill || 0 }]
    setCart(newCart)
    console.log(newCart)
    await updateGasStations({
      routeId: directionsData?.routeId || '',
      routeSectionIds: directionsData?.route.map((r) => r.routeSectionId) || [],
      requiredFuelStations: newCart.map((s) => ({
        stationId: s.id,
        refillLiters: Number(s.refill || 0),
      })),
      ...(truckWeight !== undefined &&
        truckWeight !== 0 && { Weight: truckWeight }),
      FinishFuel: finishFuel,
      FuelProviderNameList: selectedProviders,
      CurrentFuel: fuel?.toString(),
    })
  }

  const handleRemoveFromCart = async (stationId: string) => {
    const newCart = cart.filter((s) => s.id !== stationId)
    setCart(newCart)

    await updateGasStations({
      routeId: directionsData?.routeId || '',
      routeSectionIds: directionsData?.route.map((r) => r.routeSectionId) || [],
      requiredFuelStations: newCart.map((s) => ({
        stationId: s.id,
        refillLiters: Number(s.refill || 0),
      })),
      ...(truckWeight !== undefined &&
        truckWeight !== 0 && { Weight: truckWeight }),
      FinishFuel: finishFuel,
      FuelProviderNameList: selectedProviders,
      CurrentFuel: fuel?.toString(),
    })
  }

  const handleUpdateRefillLiters = async (
    stationId: string,
    liters: number,
  ) => {
    console.log('Liters to update ' + liters)
    console.log('stationId ' + stationId)
    const newCart = cart.map((s) =>
      s.id === stationId ? { ...s, refill: liters } : s,
    )

    console.log(newCart)
    await updateGasStations({
      routeId: directionsData?.routeId || '',
      routeSectionIds: directionsData?.route.map((r) => r.routeSectionId) || [],
      requiredFuelStations: newCart.map((s) => ({
        stationId: s.id,
        refillLiters: Number(s.refill || 0),
      })),
      ...(truckWeight !== undefined &&
        truckWeight !== 0 && { Weight: truckWeight }),
      FinishFuel: finishFuel,
      FuelProviderNameList: selectedProviders,
      CurrentFuel: fuel?.toString(),
    })
  }

  useEffect(() => {
    if (!gasStations || !routeData) return

    const newCart = gasStations.filter(
      (station) =>
        station.isAlgorithm && station.roadSectionId === selectedRouteId,
    )

    setCart(newCart)
  }, [gasStations, routeData, selectedRouteId])

  const handleFilterChange = async (providers: string[]) => {
    setSelectedProviders(providers)
    setMarkersKey((prevKey) => prevKey + 1)

    if (!directionsData?.routeId || !directionsData.route) return

    await updateGasStations({
      routeId: directionsData.routeId,
      routeSectionIds: directionsData.route.map((r) => r.routeSectionId),
      FinishFuel: finishFuel,
      ...(truckWeight !== undefined &&
        truckWeight !== 0 && { Weight: truckWeight }),
      FuelProviderNameList: providers,
      CurrentFuel: fuel?.toString(),
    })
  }

  const handleGasStationClick = (lat: number, lng: number) => {
    if (map) {
      map.panTo({ lat, lng })
      map.setZoom(15)
    }
  }

  return (
    <div ref={mapContainerRef}>
      <MapBase onMapClick={() => setClickedOutside(true)}>
        {(isDirectionsPending || isGasStationsPending || isRoutePending) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-[101] pointer-events-auto">
            <Spinner size="lg" />
          </div>
        )}

        <DirectionsRoutes
          origin={origin}
          destination={destination}
          originName={originName}
          destinationName={destinationName}
          data={directionsData}
          directionsMutation={mutateAsync}
          onRouteClick={handleRouteClick}
          truckId={truck.id}
        />

        {filteredGasStations.length > 0 && (
          <ClusteredGasStationMarkers
            key={markersKey}
            gasStations={filteredGasStations}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateRefillLiters={handleUpdateRefillLiters}
            cart={cart}
          />
        )}
        {!directionsData && (
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
          selectedRouteId={selectedRouteId}
          onDeleteGasStation={handleRemoveFromCart}
          onFilterChange={handleFilterChange}
          onGasStationClick={handleGasStationClick}
          selectedProviders={selectedProviders}
          fuelLeftOver={remainingFuelLiters}
          directions={directionsData}
          cart={cart}
        />

        <FullScreenController mapRef={mapContainerRef} />
        <ZoomControl />
      </MapBase>
    </div>
  )
}
