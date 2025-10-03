import { queryOptions } from '@tanstack/react-query'
import { getDriversByReport } from './driver-statistics.service'
import { mapDriverStatistics } from './mapper/driver-statistics.mapper'
import { DriverStatistics } from '../model/types/driver-statistics'

export const DRIVER_STATISTICS_ROOT_QUERY_KEY = ['driver-statistics']

interface GetDriversByReportParams {
  FileReportId: string
}

export const driverStatisticsQueries = {
  all: () => [...DRIVER_STATISTICS_ROOT_QUERY_KEY],

  driversByReport: (params: GetDriversByReportParams) =>
    queryOptions<DriverStatistics[]>({
      queryKey: [
        ...DRIVER_STATISTICS_ROOT_QUERY_KEY,
        'drivers-by-report',
        params.FileReportId,
      ],
      queryFn: async ({ signal }) => {
        const { data } = await getDriversByReport(params, { signal })
        return data.map(mapDriverStatistics)
      },
    }),
}
