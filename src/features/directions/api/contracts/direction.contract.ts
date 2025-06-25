import { GasStationSchema } from '@/entities/gas-station/api/contracts/gas-station.contract'
import { z } from 'zod'

export const CoordinatePairSchema = z.tuple([z.number(), z.number()])

export const RouteInfoSchema = z.object({
  tolls: z.number().min(0),
  gallons: z.number().min(0),
  miles: z.number().min(0),
  driveTime: z.number().min(0),
})

export const RouteSchema = z.object({
  routeSectionId: z.string(),
  mapPoints: z.array(CoordinatePairSchema),
  routeInfo: RouteInfoSchema,
})

export const DirectionsSchema = z.object({
  routeId: z.string(),
  route: z.array(RouteSchema),
  gasStations: z.array(GasStationSchema),
})
