import { GasStationSchema } from '@/entities/gas-station/@x/route'
import { CoordinatesDtoSchema } from '@/shared/api'
import { z } from 'zod'
import { LatLngSchema } from './route.contract'

// route by id
export const RouteInfoSchema = z.object({
  tolls: z.number(),
  gallons: z.number(),
  miles: z.number(),
  driveTime: z.number(),
})

export const ViaPointSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  stopOrder: z.number(),
})

export const RouteByIdSchema = z.object({
  routeId: z.string().uuid(),
  originName: z.string(),
  destinationName: z.string(),
  origin: CoordinatesDtoSchema,
  destination: CoordinatesDtoSchema,
  weight: z.number(),
  routeInfo: RouteInfoSchema,
  remainingFuel: z.number(),
  sectionId: z.string(),
  mapPoints: z.array(LatLngSchema),
  fuelStations: z.array(GasStationSchema),
  totalFuelAmmount: z.number(),
  totalPriceAmmount: z.number(),
  fuelPlanId: z.string().optional().nullable(),
  viaPoints: z.array(ViaPointSchema).optional(),
})
