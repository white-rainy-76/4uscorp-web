// schemas
export {
  FuelRouteInfoDtoSchema,
  FuelPlanStationDtoSchema,
  FuelPlanReportItemDtoSchema,
  StatisticsResponseDtoSchema,
} from './contracts/statistics.contract'
export { DriverStatisticsDtoSchema } from './contracts/driver-statistics.contract'

// mappers
export {
  mapFuelRouteInfo,
  mapFuelPlanStation,
  mapFuelPlanReportItem,
  mapStatistics,
} from './mapper/statistics.mapper'
export { mapDriverStatistics } from './mapper/driver-statistics.mapper'

// queries
export { statisticsQueries } from './statistics.queries'
export { driverStatisticsQueries } from './driver-statistics.queries'
