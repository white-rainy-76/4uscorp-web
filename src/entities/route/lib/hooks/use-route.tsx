import { useEffect } from 'react'
import { useGetRouteMutation } from '@/entities/route/api/get-route.mutation'
import { Coordinate } from '@/shared/types'
import { useGetRouteByIdMutation } from '../../api/get-route-by-id.mutation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type useRouteProps = {
  truckId: string | undefined
  setOrigin: (value: Coordinate | null) => void
  setDestination: (value: Coordinate | null) => void
  setFinishFuel: (value: number | undefined) => void
  setTruckWeight: (value: number | undefined) => void
  setOriginName: (value: string | undefined) => void
  setDestinationName: (value: string | undefined) => void
}

export function useRoute({
  truckId,
  setOrigin,
  setDestination,
  setFinishFuel,
  setTruckWeight,
  setOriginName,
  setDestinationName,
}: useRouteProps) {
  const queryClient = useQueryClient()
  const {
    mutateAsync: getRouteById,
    data: routeByIdData,
    isPending: isRouteByIdLoading,
  } = useGetRouteByIdMutation({
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
      // Обновляем состояние данными о маршруте
      setOrigin(data.origin)
      setDestination(data.destination)
      setFinishFuel(data.remainingFuel)
      setTruckWeight(data.weight)

      // Если маршрут есть - используем originName/destinationName
      // Если маршрута нет - используем formattedLocation
      if (data.route.isRoute) {
        setOriginName(data.originName || undefined)
        setDestinationName(data.destinationName || undefined)
      } else {
        // Когда маршрута нет, показываем formattedLocation как originName
        setOriginName(data.route.formattedLocation || undefined)
        setDestinationName(undefined)
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

  // Функция для перезапроса данных маршрута
  const refetchRouteData = async () => {
    if (truckId) {
      console.log('Refetching route data for truck:', truckId)
      toast('Updating route data...', {
        description: 'Fetching latest route information',
      })
      await getRoute({ truckId })
    }
  }

  // Отслеживаем инвалидацию запросов и перезапрашиваем данные
  useEffect(() => {
    const handleInvalidation = () => {
      // Небольшая задержка, чтобы дать время серверу обновиться
      setTimeout(() => {
        refetchRouteData()
      }, 500)
    }

    // Слушаем изменения в кеше
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === 'updated' && event.query.queryKey.includes('routes')) {
        handleInvalidation()
      }
    })

    return unsubscribe
  }, [truckId, queryClient, getRoute])

  return {
    routeData,
    isRouteLoading,
    routeByIdData,
    isRouteByIdLoading,
    // Возвращаем координаты напрямую из API
    // Если маршрута нет - используем currentLocation как origin
    apiOrigin:
      routeData?.origin ||
      (routeData?.route?.currentLocation
        ? {
            latitude: routeData.route.currentLocation.latitude,
            longitude: routeData.route.currentLocation.longitude,
          }
        : null),
    apiDestination: routeData?.destination,
    refetchRouteData,
  }
}
