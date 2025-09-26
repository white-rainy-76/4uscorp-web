import { z } from 'zod'

export const GetRoutePayloadSchema = z.object({
  truckId: z.string(),
})

export const GetRouteByIdPayloadSchema = z.object({
  routeId: z.string(),
})

export const AssignRoutePayloadSchema = z.object({
  routeId: z.string(),
  routeSectionId: z.string(),
  truckId: z.string(),
})

export const GetDistancePayloadSchema = z.object({
  routeSectionId: z.string().uuid(),
  latitude: z.number(),
  longitude: z.number(),
})
