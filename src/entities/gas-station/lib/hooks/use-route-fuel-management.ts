'use client'

import { useEffect } from 'react'
import { useHandleDirectionsMutation } from '@/features/directions/api/handle-direction.mutation'
import { Directions, Route } from '@/features/directions/api'
import { useGetGasStationsMutation } from '@/entities/gas-station/api/get-gas-station.mutation'
import { RouteData } from '@/entities/route'
import {
  useCartStore,
  useRouteFormStore,
  useRouteInfoStore,
  useErrorsStore,
} from '@/shared/store'

type UseRouteFuelManagementParams = {
  routeData?: RouteData
}

export function useRouteFuelManagement({
  routeData,
}: UseRouteFuelManagementParams) {
  const { finishFuel, truckWeight } = useRouteFormStore()
  const { selectedSectionId, setRouteInfo } = useRouteInfoStore()
  const { setFuelPlanId, setCart, selectedProviders } = useCartStore()
  const { setGlobalErrors } = useErrorsStore()

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
          [stationId: string]: {
            refillLiters: number
            fuelBeforeRefill?: number
          }
        } = {}

        data.fuelStations.forEach((station) => {
          if (
            station.isAlgorithm &&
            station.roadSectionId === selectedSectionId &&
            station.refill
          ) {
            const refillLiters = parseFloat(station.refill)
            if (!isNaN(refillLiters) && refillLiters > 0) {
              algorithmStations[station.id] = {
                refillLiters,
                ...(station.fuelLeftBeforeRefill !== null &&
                  station.fuelLeftBeforeRefill !== undefined && {
                    fuelBeforeRefill: station.fuelLeftBeforeRefill,
                  }),
              }
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

          // Устанавливаем глобальные ошибки из validationError выбранной секции
          if (selectedRouteInfo.validationError) {
            setGlobalErrors([selectedRouteInfo.validationError.message])
          } else {
            setGlobalErrors([])
          }
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

        // Устанавливаем глобальные ошибки из validationError выбранной секции
        if (selectedRouteInfo.validationError) {
          setGlobalErrors([selectedRouteInfo.validationError.message])
        } else {
          setGlobalErrors([])
        }
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
        [stationId: string]: { refillLiters: number; fuelBeforeRefill?: number }
      } = {}

      gasStationsData.fuelStations.forEach((station) => {
        if (
          station.isAlgorithm &&
          station.roadSectionId === selectedSectionId &&
          station.refill
        ) {
          const refillLiters = parseFloat(station.refill)
          if (!isNaN(refillLiters) && refillLiters > 0) {
            algorithmStations[station.id] = {
              refillLiters,
              ...(station.fuelLeftBeforeRefill !== null &&
                station.fuelLeftBeforeRefill !== undefined && {
                  fuelBeforeRefill: station.fuelLeftBeforeRefill,
                }),
            }
          }
        }
      })

      setCart(algorithmStations)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSectionId])

  return {
    updateGasStations,
    gasStationsData,
    isGasStationsLoading,
    handleDirectionsMutation,
    directionsResponseData,
    isDirectionsPending,
  }
}
