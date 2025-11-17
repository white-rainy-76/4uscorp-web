import { GasStationSchema } from '@/entities/gas-station'
import { z } from 'zod'

export const CoordinatePairSchema = z.tuple([z.number(), z.number()])

export const RouteInfoSchema = z.object({
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
})
