import { apiClient } from '@/shared/api/base'
import { GasStation } from '../model/gas-station'
import { mapGasStations } from './mapper/map-gas-stations'
import { GasStationDto } from './dto/gas-station.dto'
import { GasStationQuery } from './query/gas-station.query'

export const getGasStations = async ({
  source,
  destination,
  radius,
}: GasStationQuery): Promise<GasStation[]> => {
  const query: GasStationQuery = { source, destination, radius }
  const result = await apiClient.get<GasStationDto[]>(
    `/api/FuelStation/get-by-radius`,
    query,
  )
  return mapGasStations(result)
}
