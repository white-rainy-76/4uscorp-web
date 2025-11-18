import { z } from 'zod'
import {
  GetRouteByIdPayloadSchema,
  GetRoutePayloadSchema,
  GetDistancePayloadSchema,
  GetSavedRoutesPayloadSchema,
  GetSavedRouteByIdPayloadSchema,
} from '../../api/payload/route.payload'

export type GetRoutePayload = z.infer<typeof GetRoutePayloadSchema>
export type GetRouteByIdPayload = z.infer<typeof GetRouteByIdPayloadSchema>
export type GetDistancePayload = z.infer<typeof GetDistancePayloadSchema>
export type GetSavedRoutesPayload = z.infer<typeof GetSavedRoutesPayloadSchema>
export type GetSavedRouteByIdPayload = z.infer<
  typeof GetSavedRouteByIdPayloadSchema
>
