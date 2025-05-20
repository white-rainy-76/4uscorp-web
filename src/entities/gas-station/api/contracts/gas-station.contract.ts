import { z } from 'zod'

export const FuelPriceSchema = z.object({
  price: z.string().optional(),
  discount: z.string().optional(),
  finalPrice: z.string().optional(),
})

export const GasStationSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  position: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  address: z.string().optional(),
  fuelPrice: FuelPriceSchema.optional(),
})
