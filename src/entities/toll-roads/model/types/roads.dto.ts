import { z } from 'zod'
import {
  TollRoadDtoSchema,
  GetTollRoadsByBoundingBoxResponseDtoSchema,
  GetTollRoadsResponseDtoSchema,
  CoordinateDtoSchema,
} from '../../api/contracts/toll-roads.dto.contract'

export type TollRoadDto = z.infer<typeof TollRoadDtoSchema>
export type GetTollRoadsByBoundingBoxResponseDto = z.infer<
  typeof GetTollRoadsByBoundingBoxResponseDtoSchema
>
export type GetTollRoadsResponseDto = z.infer<
  typeof GetTollRoadsResponseDtoSchema
>
export type CoordinateDto = z.infer<typeof CoordinateDtoSchema>
