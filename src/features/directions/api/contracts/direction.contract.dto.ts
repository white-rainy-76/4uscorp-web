import { z } from 'zod'
import { CoordinatePairSchema } from './direction.contract'
import { GasStationDtoSchema } from '@/entities/gas-station/api/contracts/gas-station.contract.dto'

export const RouteDtoSchema = z.object({
  routeId: z.string(),
  mapPoints: z.array(CoordinatePairSchema),
})

export const DirectionsDtoSchema = z.object({
  responseId: z.string(),
  routeDtos: z.array(RouteDtoSchema),
  fuelStationDtos: z.array(GasStationDtoSchema),
})
