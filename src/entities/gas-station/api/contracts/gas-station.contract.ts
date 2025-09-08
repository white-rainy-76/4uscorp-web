import { z } from 'zod'

export const FuelPriceSchema = z.object({
  price: z.string().optional(),
  discount: z.string().optional(),
  finalPrice: z.string().optional(),
})

export const GasStationSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  position: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  address: z.string().nullable().optional(),
  fuelPrice: FuelPriceSchema.optional(),
  isAlgorithm: z.boolean().nullable().optional(),
  refill: z.string().nullable().optional(),
  stopOrder: z.number().nullable().optional(),
  nextDistanceKm: z.number().nullable().optional(),
  roadSectionId: z.string(),
  fuelLeftBeforeRefill: z.number().nullable().optional(),
  fuelStationProviderId: z.string().nullable().optional(),
  // Fields from old contract that might still be relevant
  state: z.string().nullable().optional(),
  distanceToLocation: z.number().nullable().optional(),
  route: z.number().nullable().optional(),
})

export const ValidationErrorSchema = z.object({
  message: z.string(),
})

export const FuelRouteInfoSchema = z.object({
  roadSectionId: z.string(),
  totalPriceAmmount: z.number(),
  totalFuelAmmount: z.number(),
  finishInfo: z.object({
    remainingFuelLiters: z.number(),
  }),
  validationError: ValidationErrorSchema.nullable(),
})

export const GetGasStationsResponseSchema = z.object({
  fuelStations: z.array(GasStationSchema),
  fuelRouteInfoDtos: z.array(FuelRouteInfoSchema),
})
