import { queryOptions } from '@tanstack/react-query'
import { getDistance } from './route.service'

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
}
