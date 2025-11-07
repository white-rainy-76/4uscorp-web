import { z } from 'zod'
import { CoordinatesDtoSchema } from '@/shared/api/contracts'

export const UpdateRoadPayloadSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  highwayType: z.string(),
  isToll: z.boolean(),
  state: z.string(),
  ref: z.string(),
  wayId: z.number(),
  coordinates: z.array(CoordinatesDtoSchema),
})

export type UpdateRoadPayload = z.infer<typeof UpdateRoadPayloadSchema>
