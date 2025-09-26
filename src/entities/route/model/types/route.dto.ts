import { z } from 'zod'
import {
  RouteByIdDtoSchema,
  RouteDataDtoSchema,
  GetDistanceDtoSchema,
} from '../../api/contracts/route.dto.contract'

export type RouteDataDto = z.infer<typeof RouteDataDtoSchema>
export type RouteByIdDataDto = z.infer<typeof RouteByIdDtoSchema>
export type GetDistanceDataDto = z.infer<typeof GetDistanceDtoSchema>
