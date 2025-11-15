import { z } from 'zod'
import {
  TruckUnitSchema,
  TruckUnitsResponseSchema,
} from '../../api/contracts/truck-unit.contract'
import {
  TruckUnitDtoSchema,
  TruckUnitsResponseDtoSchema,
} from '../../api/contracts/truck-unit.dto.contract'

export type TruckUnit = z.infer<typeof TruckUnitSchema>
export type TruckUnitsResponse = z.infer<typeof TruckUnitsResponseSchema>
export type TruckUnitDto = z.infer<typeof TruckUnitDtoSchema>
export type TruckUnitsResponseDto = z.infer<typeof TruckUnitsResponseDtoSchema>
