import { z } from 'zod'
import {
  TollPriceSchema,
  TollSchema,
  GetTollsByBoundingBoxResponseSchema,
} from '../../api/contracts/tolls.contract'

export type TollPrice = z.infer<typeof TollPriceSchema>
export type Toll = z.infer<typeof TollSchema>
export type GetTollsByBoundingBoxResponse = z.infer<
  typeof GetTollsByBoundingBoxResponseSchema
>
