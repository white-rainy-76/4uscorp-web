import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getAllTrucks, getTruckById } from './truck.service'
import { mapTrucks } from './mapper/map-trucks'
import { mapTruck } from './mapper/map-truck'

export const TRUCKS_ROOT_QUERY_KEY = ['trucks']

export const truckQueries = {
  all: () => [...TRUCKS_ROOT_QUERY_KEY],

  lists: (filter?: { name?: string }) => [
    ...truckQueries.all(),
    'list',
    filter ?? {},
  ],

  list: () =>
    queryOptions({
      queryKey: truckQueries.lists(),
      queryFn: async ({ signal }) => {
        const { data } = await getAllTrucks({ signal })
        const trucks = mapTrucks(data)
        return trucks
      },
      placeholderData: keepPreviousData,
      // initialData: () =>
      //   queryClient.getQueryData<Truck[]>(truckQueries.lists(filter)),
      // initialDataUpdatedAt: () =>
      //   queryClient.getQueryState(truckQueries.lists(filter))?.dataUpdatedAt,
    }),

  truck: (id: string) =>
    queryOptions({
      queryKey: [...TRUCKS_ROOT_QUERY_KEY, 'truck', id],
      queryFn: async ({ signal }) => {
        const { data } = await getTruckById(id, { signal })
        const truck = mapTruck(data)
        return truck
      },
      // initialData: () =>
      //   queryClient.getQueryData<Truck>([...TRUCKS_ROOT_QUERY_KEY, 'truck', id]),
      // initialDataUpdatedAt: () =>
      //   queryClient.getQueryState([...TRUCKS_ROOT_QUERY_KEY, 'truck', id])?.dataUpdatedAt,
    }),
}
