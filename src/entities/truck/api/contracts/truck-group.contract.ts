import { z } from 'zod'

export const TruckGroupSchema = z.object({
  id: z.string(),
  truckGroupName: z.string(),
  weight: z.number(),
  fuelCapacity: z.number(),
  trucksCount: z.number(),
})
