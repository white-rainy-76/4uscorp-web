import { useEffect } from 'react'
import { useGetRouteMutation } from '@/entities/route/api/get-route.mutation'
import { Coordinate } from '@/shared/types'
import { useGetRouteByIdMutation } from '../../api/get-route-by-id.mutation'

type useRouteProps = {
  truckId: string | undefined
  setOrigin: (value: Coordinate | null) => void
  setDestination: (value: Coordinate | null) => void
  setFinishFuel: (value: number | undefined) => void
  setTruckWeight: (value: number | undefined) => void
  setOriginName: (value: string | undefined) => void
  setDestinationName: (value: string | undefined) => void
  editing: boolean
}

export function useRoute({
  truckId,
  setOrigin,
  setDestination,
  setFinishFuel,
  setTruckWeight,
  setOriginName,
  setDestinationName,
  editing,
}: useRouteProps) {
  const {
    mutateAsync: getRouteById,
    data: routeByIdData,
    isPending: isRouteByIdLoading,
  } = useGetRouteByIdMutation({
    onError: (error) => {
      console.error('Route details fetch error:', error)
    },
    onSuccess: (data) => {
      setOrigin(data.origin)
      setDestination(data.destination)
      setFinishFuel(data.remainingFuel)
      setTruckWeight(data.weight)
      setOriginName(data.originName)
      setDestinationName(data.destinationName)
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
  })
  useEffect(() => {
    if (truckId) {
      getRoute({ truckId })
    }
  }, [truckId, getRoute])

  useEffect(() => {
    if (
      editing &&
      truckId &&
      routeData?.route?.isRoute &&
      routeData?.route?.routeId
    ) {
      getRouteById({ routeId: routeData.route.routeId })
    }
  }, [editing, truckId, routeData, getRouteById])

  return {
    routeData,
    isRouteLoading,
    routeByIdData,
    isRouteByIdLoading,
  }
}
