import { z } from 'zod'

export const CoordinateSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})

export const RoadSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  ref: z.string().nullable(),
  highwayType: z.string().nullable(),
  isToll: z.boolean().nullable(),
  coordinates: z.array(CoordinateSchema),
})

export const GetRoadsByBoundingBoxResponseSchema = z.array(RoadSchema)
