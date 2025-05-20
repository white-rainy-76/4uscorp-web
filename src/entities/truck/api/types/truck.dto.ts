import { z } from 'zod'
import {
  DriverDtoSchema,
  TruckDtoSchema,
} from '../contracts/truck.contract.dto'

export type DriverDto = z.infer<typeof DriverDtoSchema>
export type TruckDto = z.infer<typeof TruckDtoSchema>
