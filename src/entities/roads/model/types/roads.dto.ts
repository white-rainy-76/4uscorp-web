import { z } from 'zod'
import {
  RoadDtoSchema,
  GetRoadsByBoundingBoxResponseDtoSchema,
  CoordinateDtoSchema,
} from '../../api/contracts/roads.dto.contract'

export type RoadDto = z.infer<typeof RoadDtoSchema>
export type GetRoadsByBoundingBoxResponseDto = z.infer<
  typeof GetRoadsByBoundingBoxResponseDtoSchema
>
export type CoordinateDto = z.infer<typeof CoordinateDtoSchema>
