import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { mapDriver, mapDrivers } from './mapper/driver.mapper'
import {
  getAllDrivers,
  getDriverById,
  getDriversByCompanyId,
} from './driver.service'

export const DRIVERS_ROOT_QUERY_KEY = ['drivers']

export const driverQueries = {
  all: () => [...DRIVERS_ROOT_QUERY_KEY],

  lists: (filter?: { name?: string }) => [
    ...driverQueries.all(),
    'list',
    filter ?? {},
  ],

  list: () =>
    queryOptions({
      queryKey: driverQueries.lists(),
      queryFn: async ({ signal }) => {
        const { data } = await getAllDrivers({ signal })
        const drivers = mapDrivers(data)
        return drivers
      },
      placeholderData: keepPreviousData,
    }),

  driver: (id: string) =>
    queryOptions({
      queryKey: [...DRIVERS_ROOT_QUERY_KEY, 'driver', id],
      queryFn: async ({ signal }) => {
        const { data } = await getDriverById(id, { signal })
        const driver = mapDriver(data)
        return driver
      },
    }),

  listByCompany: (companyId: string) =>
    queryOptions({
      queryKey: [...DRIVERS_ROOT_QUERY_KEY, 'listByCompany', companyId],
      queryFn: async ({ signal }) => {
        const { data } = await getDriversByCompanyId(companyId, { signal })
        const drivers = mapDrivers(data)
        return drivers
      },
      placeholderData: keepPreviousData,
    }),
}
