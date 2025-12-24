import { z } from 'zod'
import {
  RouteDataDtoSchema,
  GetDistanceDtoSchema,
} from '../../api/contracts/route.dto.contract'
import { RouteByIdDtoSchema } from '../../api/contracts/route-by-id.dto.contract'
import {
  GetSavedRoutesDtoSchema,
  SavedRouteByIdDtoSchema,
  GetAllSavedRouteDtoSchema,
} from '../../api/contracts/saved-routes.dto.contract'

export type RouteDataDto = z.infer<typeof RouteDataDtoSchema>
export type RouteByIdDataDto = z.infer<typeof RouteByIdDtoSchema>
export type GetDistanceDataDto = z.infer<typeof GetDistanceDtoSchema>
export type GetSavedRoutesDto = z.infer<typeof GetSavedRoutesDtoSchema>
export type SavedRouteByIdDto = z.infer<typeof SavedRouteByIdDtoSchema>
export type GetAllSavedRouteDto = z.infer<typeof GetAllSavedRouteDtoSchema>
