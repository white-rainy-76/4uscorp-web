import { z } from 'zod'
import {
  TruckStatusSchema,
  TruckSchema,
  DriverForTruckSchema,
} from '../../api/contracts/truck.contract'
import { TruckDtoSchema } from '../../api'
import { DriverForTruckDtoSchema } from '../../api/contracts/truck.dto.contract'

export type TruckStatus = z.infer<typeof TruckStatusSchema>
export type Truck = z.infer<typeof TruckSchema>
export type TruckDto = z.infer<typeof TruckDtoSchema>
export type DriverForTruck = z.infer<typeof DriverForTruckSchema>
export type DriverForTruckDto = z.infer<typeof DriverForTruckDtoSchema>
