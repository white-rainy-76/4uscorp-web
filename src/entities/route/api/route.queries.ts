import { queryOptions } from '@tanstack/react-query'
import { getDistance, getSavedRoutes, getSavedRouteById } from './route.service'

import {
  GetDistancePayload,
  GetSavedRoutesPayload,
  GetSavedRouteByIdPayload,
} from '../model'

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

  savedRoutes: (payload: GetSavedRoutesPayload) =>
    queryOptions({
      queryKey: [...ROUTES_ROOT_QUERY_KEY, 'saved-routes', payload],
      queryFn: async ({ signal }) => {
        const data = await getSavedRoutes(payload, signal)
        return data
      },
    }),

  savedRouteById: (payload: GetSavedRouteByIdPayload) =>
    queryOptions({
      queryKey: [...ROUTES_ROOT_QUERY_KEY, 'saved-route-by-id', payload],
      queryFn: async ({ signal }) => {
        const data = await getSavedRouteById(payload, signal)
        return data
      },
    }),
}
