import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getPriceLoadAttempts } from './price-load-attempt.service'

export const PRICE_LOAD_ATTEMPTS_ROOT_QUERY_KEY = ['price-load-attempts']

export const priceLoadAttemptQueries = {
  all: () => [...PRICE_LOAD_ATTEMPTS_ROOT_QUERY_KEY],

  lists: () => [...priceLoadAttemptQueries.all(), 'list'],

  list: () =>
    queryOptions({
      queryKey: priceLoadAttemptQueries.lists(),
      queryFn: async ({ signal }) => {
        const { data } = await getPriceLoadAttempts({ signal })
        return data
      },
      placeholderData: keepPreviousData,
    }),
}
