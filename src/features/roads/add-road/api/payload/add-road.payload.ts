import { z } from 'zod'
import { CoordinatesDtoSchema } from '@/shared/api/contracts'

export const AddRoadPayloadSchema = z.object({
  name: z.string(),
  highwayType: z.string(),
  isToll: z.boolean(),
  coordinates: z.array(CoordinatesDtoSchema),
})

export type AddRoadPayload = z.infer<typeof AddRoadPayloadSchema>
