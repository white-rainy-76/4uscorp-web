import { z } from 'zod'

export const DriverBonusPayloadSchema = z.object({
  driverId: z.string(),
  bonus: z.number(),
  reason: z.string(),
})

export type DriverBonusPayload = z.infer<typeof DriverBonusPayloadSchema>




