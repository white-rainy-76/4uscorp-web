import { queryOptions } from '@tanstack/react-query'
import { getFuelStationArrived } from './gas-station.service'

export const GAS_STATIONS_ROOT_QUERY_KEY = ['gas-stations']

export const gasStationQueries = {
  all: () => [...GAS_STATIONS_ROOT_QUERY_KEY],

  fuelStationArrived: (routeId: string) =>
    queryOptions({
      queryKey: [
        ...GAS_STATIONS_ROOT_QUERY_KEY,
        'fuel-station-arrived',
        routeId,
      ],
      queryFn: async ({ signal }) => {
        const data = await getFuelStationArrived(routeId, { signal })
        return data
      },
      refetchInterval: 2000, // Обновляем каждые 2 секунды
      refetchIntervalInBackground: true,
    }),
}
