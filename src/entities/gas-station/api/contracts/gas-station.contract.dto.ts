import { z } from 'zod'

export const GasStationDtoSchema = z.object({
  id: z.number(),
  latitude: z.string(),
  longitude: z.string(),
  name: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional().nullable(),
  price: z.string().optional(),
  discount: z.string().optional(),
  priceAfterDiscount: z.string().optional(),
  distanceToLocation: z.number().optional().nullable(),
  route: z.number().optional(),
})
