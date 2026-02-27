import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getAllPartners } from './partner.service'
import { mapPartners } from './mapper/partner.mapper'

export const PARTNERS_ROOT_QUERY_KEY = ['partners']

export const partnerQueries = {
  all: () => [...PARTNERS_ROOT_QUERY_KEY],

  list: () =>
    queryOptions({
      queryKey: [...partnerQueries.all(), 'list'],
      queryFn: async ({ signal }) => {
        const { data } = await getAllPartners({ signal })
        return mapPartners(data)
      },
      placeholderData: keepPreviousData,
    }),
}
