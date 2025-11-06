import { z } from 'zod'
import {
  RoadSchema,
  GetRoadsByBoundingBoxResponseSchema,
} from '../../api/contracts/roads.contract'

export type Road = z.infer<typeof RoadSchema>
export type GetRoadsByBoundingBoxResponse = z.infer<
  typeof GetRoadsByBoundingBoxResponseSchema
>
