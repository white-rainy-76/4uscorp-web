import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getTrucks } from './get-trucks'

export const truckQueries = {
  all: () => ['trucks'],

  lists: () => [...truckQueries.all(), 'list'],

  list: () =>
    queryOptions({
      queryKey: [...truckQueries.lists()],
      queryFn: getTrucks,
      placeholderData: keepPreviousData,
    }),
}
