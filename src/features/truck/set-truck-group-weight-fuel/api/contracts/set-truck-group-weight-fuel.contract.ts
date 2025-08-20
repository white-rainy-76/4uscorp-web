import { z } from 'zod'

export const SetTruckGroupWeightFuelResponseSchema = z.void()

export type SetTruckGroupWeightFuelResponse = z.infer<
  typeof SetTruckGroupWeightFuelResponseSchema
>




