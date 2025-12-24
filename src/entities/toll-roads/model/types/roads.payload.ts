import { z } from 'zod'
import {
  GetTollRoadsByBoundingBoxPayloadSchema,
  GetTollRoadsPayloadSchema,
} from '../../api/payload/toll-roads.payload'

export type GetTollRoadsByBoundingBoxPayload = z.infer<
  typeof GetTollRoadsByBoundingBoxPayloadSchema
>
export type GetTollRoadsPayload = z.infer<typeof GetTollRoadsPayloadSchema>
