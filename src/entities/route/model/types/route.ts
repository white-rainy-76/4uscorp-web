import { z } from 'zod'
import {
  RouteDataSchema,
  GetDistanceSchema,
} from '../../api/contracts/route.contract'
import { RouteByIdSchema } from '../../api/contracts/route-by-id.contract'
import {
  GetSavedRoutesSchema,
  SavedRouteByIdSchema,
  GetAllSavedRouteSchema,
} from '../../api/contracts/saved-routes.contract'

export type RouteData = z.infer<typeof RouteDataSchema>
export type RouteByIdData = z.infer<typeof RouteByIdSchema>
export type GetDistanceData = z.infer<typeof GetDistanceSchema>
export type GetSavedRoutesData = z.infer<typeof GetSavedRoutesSchema>
export type SavedRouteByIdData = z.infer<typeof SavedRouteByIdSchema>
export type GetAllSavedRouteData = z.infer<typeof GetAllSavedRouteSchema>
