import { z } from 'zod'
import { GetTollsByBoundingBoxPayloadSchema } from '../../api/payload/tolls.payload'

export type GetTollsByBoundingBoxPayload = z.infer<
  typeof GetTollsByBoundingBoxPayloadSchema
>
