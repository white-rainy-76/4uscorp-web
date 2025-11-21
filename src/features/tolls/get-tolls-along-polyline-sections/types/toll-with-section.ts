import { z } from 'zod'

export const TollWithSectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nullable(),
  nodeId: z.number(),
  price: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  roadId: z.string().uuid(),
  key: z.string().nullable(),
  comment: z.string().nullable(),
  isDynamic: z.boolean(),
  routeSection: z.string().nullable(),
  payOnline: z.number().optional(),
  iPass: z.number().optional(),
})

export type TollWithSection = z.infer<typeof TollWithSectionSchema>

export const GetTollsAlongPolylineSectionsResponseSchema = z.array(
  TollWithSectionSchema,
)

export type GetTollsAlongPolylineSectionsResponse = z.infer<
  typeof GetTollsAlongPolylineSectionsResponseSchema
>
