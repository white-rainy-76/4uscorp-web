import { z } from 'zod'

export const CoordinatesDtoSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})
