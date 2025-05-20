import { z } from 'zod'
import {
  TruckStatusSchema,
  DriverSchema,
  TruckSchema,
} from '../contracts/truck.contract'

export type TruckStatus = z.infer<typeof TruckStatusSchema>
export type Driver = z.infer<typeof DriverSchema>
export type Truck = z.infer<typeof TruckSchema>
