import { z } from 'zod'

export const SetTruckGroupWeightFuelPayloadSchema = z.object({
  truckGroupId: z.string(),
  fuelCapacity: z.number(),
  weight: z.number(),
})

export type SetTruckGroupWeightFuelPayload = z.infer<
  typeof SetTruckGroupWeightFuelPayloadSchema
>




