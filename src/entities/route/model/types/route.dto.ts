import { z } from 'zod'
import {
  RouteByIdDtoSchema,
  RouteDataDtoSchema,
} from '../../api/contracts/route.dto.contract'

export type RouteDataDto = z.infer<typeof RouteDataDtoSchema>
export type RouteByIdDataDto = z.infer<typeof RouteByIdDtoSchema>
