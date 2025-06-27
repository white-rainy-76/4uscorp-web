'use client'

import React, { useRef, useState, useMemo, useEffect } from 'react'
import { MapBase, Spinner } from '@/shared/ui'
import { ClusteredGasStationMarkers } from '@/entities/gas-station/ui/clustered-gas-station-markers'
import { FullScreenController } from './controlers/fullscreen'
import { ZoomControl } from './controlers/zoom'
import { Coordinate } from '@/shared/types'
import { Directions } from '@/features/directions/api'
import { DirectionsRoutes } from '@/features/directions'
import { TrackTruck } from '@/features/truck-track/ui/tracked-truck'
import { Truck } from '@/entities/truck'
import { RoutePanelOnMap } from './route-panel'
import { useMap } from '@vis.gl/react-google-maps'
import { GasStation, GetGasStationsResponse } from '@/entities/gas-station'
import { UpdateGasStationsPayload } from '@/entities/gas-station/api/types/gas-station.payload'

interface MapWithRouteProps {
  origin: Coordinate | null
  destination: Coordinate | null
  routeData: Directions | undefined
  getGasStationsResponseData: GetGasStationsResponse | undefined
  isRoutePending: boolean
  isGasStationsPending: boolean
  truck: Truck
  selectedRouteId: string | null
  handleRouteClick: (routeIndex: number) => void
  mutateAsync: (variables: {
    origin: Coordinate
    destination: Coordinate
  }) => Promise<Directions>
  updateGasStations: (
    variables: UpdateGasStationsPayload,
  ) => Promise<GetGasStationsResponse>
  finishFuel: number | undefined
  selectedProviders: string[]
  setSelectedProviders: (value: string[]) => void
  fuel: string | undefined
}

export const MapWithRoute = ({
  origin,
  destination,
  routeData,
  getGasStationsResponseData,
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
}: MapWithRouteProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [clickedOutside, setClickedOutside] = useState(false)
  const [markersKey, setMarkersKey] = useState(0)
  const [cart, setCart] = useState<GasStation[]>([])

  const map = useMap()

  const filteredGasStations = useMemo(() => {
    if (!getGasStationsResponseData?.fuelStations || !selectedRouteId) return []
    return getGasStationsResponseData.fuelStations.filter(
      (station) => station.roadSectionId === selectedRouteId,
    )
  }, [getGasStationsResponseData?.fuelStations, selectedRouteId])

  const handleAddToCart = async (station: GasStation) => {
    const newCart = [...cart, { ...station, refillLiters: station.refill || 0 }]
    setCart(newCart)
    console.log(newCart)
    await updateGasStations({
      routeId: routeData?.routeId || '',
      routeSectionIds: routeData?.route.map((r) => r.routeSectionId) || [],
      requiredFuelStations: newCart.map((s) => ({
        stationId: s.id,
        refillLiters: Number(s.refill || 0),
      })),
      FinishFuel: finishFuel,
      FuelProviderNameList: selectedProviders,
      CurrentFuel: fuel,
    })
  }

  const handleRemoveFromCart = async (stationId: string) => {
    const newCart = cart.filter((s) => s.id !== stationId)
    setCart(newCart)

    await updateGasStations({
      routeId: routeData?.routeId || '',
      routeSectionIds: routeData?.route.map((r) => r.routeSectionId) || [],
      requiredFuelStations: newCart.map((s) => ({
        stationId: s.id,
        refillLiters: Number(s.refill || 0),
      })),
      FinishFuel: finishFuel,
      FuelProviderNameList: selectedProviders,
      CurrentFuel: fuel,
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
      routeId: routeData?.routeId || '',
      routeSectionIds: routeData?.route.map((r) => r.routeSectionId) || [],
      requiredFuelStations: newCart.map((s) => ({
        stationId: s.id,
        refillLiters: Number(s.refill || 0),
      })),
      FinishFuel: finishFuel,
      FuelProviderNameList: selectedProviders,
      CurrentFuel: fuel,
    })
  }

  useEffect(() => {
    if (!getGasStationsResponseData?.fuelStations || !routeData) return

    const newCart = getGasStationsResponseData?.fuelStations.filter(
      (station) =>
        station.isAlgorithm && station.roadSectionId === selectedRouteId,
    )

    setCart(newCart)
  }, [getGasStationsResponseData?.fuelStations, routeData, selectedRouteId])

  const handleFilterChange = async (providers: string[]) => {
    setSelectedProviders(providers)
    setMarkersKey((prevKey) => prevKey + 1)

    if (!routeData?.routeId || !routeData.route) return

    await updateGasStations({
      routeId: routeData.routeId,
      routeSectionIds: routeData.route.map((r) => r.routeSectionId),
      requiredFuelStations: cart.map((s) => ({
        stationId: s.id,
        refillLiters: Number(s.refill || 0),
      })),
      FinishFuel: finishFuel,
      FuelProviderNameList: providers,
      CurrentFuel: fuel,
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
        {(isRoutePending || isGasStationsPending) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-[101] pointer-events-auto">
            <Spinner size="lg" />
          </div>
        )}

        <DirectionsRoutes
          origin={origin}
          destination={destination}
          data={routeData}
          directionsMutation={mutateAsync}
          onRouteClick={handleRouteClick}
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
        <TrackTruck
          key={truck.id}
          truckId={truck.id}
          unitNumber={truck.name}
          clickedOutside={clickedOutside}
          resetClick={() => setClickedOutside(false)}
        />

        <RoutePanelOnMap
          selectedRouteId={selectedRouteId}
          onDeleteGasStation={handleRemoveFromCart}
          onFilterChange={handleFilterChange}
          onGasStationClick={handleGasStationClick}
          selectedProviders={selectedProviders}
          fuelLeftOver={
            getGasStationsResponseData?.finishInfo.remainingFuelLiters
          }
          directions={routeData}
          cart={cart}
        />

        <FullScreenController mapRef={mapContainerRef} />
        <ZoomControl />
      </MapBase>
    </div>
  )
}
