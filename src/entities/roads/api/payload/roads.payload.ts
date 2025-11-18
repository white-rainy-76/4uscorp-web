import { z } from 'zod'

export const GetRoadsByBoundingBoxPayloadSchema = z.object({
  minLat: z.number(),
  minLon: z.number(),
  maxLat: z.number(),
  maxLon: z.number(),
})

export const GetTollRoadsPayloadSchema = z.array(z.string().uuid())

export type GetRoadsByBoundingBoxPayload = z.infer<
  typeof GetRoadsByBoundingBoxPayloadSchema
>
export type GetTollRoadsPayload = z.infer<typeof GetTollRoadsPayloadSchema>
