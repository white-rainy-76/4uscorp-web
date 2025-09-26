import { keepPreviousData, queryOptions } from '@tanstack/react-query'
import { getReportLoadAttempts } from './report-load-attempt.service'

export const REPORT_LOAD_ATTEMPTS_ROOT_QUERY_KEY = ['report-load-attempts']

export const reportLoadAttemptQueries = {
  all: () => [...REPORT_LOAD_ATTEMPTS_ROOT_QUERY_KEY],

  lists: () => [...reportLoadAttemptQueries.all(), 'list'],

  list: () =>
    queryOptions({
      queryKey: reportLoadAttemptQueries.lists(),
      queryFn: async ({ signal }) => {
        const { data } = await getReportLoadAttempts({ signal })
        return data
      },
      placeholderData: keepPreviousData,
    }),
}
