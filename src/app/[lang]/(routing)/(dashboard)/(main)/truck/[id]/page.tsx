'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { InfoCard } from '@/shared/ui/info-card'
import { useDictionary } from '@/shared/lib/hooks'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Coordinate } from '@/shared/types'
import { truckQueries } from '@/entities/truck/api'

import { RouteList } from '@/widgets/refueling-details'
import { TruckRouteInfo } from '@/widgets/truck-route/ui'
import { useHandleDirectionsMutation } from '@/features/directions/api/handle-direction.mutation'
import { MapWithRoute } from '@/widgets/map'
import { useGetGasStationsMutation } from '@/entities/gas-station/api/get-gas-station.mutation'
import { useConnection } from '@/shared/lib/context'
import { useRoute } from '@/entities/route/lib/hooks/use-route'

import {
  Directions,
  RouteRequestPayload,
  Route,
} from '@/features/directions/api'
import { GasStation } from '@/entities/gas-station'
import { useTruckStats } from '@/entities/truck/lib'
import { DriverInfo, DriverInfoSkeleton } from '@/widgets/info/driver-info'
import {
  useRouteFormStore,
  useRouteInfoStore,
  useCartStore,
} from '@/shared/store'
import { convertCoordinateToPair } from '@/shared/lib/coordinates'

