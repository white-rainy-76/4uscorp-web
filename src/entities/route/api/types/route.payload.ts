import { z } from 'zod'
import {
  AssignRoutePayloadSchema,
  GetRouteByIdPayloadSchema,
  GetRoutePayloadSchema,
} from '../payload/route.payload'

export type GetRoutePayload = z.infer<typeof GetRoutePayloadSchema>
export type GetRouteByIdPayload = z.infer<typeof GetRouteByIdPayloadSchema>
export type AssignRoutePayload = z.infer<typeof AssignRoutePayloadSchema>
