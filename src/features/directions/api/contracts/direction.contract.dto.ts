import { z } from 'zod'
import { CoordinatePairSchema } from './direction.contract'
import { GasStationDtoSchema } from '@/entities/gas-station/api/contracts/gas-station.contract.dto'

export const RouteInfoDtoSchema = z.object({
  tolls: z.number().min(0),
  gallons: z.number().min(0),
  miles: z.number().min(0),
  driveTime: z.number().min(0),
})

export const RouteDtoSchema = z.object({
  routeSectionId: z.string(),
  mapPoints: z.array(CoordinatePairSchema),
  routeInfo: RouteInfoDtoSchema,
})

export const DirectionsDtoSchema = z.object({
  routeId: z.string(),
  routeDtos: z.array(RouteDtoSchema),
  fuelStationDtos: z.array(GasStationDtoSchema),
})
