import { GasStationDtoSchema } from '@/entities/gas-station/@x/route'
import { CoordinatesDtoSchema } from '@/shared/api'
import { z } from 'zod'

// get by id route
export const RouteInfoDtoSchema = z.object({
  tolls: z.number(),
  gallons: z.number(),
  miles: z.number(),
  driveTime: z.number(),
})

export const ViaPointDtoSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  stopOrder: z.number(),
})

export const RouteByIdDtoSchema = z.object({
  routeId: z.string().uuid(),
  originName: z.string(),
  destinationName: z.string(),
  weight: z.number(),
  routeInfo: RouteInfoDtoSchema,
  origin: CoordinatesDtoSchema,
  destination: CoordinatesDtoSchema,
  remainingFuel: z.number(),
  sectionId: z.string(),
  mapPoints: z.array(z.array(z.number())),
  fuelStationDtos: z.array(GasStationDtoSchema),
  totalFuelAmmount: z.number(),
  totalPriceAmmount: z.number(),
  fuelPlanId: z.string().optional().nullable(),
  viaPoints: z.array(ViaPointDtoSchema).optional(),
})
