import { z } from 'zod'

export const TruckUnitDtoSchema = z.object({
  truckId: z.string().uuid(),
  unit: z.string(),
})

export const TruckUnitsResponseDtoSchema = z.array(TruckUnitDtoSchema)
