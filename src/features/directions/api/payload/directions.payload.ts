import { z } from 'zod'

export const PointRequestPayloadSchema = z.object({
  latitude: z.number().min(-90).max(90, {
    message: 'Latitude must be between -90 and 90 degrees.',
  }),
  longitude: z.number().min(-180).max(180, {
    message: 'Longitude must be between -180 and 180 degrees.',
  }),
})

export const RouteRequestPayloadSchema = z.object({
  TruckId: z.string().optional(),
  origin: PointRequestPayloadSchema,
  destination: PointRequestPayloadSchema,
  originName: z.string(),
  destinationName: z.string(),
  ViaPoints: z.array(PointRequestPayloadSchema).optional(),
  savedRouteId: z.string().uuid().optional(),
})
