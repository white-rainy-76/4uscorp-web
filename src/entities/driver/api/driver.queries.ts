import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getDriver } from './get-driver'
import { DriverQuery } from './query/driver.query'

export const driverQueries = {
  all: () => ['driver'],

  lists: () => [...driverQueries.all(), 'list'],

  list: (query: DriverQuery) =>
    queryOptions({
      queryKey: [...driverQueries.lists(), query.id],
      queryFn: () => getDriver(query),
      placeholderData: keepPreviousData,
    }),
}
