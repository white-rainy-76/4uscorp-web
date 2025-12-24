import { z } from 'zod'

export const GetTollRoadsByBoundingBoxPayloadSchema = z.object({
  minLat: z.number(),
  minLon: z.number(),
  maxLat: z.number(),
  maxLon: z.number(),
})

export const GetTollRoadsPayloadSchema = z.array(z.string().uuid())

export type GetTollRoadsByBoundingBoxPayload = z.infer<
  typeof GetTollRoadsByBoundingBoxPayloadSchema
>
export type GetTollRoadsPayload = z.infer<typeof GetTollRoadsPayloadSchema>
