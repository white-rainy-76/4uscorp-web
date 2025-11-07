import { z } from 'zod'
import {
  RoadSchema,
  GetRoadsByBoundingBoxResponseSchema,
} from '../../api/contracts/roads.contract'

export type Road = z.infer<typeof RoadSchema>
export type TollRoad = Road // Более точное название для платных дорог

export type GetRoadsByBoundingBoxResponse = z.infer<
  typeof GetRoadsByBoundingBoxResponseSchema
>
export type GetTollRoadsByBoundingBoxResponse = GetRoadsByBoundingBoxResponse // Алиас для consistency
