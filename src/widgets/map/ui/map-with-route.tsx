'use client'

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { MapBase, Polyline, Spinner } from '@/shared/ui'
import { ClusteredGasStationMarkers } from '@/entities/gas-station/ui/clustered-gas-station-markers'
import { FullScreenController } from './controlers/fullscreen'
import { ZoomControl } from './controlers/zoom'
import { Coordinate } from '@/shared/types'
import { Directions, RouteRequestPayload } from '@/features/directions/api'
import { DirectionsRoutes } from '@/features/directions'
import {
  useChangeFuelPlanMutation,
  FuelPlanOperation,
} from '@/features/directions/api'

import { Truck } from '@/entities/truck'
import { RoutePanelOnMap } from './route-panel'
import { useMap } from '@vis.gl/react-google-maps'
import { GasStation, GetGasStationsResponse } from '@/entities/gas-station'
import { GetGasStationsPayload } from '@/entities/gas-station/model/types/gas-station.payload'
import { RouteData } from '@/entities/route'
import { TrackTruck } from '@/features/truck/track-truck'

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
    variables: GetGasStationsPayload,
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

  // Состояние корзины - хранит ID заправок и их refillLiters
  const [cart, setCart] = useState<{
    [stationId: string]: { refillLiters: number }
  }>({})

  // Состояние ошибок - хранит сообщения об ошибках для каждой заправки
  const [stationErrors, setStationErrors] = useState<{
    [stationId: string]: string
  }>({})

  const map = useMap()

  // Новая мутация для изменения топливного плана
  const { mutateAsync: changeFuelPlan } = useChangeFuelPlanMutation({
    onSuccess: (data: any) => {
      if (!data.isValid && data.stepResults) {
        // Обрабатываем ошибки и создаем объект ошибок для маркеров
        const errors: { [stationId: string]: string } = {}
        data.stepResults.forEach((result: any) => {
          if (!result.isValid && result.notes) {
            errors[result.stationId] = result.notes
          }
        })
        setStationErrors(errors)
      } else {
        // Очищаем ошибки если все валидно
        setStationErrors({})
      }
    },
    onError: (error: any) => {
      console.error('Fuel plan change error:', error)
    },
  })

  // Фильтруем заправки по выбранному маршруту
  const filteredGasStations = useMemo(() => {
    if (!gasStations || !selectedRouteId) return []
    return gasStations.filter(
      (station) => station.roadSectionId === selectedRouteId,
    )
  }, [gasStations, selectedRouteId])

  // Проверяем, находится ли заправка в корзине
  const isStationInCart = useCallback(
    (stationId: string) => {
      return stationId in cart
    },
    [cart],
  )

  // Получаем refillLiters для заправки (из корзины или из исходных данных)
  const getStationRefillLiters = useCallback(
    (station: GasStation) => {
      if (isStationInCart(station.id)) {
        return cart[station.id].refillLiters
      }
      return parseFloat(station.refill || '0')
    },
    [cart, isStationInCart],
  )

  // Добавление заправки в корзину
  const handleAddToCart = async (station: GasStation, refillLiters: number) => {
    try {
      // Сначала вызываем API
      await changeFuelPlan({
        routeSectionId: selectedRouteId || '',
        currentFuelPercent: parseFloat(fuel || '0'),
        fuelStationChange: {
          fuelStationId: station.id,
          newRefill: refillLiters,
        },
        operation: FuelPlanOperation.Add,
      })

      // Если API успешен, добавляем в корзину
      setCart((prev) => ({
        ...prev,
        [station.id]: { refillLiters },
      }))
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  // Удаление заправки из корзины
  const handleRemoveFromCart = async (stationId: string) => {
    try {
      // Сначала вызываем API
      await changeFuelPlan({
        routeSectionId: selectedRouteId || '',
        currentFuelPercent: parseFloat(fuel || '0'),
        fuelStationChange: {
          fuelStationId: stationId,
          newRefill: null,
        },
        operation: FuelPlanOperation.Remove,
      })

      // Если API успешен, удаляем из корзины
      setCart((prev) => {
        const newCart = { ...prev }
        delete newCart[stationId]
        return newCart
      })
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    }
  }

  // Обновление refillLiters для заправки в корзине
  const handleUpdateRefillLiters = async (
    stationId: string,
    liters: number,
  ) => {
    try {
      // Сначала вызываем API
      await changeFuelPlan({
        routeSectionId: selectedRouteId || '',
        currentFuelPercent: parseFloat(fuel || '0'),
        fuelStationChange: {
          fuelStationId: stationId,
          newRefill: liters,
        },
        operation: FuelPlanOperation.Update,
      })

      // Если API успешен, обновляем корзину
      setCart((prev) => ({
        ...prev,
        [stationId]: { refillLiters: liters },
      }))
    } catch (error) {
      console.error('Failed to update refill liters:', error)
    }
  }

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

    setCart(algorithmStations)
    setStationErrors({})
  }, [gasStations, selectedRouteId])

  // Очистка корзины и ошибок при изменении фильтров
  const handleFilterChange = async (providers: string[]) => {
    setSelectedProviders(providers)
    setMarkersKey((prevKey) => prevKey + 1)
    // Очищаем корзину и ошибки при изменении фильтров
    setCart({})
    setStationErrors({})

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
            stationErrors={stationErrors}
            isStationInCart={isStationInCart}
            getStationRefillLiters={getStationRefillLiters}
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
          gasStations={filteredGasStations}
        />

        <FullScreenController mapRef={mapContainerRef} />
        <ZoomControl />
      </MapBase>
    </div>
  )
}
