import { mapGasStations } from '@/entities/gas-station/api/mapper/map-gas-stations'
import { z } from 'zod'
import { DirectionsDtoSchema } from '../contracts/direction.contract.dto'
import { Directions } from '../types/directions'

export const mapDirections = (
  dto: z.infer<typeof DirectionsDtoSchema>,
): Directions => ({
  routeId: dto.routeId,
  route: dto.routeDtos,
  gasStations: mapGasStations(dto.fuelStationDtos),
})
