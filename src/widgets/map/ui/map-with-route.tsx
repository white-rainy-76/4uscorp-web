'use client'

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { MapBase, Polyline } from '@/shared/ui'
import { ClusteredGasStationMarkers } from '@/entities/gas-station/ui/clustered-gas-station-markers'
import { FullScreenController } from './controlers/fullscreen'
import { ZoomControl } from './controlers/zoom'
import { Coordinate } from '@/shared/types'
import { Directions, RouteRequestPayload } from '@/features/directions/api'
import { DirectionsRoutes } from '@/features/directions'
import { Truck } from '@/entities/truck'
import { RoutePanelOnMap } from './route-panel'
import { useMap } from '@vis.gl/react-google-maps'
import {
  GasStation,
  GetGasStationsResponse,
  FuelRouteInfo,
  FuelPlan,
} from '@/entities/gas-station'
import { RouteByIdData } from '@/entities/route'
import { GetGasStationsPayload } from '@/entities/gas-station/model/types/gas-station.payload'
import { RouteData } from '@/entities/route'
import { TrackTruck } from '@/features/truck/track-truck'
import { MapErrorsOverlay, MapLoadingOverlay } from './components'
import {
  useGasStationCart,
  useGasStationFilters,
  useFuelPlanId,
} from '../lib/hooks'

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
  handleRouteClick: (routeSectionId: string) => void
  mutateAsync: (variables: RouteRequestPayload) => Promise<Directions>
  updateGasStations: (
    variables: GetGasStationsPayload,
  ) => Promise<GetGasStationsResponse>
  finishFuel: number | undefined
  selectedProviders: string[]
  setSelectedProviders: (value: string[]) => void
  fuel: string | undefined
  truckWeight: number | undefined
  routeData: RouteData | undefined
  fuelRouteInfoDtos?: FuelRouteInfo[]
  routeByIdTotalFuelAmount?: number
  routeByIdTotalPriceAmount?: number
  fuelPlans?: FuelPlan[]
  routeByIdData?: RouteByIdData
  fuelPlanId?: string
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
  fuelRouteInfoDtos,
  routeByIdTotalFuelAmount,
  routeByIdTotalPriceAmount,
  fuelPlans,
  routeByIdData,
  fuelPlanId,
}: MapWithRouteProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [clickedOutside, setClickedOutside] = useState(false)
  const [clearAlternativeRoutes, setClearAlternativeRoutes] = useState<
    (() => void) | null
  >(null)

  // Используем кастомные хуки
  const { getPriorityFuelPlanId } = useFuelPlanId({
    fuelPlans,
    routeByIdData,
    fuelPlanId,
    selectedRouteId,
  })

  const {
    cart,
    stationErrors,
    stationChanges,
    mapErrors,
    finalFuelAmount,
    updatedFuelAmount,
    updatedPriceAmount,
    isStationInCart,
    getStationRefillLiters,
    getStationFuelLeftBeforeRefill,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateRefillLiters,
    clearCartAndErrors,
    setCartData,
    setMapErrors,
    setFinalFuelAmount,
  } = useGasStationCart({
    selectedRouteId,
    fuel,
    getPriorityFuelPlanId,
    clearAlternativeRoutes,
  })

  const { markersKey, handleFilterChange } = useGasStationFilters({
    updateGasStations,
    directionsData,
    finishFuel,
    truckWeight,
    fuel,
  })

  const map = useMap()

  // Фильтруем заправки по выбранному маршруту
  const filteredGasStations = useMemo(() => {
    if (!gasStations || !selectedRouteId) return []
    return gasStations.filter(
      (station) => station.roadSectionId === selectedRouteId,
    )
  }, [gasStations, selectedRouteId])

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

  // Инициализация корзины алгоритмическими заправками
  useEffect(() => {
    if (!gasStations || !selectedRouteId) return

    // Создаем корзину из алгоритмических заправок
    const algorithmStations: { [stationId: string]: { refillLiters: number } } =
      {}

    gasStations.forEach((station) => {
      if (station.isAlgorithm && station.roadSectionId === selectedRouteId) {
        algorithmStations[station.id] = {
          refillLiters: parseFloat(station.refill || '0'),
        }
      }
    })

    // Используем функцию из хука для очистки и установки корзины
    clearCartAndErrors()

    // Устанавливаем алгоритмические заправки
    setCartData(algorithmStations)

    // Проверяем validationError для выбранного маршрута
    if (fuelRouteInfoDtos && selectedRouteId) {
      const selectedRouteInfo = fuelRouteInfoDtos.find(
        (info) => info.roadSectionId === selectedRouteId,
      )

      if (selectedRouteInfo?.validationError) {
        // Создаем массив ошибок с validationError
        const mapErrorMessages: Array<{ stationId: string; message: string }> =
          [
            {
              stationId: 'route-validation',
              message: selectedRouteInfo.validationError.message,
            },
          ]
        setMapErrors(mapErrorMessages)
      } else {
        setMapErrors([])
      }
    } else {
      setMapErrors([])
    }

    // Сбрасываем finalFuelAmount, чтобы снова показывать fuelLeftOver
    setFinalFuelAmount(undefined)
  }, [
    gasStations,
    selectedRouteId,
    fuelRouteInfoDtos,
    clearCartAndErrors,
    setCartData,
    setMapErrors,
    setFinalFuelAmount,
  ])

  return (
    <div ref={mapContainerRef}>
      <MapBase onMapClick={() => setClickedOutside(true)}>
        <MapLoadingOverlay
          isDirectionsPending={isDirectionsPending}
          isGasStationsPending={isGasStationsPending}
          isRoutePending={isRoutePending}
        />

        {/* Отображение ошибок поверх карты */}
        <MapErrorsOverlay errors={mapErrors} />

        <DirectionsRoutes
          origin={origin}
          destination={destination}
          originName={originName}
          destinationName={destinationName}
          data={directionsData}
          directionsMutation={mutateAsync}
          onRouteClick={handleRouteClick}
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
            cart={cart}
            stationErrors={stationErrors}
            isStationInCart={isStationInCart}
            getStationRefillLiters={getStationRefillLiters}
            getStationFuelLeftBeforeRefill={getStationFuelLeftBeforeRefill}
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
          finalFuelAmount={finalFuelAmount}
          directions={directionsData}
          cart={cart}
          gasStations={filteredGasStations}
          fuelRouteInfoDtos={fuelRouteInfoDtos}
          updatedFuelAmount={updatedFuelAmount}
          updatedPriceAmount={updatedPriceAmount}
          routeByIdTotalFuelAmount={routeByIdTotalFuelAmount}
          routeByIdTotalPriceAmount={routeByIdTotalPriceAmount}
        />

        <FullScreenController mapRef={mapContainerRef} />
        <ZoomControl />
      </MapBase>
    </div>
  )
}
