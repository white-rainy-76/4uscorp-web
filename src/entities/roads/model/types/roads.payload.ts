import { z } from 'zod'
import { GetRoadsByBoundingBoxPayloadSchema } from '../../api/payload/roads.payload'

export type GetRoadsByBoundingBoxPayload = z.infer<
  typeof GetRoadsByBoundingBoxPayloadSchema
>
