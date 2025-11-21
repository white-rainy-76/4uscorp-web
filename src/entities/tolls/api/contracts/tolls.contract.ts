import { z } from 'zod'

export const TollSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  position: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  roadId: z.string(),
  key: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  isDynamic: z.boolean().optional(),
  nodeId: z.number().optional(),
  iPass: z.number().optional(),
  iPassOvernight: z.number().optional(),
  payOnline: z.number().optional(),
  payOnlineOvernight: z.number().optional(),
})

export const GetTollsByBoundingBoxResponseSchema = z.array(TollSchema)
