import { z } from 'zod'
import {
  TollDtoSchema,
  GetTollsByBoundingBoxResponseDtoSchema,
} from '../../api/contracts/tolls.dto.contract'

export type TollDto = z.infer<typeof TollDtoSchema>
export type GetTollsByBoundingBoxResponseDto = z.infer<
  typeof GetTollsByBoundingBoxResponseDtoSchema
>
