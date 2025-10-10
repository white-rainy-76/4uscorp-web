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
  FuelPlanChangeResponse,
} from '@/features/directions/api'

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
import { useDictionary } from '@/shared/lib/hooks'

// Компонент для отображения ошибок поверх карты
const MapErrorsOverlay: React.FC<{
  errors: Array<{ stationId: string; message: string }>
}> = ({ errors }) => {
  const { dictionary } = useDictionary()
  if (errors.length === 0) return null

  // Разделяем ошибки на общие, связанные с конкретными заправками и ошибки валидации маршрута
  const generalErrors = errors.filter((error) => error.stationId === 'general')
  const stationErrors = errors.filter(
    (error) =>
      error.stationId !== 'general' && error.stationId !== 'route-validation',
  )
  const routeValidationErrors = errors.filter(
    (error) => error.stationId === 'route-validation',
  )

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] pointer-events-none">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg max-w-md">
        <div className="flex items-center">
          <div className="text-red-500 mr-2">⚠️</div>
          <div>
            <h4 className="font-bold text-sm mb-2">
              {dictionary.home.errors.error}:
            </h4>
            <div className="space-y-1">
              {/* Ошибки валидации маршрута */}
              {routeValidationErrors.map((error, index) => (
                <div key={`route-validation-${index}`} className="text-xs">
                  <span className="font-semibold text-red-800">
                    {dictionary.home.errors.error}:
                  </span>
                  <span className="ml-2">{error.message}</span>
                </div>
              ))}
              {/* Общие ошибки */}
              {generalErrors.map((error, index) => (
                <div key={`general-${index}`} className="text-xs">
                  <span className="font-semibold text-red-800">
                    {dictionary.home.errors.error}:
                  </span>
                  <span className="ml-2">{error.message}</span>
                </div>
              ))}
              {/* Ошибки конкретных заправок */}
              {stationErrors.map((error, index) => (
                <div key={`station-${index}`} className="text-xs">
                  <span className="font-semibold">
                    {dictionary.home.route_panel.address}{' '}
                    {error.stationId.slice(0, 8)}...
                  </span>
                  <span className="ml-2">{error.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  const [markersKey, setMarkersKey] = useState(0)

  // Состояние корзины - хранит ID заправок и их refillLiters
  const [cart, setCart] = useState<{
    [stationId: string]: { refillLiters: number }
  }>({})

  // Состояние ошибок - хранит сообщения об ошибках для каждой заправки
  const [stationErrors, setStationErrors] = useState<{
    [stationId: string]: string
  }>({})

  // Состояние изменений - хранит новые значения fuelLeftBeforeRefill для каждой заправки
  const [stationChanges, setStationChanges] = useState<{
    [stationId: string]: number
  }>({})

  // Состояние ошибок для отображения поверх карты
  const [mapErrors, setMapErrors] = useState<
    Array<{ stationId: string; message: string }>
  >([])

  // Состояние finalFuelAmount - хранит количество топлива после заправки
  const [finalFuelAmount, setFinalFuelAmount] = useState<number | undefined>(
    undefined,
  )

  // Состояние для хранения новых значений totalFuelAmmount и totalPriceAmmount
  const [updatedFuelAmount, setUpdatedFuelAmount] = useState<
    number | undefined
  >(undefined)
  const [updatedPriceAmount, setUpdatedPriceAmount] = useState<
    number | undefined
  >(undefined)

  const map = useMap()
  const [clearAlternativeRoutes, setClearAlternativeRoutes] = useState<
    (() => void) | null
  >(null)

  // Функция для получения приоритетного fuelPlanId для changeFuelPlan
  const getPriorityFuelPlanId = (): string | undefined => {
    // Приоритет: fuelPlans из get-gas-stations (всегда приоритетнее) > fuelPlanId из get-fuel-route-byId > переданный fuelPlanId
    if (fuelPlans && fuelPlans.length > 0 && selectedRouteId) {
      // Фильтруем fuelPlans по selectedRouteId (выбранной ветке)
      const filteredFuelPlans = fuelPlans.filter(
        (plan) => plan.routeSectionId === selectedRouteId,
      )
      if (filteredFuelPlans.length > 0) {
        return filteredFuelPlans[0].fuelPlanId || undefined
      }
    }

    if (routeByIdData?.fuelPlanId && selectedRouteId) {
      return routeByIdData.fuelPlanId
    }

    // Используем переданный fuelPlanId если он есть
    if (fuelPlanId && selectedRouteId) {
      return fuelPlanId
    }

    return undefined
  }

  // Новая мутация для изменения топливного плана
  const { mutateAsync: changeFuelPlan } = useChangeFuelPlanMutation({
    onSuccess: (data: FuelPlanChangeResponse) => {
      console.log('Fuel plan change response:', data)

      if (!data.isValid && data.stepResults) {
        // Обрабатываем ошибки и создаем объект ошибок для маркеров
        const errors: { [stationId: string]: string } = {}
        const mapErrorMessages: Array<{ stationId: string; message: string }> =
          []

        data.stepResults.forEach((result) => {
          if (!result.isValid && result.notes) {
            // Игнорируем ошибки с stationId равным "00000000-0000-0000-0000-000000000000"
            if (result.stationId !== '00000000-0000-0000-0000-000000000000') {
              errors[result.stationId] = result.notes
              mapErrorMessages.push({
                stationId: result.stationId,
                message: result.notes,
              })
            } else {
              // Для общих ошибок добавляем их в mapErrors без привязки к конкретной заправке
              mapErrorMessages.push({
                stationId: 'general',
                message: result.notes,
              })
            }
          }
        })

        setStationErrors(errors)
        setMapErrors(mapErrorMessages)
      } else {
        // Очищаем ошибки если все валидно
        setStationErrors({})
        setMapErrors([])
      }

      // Обрабатываем изменения для обновления fuelLeftBeforeRefill
      if (data.changes && data.changes.length > 0) {
        console.log('Processing changes:', data.changes)
        const changes: { [stationId: string]: number } = {}

        data.changes.forEach((change) => {
          if (change.fuelStationId !== '00000000-0000-0000-0000-000000000000') {
            changes[change.fuelStationId] = change.newCurrentFuel
            console.log(
              `Updated fuel for station ${change.fuelStationId}: ${change.newCurrentFuel}`,
            )
          }
        })

        setStationChanges(changes)
      }

      // Сохраняем finalFuelAmount из ответа API
      if (data.finalFuelAmount !== undefined) {
        setFinalFuelAmount(data.finalFuelAmount)
      }

      // Сохраняем новые значения totalFuelAmmount и totalPriceAmmount из ответа API
      if (data.totalFuelAmmount !== undefined) {
        setUpdatedFuelAmount(data.totalFuelAmmount)
      }
      if (data.totalPriceAmmount !== undefined) {
        setUpdatedPriceAmount(data.totalPriceAmmount)
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

  // Получаем обновленный fuelLeftBeforeRefill для заправки (из изменений или из исходных данных)
  const getStationFuelLeftBeforeRefill = useCallback(
    (station: GasStation) => {
      if (stationChanges[station.id] !== undefined) {
        return stationChanges[station.id]
      }
      return station.fuelLeftBeforeRefill || 0
    },
    [stationChanges],
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
        fuelPlanId: getPriorityFuelPlanId(),
      })

      // Если API успешен, добавляем в корзину
      setCart((prev) => ({
        ...prev,
        [station.id]: { refillLiters },
      }))

      // Очищаем альтернативные маршруты
      clearAlternativeRoutes?.()
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
        fuelPlanId: getPriorityFuelPlanId(),
      })

      // Если API успешен, удаляем из корзины
      setCart((prev) => {
        const newCart = { ...prev }
        delete newCart[stationId]
        return newCart
      })

      // Очищаем альтернативные маршруты
      clearAlternativeRoutes?.()
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
        fuelPlanId: getPriorityFuelPlanId(),
      })

      // Если API успешен, обновляем корзину
      setCart((prev) => ({
        ...prev,
        [stationId]: { refillLiters: liters },
      }))

      // Очищаем альтернативные маршруты
      clearAlternativeRoutes?.()
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
    setStationChanges({})

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
  }, [gasStations, selectedRouteId, fuelRouteInfoDtos])

  // Очистка корзины и ошибок при изменении фильтров
  const handleFilterChange = async (providers: string[]) => {
    setSelectedProviders(providers)
    setMarkersKey((prevKey) => prevKey + 1)
    // Очищаем корзину и ошибки при изменении фильтров
    setCart({})
    setStationErrors({})
    setStationChanges({})
    setMapErrors([])
    // Сбрасываем finalFuelAmount, чтобы снова показывать fuelLeftOver
    setFinalFuelAmount(undefined)

    if (!directionsData?.routeId || !directionsData.route) return

    await updateGasStations({
      routeId: directionsData.routeId,
      routeSectionIds: directionsData.route.map((r) => r.routeSectionId),
      FinishFuel: finishFuel,
      ...(truckWeight !== undefined &&
        truckWeight !== 0 && { Weight: truckWeight }),
      FuelProviderNameList: providers,
      CurrentFuel: fuel?.toString(),
      TankCapacityG: truck?.tankCapacityG,
    })
  }

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
        {(isDirectionsPending || isGasStationsPending || isRoutePending) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-[101] pointer-events-auto">
            <Spinner size="lg" />
          </div>
        )}

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