export default function TruckInfo() {
  const { dictionary } = useDictionary()
  const params = useParams()
  const router = useRouter()
  const { isConnected } = useConnection()

  const [selectedProviders, setSelectedProviders] = useState<string[]>([])

  const { finishFuel, truckWeight, setRouteForm, clearRouteForm } =
    useRouteFormStore()

  const { selectedSectionId, setRouteInfo, clearRouteInfo } =
    useRouteInfoStore()

  const { clearCart, setFuelPlanId, setCart } = useCartStore()

  const truckId = useMemo(() => {
    const truckIdParam = params?.id
    return typeof truckIdParam === 'string' ? truckIdParam : undefined
  }, [params?.id])

  const {
    data: truckData,
    isLoading: isTruckLoading,
    isError: isTruckError,
  } = useQuery({
    ...truckQueries.truck(truckId!),
    enabled: !!truckId,
  })

  const { stats, isLoading } = useTruckStats(truckId, isConnected)

  const {
    routeData,
    routeByIdData,
    isRouteLoading,
    isRouteByIdLoading,
    refetchRouteData,
  } = useRoute({
    truckId: truckData?.id,
  })

  const {
    mutateAsync: updateGasStations,
    data: gasStationsData,
    isPending: isGasStationsLoading,
  } = useGetGasStationsMutation({
    onSuccess: (data) => {
      // Добавляем алгоритмические заправки в cart только для выбранной секции
      if (
        data.fuelStations &&
        data.fuelStations.length > 0 &&
        selectedSectionId
      ) {
        const algorithmStations: {
          [stationId: string]: { refillLiters: number }
        } = {}

        data.fuelStations.forEach((station) => {
          if (
            station.isAlgorithm &&
            station.roadSectionId === selectedSectionId &&
            station.refill
          ) {
            const refillLiters = parseFloat(station.refill)
            if (!isNaN(refillLiters) && refillLiters > 0) {
              algorithmStations[station.id] = { refillLiters }
            }
          }
        })

        // Устанавливаем корзину с алгоритмическими заправками для выбранной секции
        setCart(algorithmStations)
      }

      // Обновляем данные маршрута по выбранной секции
      if (data.fuelRouteInfoDtos && selectedSectionId) {
        const selectedRouteInfo = data.fuelRouteInfoDtos.find(
          (info) => info.roadSectionId === selectedSectionId,
        )

        if (selectedRouteInfo) {
          setRouteInfo({
            gallons: selectedRouteInfo.totalFuelAmmount,
            totalPrice: selectedRouteInfo.totalPriceAmmount,
            fuelLeft: selectedRouteInfo.finishInfo.remainingFuelLiters,
          })
        }
      }

      // Устанавливаем fuelPlanId из fuelPlans по selectedSectionId
      if (data.fuelPlans && selectedSectionId) {
        const selectedFuelPlan = data.fuelPlans.find(
          (plan) => plan.routeSectionId === selectedSectionId,
        )

        if (selectedFuelPlan?.fuelPlanId) {
          setFuelPlanId(selectedFuelPlan.fuelPlanId)
        }
      }
    },
    onError: (error) => {
      console.error('Update gas stations mutation error:', error)
    },
  })

  const {
    mutateAsync: handleDirectionsMutation,
    data: directionsResponseData,
    isPending: isDirectionsPending,
  } = useHandleDirectionsMutation(
    routeData?.route?.isRoute ? 'edit' : 'create',
    {
      onSuccess: (data: Directions) => {
        if (data?.routeId) {
          // Extract section IDs
          const sectionIdsList = data.route.map(
            (routeDto: Route) => routeDto.routeSectionId,
          )
          const firstRoute = data.route[0]

          // Update route info store
          setRouteInfo({
            routeId: data.routeId,
            sectionIds: sectionIdsList,
            selectedSectionId:
              sectionIdsList.length > 0 ? sectionIdsList[0] : null,
            miles: firstRoute?.routeInfo?.miles,
            driveTime: firstRoute?.routeInfo?.driveTime,
          })

          updateGasStations({
            routeId: data.routeId,
            routeSectionIds: sectionIdsList,
            FinishFuel: finishFuel,
            ...(truckWeight !== undefined &&
              truckWeight !== 0 && { Weight: truckWeight }),
            FuelProviderNameList: selectedProviders,
            CurrentFuel: stats?.fuelPercentage?.toString(),
          })
        } else {
          console.warn(
            'Missing data for updateGasStations after directions fetch.',
          )
        }
      },
      onError: (error: Error) => {
        console.error('Directions mutation error:', error)
      },
    },
  )

  const currentDirectionsData = useMemo<Directions | undefined>(() => {
    if (routeByIdData && !directionsResponseData) {
      return {
        routeId: routeByIdData.routeId,
        route: [
          {
            routeSectionId: routeByIdData.sectionId,

            mapPoints: routeByIdData.mapPoints.map(convertCoordinateToPair),

            routeInfo: routeByIdData.routeInfo,
          },
        ],

        gasStations: routeByIdData.fuelStations,
      }
    }

    return directionsResponseData
  }, [routeByIdData, directionsResponseData])

  const combinedGasStations = useMemo<GasStation[] | undefined>(() => {
    if (gasStationsData?.fuelStations) {
      return gasStationsData.fuelStations
    }

    if (currentDirectionsData?.gasStations) {
      return currentDirectionsData.gasStations
    }

    return
  }, [gasStationsData, currentDirectionsData])

  // Обновляем данные маршрута при смене секции из fuelRouteInfoDtos
  useEffect(() => {
    if (
      gasStationsData?.fuelRouteInfoDtos &&
      selectedSectionId &&
      gasStationsData.fuelStations
    ) {
      // Находим данные для выбранной секции
      const selectedRouteInfo = gasStationsData.fuelRouteInfoDtos.find(
        (info) => info.roadSectionId === selectedSectionId,
      )

      if (selectedRouteInfo) {
        setRouteInfo({
          gallons: selectedRouteInfo.totalFuelAmmount,
          totalPrice: selectedRouteInfo.totalPriceAmmount,
          fuelLeft: selectedRouteInfo.finishInfo.remainingFuelLiters,
        })
      }

      // Обновляем fuelPlanId из fuelPlans
      if (gasStationsData.fuelPlans) {
        const selectedFuelPlan = gasStationsData.fuelPlans.find(
          (plan) => plan.routeSectionId === selectedSectionId,
        )

        if (selectedFuelPlan?.fuelPlanId) {
          setFuelPlanId(selectedFuelPlan.fuelPlanId)
        }
      }

      // Обновляем корзину с алгоритмическими заправками для выбранной секции
      const algorithmStations: {
        [stationId: string]: { refillLiters: number }
      } = {}

      gasStationsData.fuelStations.forEach((station) => {
        if (
          station.isAlgorithm &&
          station.roadSectionId === selectedSectionId &&
          station.refill
        ) {
          const refillLiters = parseFloat(station.refill)
          if (!isNaN(refillLiters) && refillLiters > 0) {
            algorithmStations[station.id] = { refillLiters }
          }
        }
      })

      setCart(algorithmStations)
    }
    // Убрали функции-сеттеры из зависимостей, так как они стабильны в Zustand
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedSectionId,
    // gasStationsData?.fuelRouteInfoDtos,
    // gasStationsData?.fuelPlans,
    // gasStationsData?.fuelStations,
  ])

  useEffect(() => {
    if (!truckId || (isTruckError && !isTruckLoading)) {
      router.replace('/404')
    }
  }, [truckId, isTruckError, isTruckLoading, router])

  // Cleanup stores on unmount
  useEffect(() => {
    return () => {
      clearRouteForm()
      clearRouteInfo()
      clearCart()
    }
    // Убрали функции-сеттеры из зависимостей, так как они стабильны в Zustand
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isLoadingRouteRelated =
    isTruckLoading ||
    isRouteLoading ||
    isRouteByIdLoading ||
    isDirectionsPending ||
    isGasStationsLoading

  const handleSubmitRoute = useCallback(
    (formPayload: {
      origin: Coordinate
      destination: Coordinate
      originName: string
      destinationName: string
      truckWeight?: number
      finishFuel?: number
    }) => {
      if (!truckData) {
        console.error('Truck data is not available for route submission.')
        return
      }

      // Update store with form data
      setRouteForm({
        origin: formPayload.origin,
        destination: formPayload.destination,
        originName: formPayload.originName,
        destinationName: formPayload.destinationName,
        truckWeight: formPayload.truckWeight,
        finishFuel: formPayload.finishFuel,
      })

      const payload: RouteRequestPayload = {
        origin: formPayload.origin,
        destination: formPayload.destination,
        TruckId: truckData.id,
        originName: formPayload.originName,
        destinationName: formPayload.destinationName,
      }

      handleDirectionsMutation(payload)
    },
    [truckData, setRouteForm, handleDirectionsMutation],
  )

  return (
    truckId && (
      <>
        <InfoCard title={dictionary.home.headings.driver_info}>
          {isTruckLoading ? (
            <DriverInfoSkeleton />
          ) : (
            truckData && (
              <DriverInfo
                truck={truckData}
                truckInfo={stats}
                isLoadingFuel={false}
              />
            )
          )}
        </InfoCard>

        {truckData && (
          <>
            <InfoCard title={dictionary.home.headings.driver_info}>
              {routeData && (
                <TruckRouteInfo
                  truck={truckData}
                  currentFuelPercent={
                    stats?.fuelPercentage
                      ? parseFloat(stats.fuelPercentage)
                      : undefined
                  }
                  onSubmitForm={handleSubmitRoute}
                  isRoute={routeData.route.isRoute}
                  routeId={
                    routeData.route.routeId
                      ? routeData.route.routeId
                      : currentDirectionsData?.routeId
                  }
                  fuelPlans={gasStationsData?.fuelPlans}
                  fuelPlanId={routeByIdData?.fuelPlanId ?? undefined}
                  onRouteCompleted={refetchRouteData}
                  routeByIdData={routeByIdData}
                />
              )}
            </InfoCard>
            <MapWithRoute
              directionsData={currentDirectionsData}
              gasStations={combinedGasStations}
              remainingFuelLiters={
                gasStationsData?.fuelRouteInfoDtos?.[0]?.finishInfo
                  ?.remainingFuelLiters
                  ? gasStationsData?.fuelRouteInfoDtos[0].finishInfo
                      .remainingFuelLiters
                  : routeByIdData?.remainingFuel
              }
              isDirectionsPending={isLoadingRouteRelated}
              isGasStationsPending={isGasStationsLoading}
              isRoutePending={isLoadingRouteRelated}
              mutateAsync={handleDirectionsMutation}
              truck={truckData}
              updateGasStations={updateGasStations}
              fuelRouteInfoDtos={gasStationsData?.fuelRouteInfoDtos}
              selectedProviders={selectedProviders}
              setSelectedProviders={setSelectedProviders}
              fuel={stats?.fuelPercentage}
              routeData={routeData}
              fuelPlans={gasStationsData?.fuelPlans}
              routeByIdData={routeByIdData}
            />
          </>
        )}
        {combinedGasStations && (
          <InfoCard title={dictionary.home.headings.details_info}>
            <RouteList
              gasStations={combinedGasStations}
              routeId={
                routeData?.route?.routeId
                  ? routeData.route.routeId
                  : currentDirectionsData?.routeId
              }
            />
          </InfoCard>
        )}
      </>
    )
  )
}
