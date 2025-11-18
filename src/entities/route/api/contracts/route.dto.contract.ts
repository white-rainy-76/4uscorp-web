import { CoordinatesDtoSchema } from '@/shared/api'
import { z } from 'zod'

// get current route
const MapPointSchema = CoordinatesDtoSchema

const RouteDtoWithRouteSchema = z.object({
  isRoute: z.literal(true),
  currentLocation: CoordinatesDtoSchema.nullable(),
  formattedLocation: z.string(),
  routeId: z.string(),
  mapPoints: z.array(MapPointSchema),
})

const RouteDtoWithoutRouteSchema = z.object({
  isRoute: z.literal(false),
  currentLocation: CoordinatesDtoSchema,
  formattedLocation: z.string(),
  routeId: z.null(),
  mapPoints: z.array(MapPointSchema),
})

export const RouteDtoSchema = z.discriminatedUnion('isRoute', [
  RouteDtoWithRouteSchema,
  RouteDtoWithoutRouteSchema,
])

export const RouteDataDtoSchema = z.object({
  truckId: z.string(),
  originName: z.string().nullable(),
  destinationName: z.string().nullable(),
  origin: CoordinatesDtoSchema.nullable(),
  destination: CoordinatesDtoSchema.nullable(),
  weight: z.number(),
  remainingFuel: z.number().optional(),
  routeDto: RouteDtoSchema,
})

// get distance
export const GetDistanceDtoSchema = z.object({
  distance: z.number(),
})
