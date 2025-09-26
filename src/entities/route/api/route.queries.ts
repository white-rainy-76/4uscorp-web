import { queryOptions } from '@tanstack/react-query'
import { getDistance, getFuelStationArrived } from './route.service'

import { GetDistancePayload } from '../model'

export const ROUTES_ROOT_QUERY_KEY = ['routes']

export const routeQueries = {
  all: () => [...ROUTES_ROOT_QUERY_KEY],

  distance: (payload: GetDistancePayload) =>
    queryOptions({
      queryKey: [...ROUTES_ROOT_QUERY_KEY, 'distance', payload],
      queryFn: async ({ signal }) => {
        const data = await getDistance(payload, signal)
        return data
      },
    }),

  fuelStationArrived: (routeId: string) =>
    queryOptions({
      queryKey: [...ROUTES_ROOT_QUERY_KEY, 'fuel-station-arrived', routeId],
      queryFn: async ({ signal }) => {
        const data = await getFuelStationArrived(routeId, { signal })
        return data
      },
      refetchInterval: 2000, // Обновляем каждые 2 секунды
      refetchIntervalInBackground: true,
    }),
}
