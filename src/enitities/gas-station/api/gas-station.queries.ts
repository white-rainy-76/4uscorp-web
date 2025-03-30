import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getGasStations } from './get-gas-stations'
import { GasStationQuery } from './query/gas-station.query'

export const gasStationQueries = {
  all: () => ['gas-station'],

  lists: () => [...gasStationQueries.all(), 'list'],
  list: (query: GasStationQuery) =>
    queryOptions({
      queryKey: [...gasStationQueries.lists(), query.origin, query.destination],
      queryFn: () => getGasStations(query),
      placeholderData: keepPreviousData,
    }),
}
