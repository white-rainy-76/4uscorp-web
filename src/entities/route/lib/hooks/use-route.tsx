import { useEffect } from 'react'
import { useGetRouteMutation } from '@/entities/route/api/get-route.mutation'
import { useGetRouteByIdMutation } from '../../api/get-route-by-id.mutation'
import {
  useRouteFormStore,
  useRouteInfoStore,
  useCartStore,
} from '@/shared/store'

type useRouteProps = {
  truckId: string | undefined
}

export function useRoute({ truckId }: useRouteProps) {
  const { setRouteForm } = useRouteFormStore()
  const { setRouteInfo } = useRouteInfoStore()
  const { addToCart, setFuelPlanId } = useCartStore()

  const {
    mutateAsync: getRouteById,
    data: routeByIdData,
    isPending: isRouteByIdLoading,
  } = useGetRouteByIdMutation({
    onSuccess: (data) => {
      setRouteForm({
        origin: data.origin,
        destination: data.destination,
        originName: data.originName,
        destinationName: data.destinationName,
        truckWeight: data.weight,
        finishFuel: data.remainingFuel,
      })

      // Update route info store
      setRouteInfo({
        routeId: data.routeId,
        selectedSectionId: data.sectionId || null,
        sectionIds: data.sectionId ? [data.sectionId] : [],
        miles: data.routeInfo.miles,
        driveTime: data.routeInfo.driveTime,
        gallons: data.totalFuelAmmount,
        fuelLeft: data.remainingFuel,
        totalPrice: data.totalPriceAmmount,
      })

      // Set fuelPlanId in cart store
      if (data.fuelPlanId) {
        setFuelPlanId(data.fuelPlanId)
      }

      // Add gas stations with isAlgorithm = true to cart
      if (data.fuelStations && data.fuelStations.length > 0) {
        data.fuelStations.forEach((station) => {
          if (station.isAlgorithm && station.refill) {
            const refillLiters = parseFloat(station.refill)
            if (!isNaN(refillLiters) && refillLiters > 0) {
              addToCart(
                station.id,
                refillLiters,
                station.fuelLeftBeforeRefill ?? undefined,
              )
            }
          }
        })
      }
    },
    onError: (error) => {
      console.error('Route details fetch error:', error)
    },
  })

  const {
    mutateAsync: getRoute,
    data: routeData,
    isPending: isRouteLoading,
  } = useGetRouteMutation({
    onError: (error) => {
      console.error('Route mutation error:', error)
    },
    onSuccess: (data) => {
      if (data.route.isRoute === false) {
        const originCoordinate =
          data.origin ||
          (data.route.currentLocation
            ? {
                latitude: data.route.currentLocation.latitude,
                longitude: data.route.currentLocation.longitude,
              }
            : null)

        setRouteForm({
          origin: originCoordinate,
          originName: data.route.formattedLocation,
        })
      }
    },
  })

  // Получаем информацию о маршруте при загрузке страницы
  useEffect(() => {
    if (truckId) {
      getRoute({ truckId })
    }
  }, [truckId, getRoute])

  // Автоматически получаем детали маршрута, если маршрут существует
  useEffect(() => {
    if (truckId && routeData?.route?.isRoute && routeData?.route?.routeId) {
      getRouteById({ routeId: routeData.route.routeId })
    }
  }, [truckId, routeData, getRouteById])

  // Функция для перезапроса данных маршрута (только при завершении маршрута)
  const refetchRouteData = async () => {
    if (truckId) {
      await getRoute({ truckId })
    }
  }

  return {
    routeData,
    isRouteLoading,
    routeByIdData,
    isRouteByIdLoading,
    refetchRouteData,
  }
}
