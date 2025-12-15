import { z } from 'zod'
import {
  TollPriceDtoSchema,
  TollDtoSchema,
  GetTollsByBoundingBoxResponseDtoSchema,
} from '../../api/contracts/tolls.dto.contract'

export type TollPriceDto = z.infer<typeof TollPriceDtoSchema>
export type TollDto = z.infer<typeof TollDtoSchema>
export type GetTollsByBoundingBoxResponseDto = z.infer<
  typeof GetTollsByBoundingBoxResponseDtoSchema
>
