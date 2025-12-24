import { FuelStationStatusDto } from '../contracts/gas-station.dto.contract'
import { FuelStationStatus } from '../../model/types/fuel-station-status'

export const mapFuelStationStatusDtoToFuelStationStatus = (
  dto: FuelStationStatusDto,
): FuelStationStatus => ({
  fuelStationId: dto.fuelStationId,
  status: dto.status as 1 | 2 | 3,
})
