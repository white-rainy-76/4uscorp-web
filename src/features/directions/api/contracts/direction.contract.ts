import { GasStationSchema } from '@/entities/gas-station/api/contracts/gas-station.contract'
import { z } from 'zod'

export const CoordinatePairSchema = z.tuple([z.number(), z.number()])

export const RouteSchema = z.object({
  routeId: z.string(),
  mapPoints: z.array(CoordinatePairSchema),
})

export const DirectionsSchema = z.object({
  responseId: z.string(),
  routeDtos: z.array(RouteSchema),
  gasStations: z.array(GasStationSchema),
})
