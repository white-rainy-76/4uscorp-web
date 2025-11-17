import { z } from 'zod'
import {
  RoadDtoSchema,
  GetRoadsByBoundingBoxResponseDtoSchema,
  GetTollRoadsResponseDtoSchema,
  CoordinateDtoSchema,
} from '../../api/contracts/roads.dto.contract'

export type RoadDto = z.infer<typeof RoadDtoSchema>
export type GetRoadsByBoundingBoxResponseDto = z.infer<
  typeof GetRoadsByBoundingBoxResponseDtoSchema
>
export type GetTollRoadsResponseDto = z.infer<
  typeof GetTollRoadsResponseDtoSchema
>
export type CoordinateDto = z.infer<typeof CoordinateDtoSchema>
