import { z } from 'zod'

export const PointRequestPayloadSchema = z.object({
  latitude: z.number().min(-90).max(90, {
    message: 'Latitude must be between -90 and 90 degrees.',
  }),
  longitude: z.number().min(-180).max(180, {
    message: 'Longitude must be between -180 and 180 degrees.',
  }),
})

export const RouteRequestPayloadSchema = z
  .object({
    TruckId: z.string().optional(),
    origin: PointRequestPayloadSchema.optional(),
    destination: PointRequestPayloadSchema.optional(),
    originName: z.string().optional(),
    destinationName: z.string().optional(),
    ViaPoints: z.array(PointRequestPayloadSchema).optional(),
    savedRouteId: z.string().uuid().optional(),
  })
  .refine(
    (data) => {
      // Либо есть savedRouteId, либо есть origin и destination
      return !!data.savedRouteId || (!!data.origin && !!data.destination)
    },
    {
      message:
        'Either savedRouteId or both origin and destination must be provided',
    },
  )
