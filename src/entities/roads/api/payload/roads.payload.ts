import { z } from 'zod'

export const GetRoadsByBoundingBoxPayloadSchema = z.object({
  minLat: z.number(),
  minLon: z.number(),
  maxLat: z.number(),
  maxLon: z.number(),
})
