import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import {
  PointRequestPayload,
  RouteRequestPayload,
} from './payload/directions.payload'
import { getDirections } from './get-directions'
import { getNearestDropPoint } from './get-nearest-drop-point'

export const directionsQueries = {
  all: () => ['directions'],
  details: () => [...directionsQueries.all(), 'details'],
  detailsQuery: (payload: RouteRequestPayload) =>
    queryOptions({
      queryKey: [
        ...directionsQueries.details(),
        payload.origin,
        payload.destination,
        payload.ViaPoints,
      ],
      queryFn: () => getDirections(payload),
      placeholderData: keepPreviousData,
    }),
  dropPoint: () => [...directionsQueries.all(), 'drop-point'],
  dropPointQuery: (payload: PointRequestPayload) =>
    queryOptions({
      queryKey: [
        ...directionsQueries.dropPoint(),
        payload.latitude,
        payload.longitude,
      ],
      queryFn: () => getNearestDropPoint(payload),
    }),
}
