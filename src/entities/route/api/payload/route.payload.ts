import { z } from 'zod'

export const GetRoutePayloadSchema = z.object({
  truckId: z.string(),
})

export const GetRouteByIdPayloadSchema = z.object({
  routeId: z.string(),
})

export const GetDistancePayloadSchema = z.object({
  routeSectionId: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
})

export const GetSavedRoutesPayloadSchema = z.object({
  startLatitude: z.number(),
  startLongitude: z.number(),
  endLatitude: z.number(),
  endLongitude: z.number(),
})

export const GetSavedRouteByIdPayloadSchema = z.object({
  id: z.string().uuid(),
})
