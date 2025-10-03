import { queryOptions } from '@tanstack/react-query'
import { getStatistics } from './statistics.service'
import { mapStatistics } from './mapper/statistics.mapper'
import { Statistics } from '../model/types/statistics'

export const STATISTICS_ROOT_QUERY_KEY = ['statistics']

interface GetStatisticsParams {
  reportId: string | null
  driverId: string | null
}

export const statisticsQueries = {
  all: () => [...STATISTICS_ROOT_QUERY_KEY],

  statistics: (params: GetStatisticsParams) =>
    queryOptions<Statistics>({
      queryKey: [
        ...STATISTICS_ROOT_QUERY_KEY,
        'statistics',
        params.reportId,
        params.driverId,
      ],
      queryFn: async ({ signal }) => {
        const { data } = await getStatistics(params, { signal })
        return mapStatistics(data)
      },
    }),
}
