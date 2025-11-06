import { z } from 'zod'
import {
  TollSchema,
  GetTollsByBoundingBoxResponseSchema,
} from '../../api/contracts/tolls.contract'

export type Toll = z.infer<typeof TollSchema>
export type GetTollsByBoundingBoxResponse = z.infer<
  typeof GetTollsByBoundingBoxResponseSchema
>
