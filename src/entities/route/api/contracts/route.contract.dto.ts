import { GasStationDtoSchema } from '@/entities/gas-station/api/contracts/gas-station.contract.dto'
import { CoordinatesDtoSchema } from '@/shared/api/contracts/coordinates.dto.contract'
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
  routeDto: RouteDtoSchema,
})

// get by id route
export const RouteInfoDtoSchema = z.object({
  tolls: z.number(),
  gallons: z.number(),
  miles: z.number(),
  driveTime: z.number(),
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
})
