import { z } from 'zod'

export const TollDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  roadId: z.string(),
  key: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  isDynamic: z.boolean().optional(),
  nodeId: z.number().optional(),
})

export const GetTollsByBoundingBoxResponseDtoSchema = z.array(TollDtoSchema)
