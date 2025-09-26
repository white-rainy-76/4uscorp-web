import { z } from 'zod'

export const AttachDetachDriverPayloadSchema = z.object({
  truckId: z.string(),
  driverId: z.string(),
})

export type AttachDetachDriverPayload = z.infer<
  typeof AttachDetachDriverPayloadSchema
>




