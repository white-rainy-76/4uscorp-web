import { z } from 'zod'
import {
  RouteByIdSchema,
  RouteDataSchema,
} from '../../api/contracts/route.contract'

export type RouteData = z.infer<typeof RouteDataSchema>
export type RouteByIdData = z.infer<typeof RouteByIdSchema>
