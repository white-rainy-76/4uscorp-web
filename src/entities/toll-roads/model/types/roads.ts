import { z } from 'zod'
import {
  TollRoadSchema,
  GetTollRoadsByBoundingBoxResponseSchema,
  GetTollRoadsResponseSchema,
} from '../../api/contracts/toll-roads.contract'

export type TollRoad = z.infer<typeof TollRoadSchema>

export type GetTollRoadsByBoundingBoxResponse = z.infer<
  typeof GetTollRoadsByBoundingBoxResponseSchema
>
export type GetTollRoadsResponse = z.infer<typeof GetTollRoadsResponseSchema>
