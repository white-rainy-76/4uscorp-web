import { DriverStatisticsDto } from '../contracts/driver-statistics.contract'
import { DriverStatistics } from '../../model/types/driver-statistics'

export function mapDriverStatistics(
  dto: DriverStatisticsDto,
): DriverStatistics {
  return {
    reportId: dto.reportId,
    driverId: dto.driverId,
    truckId: dto.truckId,
    driverName: dto.driverName,
    truckUnit: dto.truckUnit,
    stationPlanCount: dto.stationPlanCount,
    unSucssesStationPlanCount: dto.unSucssesStationPlanCount,
  }
}
