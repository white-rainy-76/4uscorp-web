import { CoordinatesDtoSchema } from '@/shared/api'
import { z } from 'zod'

// current route
const LatLngLiteralSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})
export const LatLngSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const RouteWithRouteSchema = z.object({
  isRoute: z.literal(true),
  currentLocation: CoordinatesDtoSchema.nullable(),
  formattedLocation: z.string(),
  routeId: z.string(),
  mapPoints: z.array(LatLngLiteralSchema),
})

const RouteWithoutRouteSchema = z.object({
  isRoute: z.literal(false),
  currentLocation: CoordinatesDtoSchema,
  formattedLocation: z.string(),
  routeId: z.null(),
  mapPoints: z.array(LatLngLiteralSchema),
})

export const RouteSchema = z.discriminatedUnion('isRoute', [
  RouteWithRouteSchema,
  RouteWithoutRouteSchema,
])

export const RouteDataSchema = z.object({
  truckId: z.string(),
  originName: z.string().nullable(),
  destinationName: z.string().nullable(),
  origin: CoordinatesDtoSchema.nullable(),
  destination: CoordinatesDtoSchema.nullable(),
  weight: z.number(),
  remainingFuel: z.number().optional(),
  route: RouteSchema,
})

// get distance
export const GetDistanceSchema = z.object({
  distance: z.number(),
})
