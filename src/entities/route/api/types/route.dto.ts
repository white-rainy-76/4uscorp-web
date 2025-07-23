import { z } from 'zod'
import {
  RouteByIdDtoSchema,
  RouteDataDtoSchema,
} from '../contracts/route.contract.dto'

export type RouteDataDto = z.infer<typeof RouteDataDtoSchema>
export type RouteByIdDataDto = z.infer<typeof RouteByIdDtoSchema>
