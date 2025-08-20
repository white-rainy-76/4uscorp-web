import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getAllTrucks, getTruckById } from './truck.service'
import { getAllTruckGroups, getTruckGroupById } from './truck-group.service'
import { getTruckUnits } from './truck-unit.service'
import { mapTruck, mapTrucks } from './mapper/truck.mapper'
import { mapTruckGroups } from './mapper/truck-group.mapper'

export const TRUCKS_ROOT_QUERY_KEY = ['trucks']
export const TRUCK_GROUPS_ROOT_QUERY_KEY = ['truck-groups']
export const TRUCK_UNITS_ROOT_QUERY_KEY = ['truck-units']

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

export const truckGroupQueries = {
  all: () => [...TRUCK_GROUPS_ROOT_QUERY_KEY],

  lists: () => [...truckGroupQueries.all(), 'list'],

  list: () =>
    queryOptions({
      queryKey: truckGroupQueries.lists(),
      queryFn: async ({ signal }) => {
        const { data } = await getAllTruckGroups({ signal })
        const truckGroups = mapTruckGroups(data)
        return truckGroups
      },
      placeholderData: keepPreviousData,
    }),

  truckGroup: (id: string) =>
    queryOptions({
      queryKey: [...TRUCK_GROUPS_ROOT_QUERY_KEY, 'truckGroup', id],
      queryFn: async ({ signal }) => {
        const { data } = await getTruckGroupById(id, { signal })
        return data
      },
      placeholderData: keepPreviousData,
    }),
}

export const truckUnitQueries = {
  all: () => [...TRUCK_UNITS_ROOT_QUERY_KEY],

  lists: () => [...truckUnitQueries.all(), 'list'],

  list: () =>
    queryOptions({
      queryKey: truckUnitQueries.lists(),
      queryFn: async ({ signal }) => {
        const { data } = await getTruckUnits({ signal })
        return data
      },
      placeholderData: keepPreviousData,
    }),
}
