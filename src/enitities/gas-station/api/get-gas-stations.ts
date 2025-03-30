import { apiClient } from '@/shared/api/base'
import { GasStation } from '../model/gas-station'
import { mapGasStations } from './mapper/map-gas-stations'
import { GasStationDto } from './dto/gas-station.dto'
import { GasStationQuery } from './query/gas-station.query'

export const getGasStations = async ({
  origin,
  destination,
}: GasStationQuery): Promise<GasStation[]> => {
  const query: GasStationQuery = { origin, destination }
  const result = await apiClient.get<GasStationDto>(`/gas-stations`, query)

  return mapGasStations(result)
}
