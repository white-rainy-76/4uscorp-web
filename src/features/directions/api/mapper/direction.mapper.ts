import { mapGasStations } from '@/entities/gas-station/api/mapper/map-gas-stations'
import { z } from 'zod'
import { DirectionsDtoSchema } from '../contracts/direction.contract.dto'
import { Directions } from '../types/directions'

export const mapDirections = (
  dto: z.infer<typeof DirectionsDtoSchema>,
): Directions => ({
  responseId: dto.responseId,
  routeDtos: dto.routeDtos,
  gasStations: mapGasStations(dto.fuelStationDtos),
})
