import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { RouteRequestPayload } from './payload/directions.payload'
import { getDirections } from './get-directions'

export const directionsQueries = {
  all: () => ['directions'],
  details: () => [...directionsQueries.all(), 'details'],
  detailsQuery: (payload: RouteRequestPayload) =>
    queryOptions({
      queryKey: [
        ...directionsQueries.details(),
        payload.origin,
        payload.destination,
      ],
      queryFn: () => getDirections(payload),
      placeholderData: keepPreviousData,
    }),
}
