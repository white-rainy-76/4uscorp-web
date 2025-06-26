import { z } from 'zod'
import { DirectionsDtoSchema } from '../contracts/direction.contract.dto'
import { Directions } from '../types/directions'
import { mapGasStationDtoToGasStation } from '@/entities/gas-station/api/mapper/map-gas-stations'

export const mapDirections = (
  dto: z.infer<typeof DirectionsDtoSchema>,
): Directions => ({
  routeId: dto.routeId,
  route: dto.routeDtos,
  gasStations: dto.fuelStationDtos.map(mapGasStationDtoToGasStation),
})
