import { z } from 'zod'
import {
  GetRoadsByBoundingBoxPayloadSchema,
  GetTollRoadsPayloadSchema,
} from '../../api/payload/roads.payload'

export type GetRoadsByBoundingBoxPayload = z.infer<
  typeof GetRoadsByBoundingBoxPayloadSchema
>
export type GetTollRoadsPayload = z.infer<typeof GetTollRoadsPayloadSchema>
