import { z } from 'zod'

export const GasStationDtoSchema = z.object({
  id: z.string(),
  latitude: z.string(),
  longitude: z.string(),
  name: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  price: z.string().optional().nullable(),
  discount: z.string().optional().nullable(),
  priceAfterDiscount: z.string().optional().nullable(),
  isAlgorithm: z.boolean().optional().nullable(),
  refill: z.string().optional().nullable(),
  stopOrder: z.number().optional().nullable(),
  nextDistanceKm: z.string().optional().nullable(),
  // Fields from old contract not in new data:
  // state: z.string().optional().nullable(),
  // distanceToLocation: z.number().optional().nullable(),
  // route: z.number().optional().nullable(),
})
