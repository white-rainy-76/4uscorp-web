import { z } from 'zod'

export const TruckUnitSchema = z.object({
  truckId: z.string().uuid(),
  unit: z.string(),
})

export const TruckUnitsResponseSchema = z.array(TruckUnitSchema)
