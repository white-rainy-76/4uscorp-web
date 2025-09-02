import { z } from 'zod'
import {
  AssignRoutePayloadSchema,
  GetRouteByIdPayloadSchema,
  GetRoutePayloadSchema,
  GetDistancePayloadSchema,
} from '../../api/payload/route.payload'

export type GetRoutePayload = z.infer<typeof GetRoutePayloadSchema>
export type GetRouteByIdPayload = z.infer<typeof GetRouteByIdPayloadSchema>
export type AssignRoutePayload = z.infer<typeof AssignRoutePayloadSchema>
export type GetDistancePayload = z.infer<typeof GetDistancePayloadSchema>
