import { z } from 'zod'

export const GetTollsByBoundingBoxPayloadSchema = z.object({
  minLat: z.number(),
  minLon: z.number(),
  maxLat: z.number(),
  maxLon: z.number(),
})
