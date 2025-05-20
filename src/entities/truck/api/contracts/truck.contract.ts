import { z } from 'zod'

export const TruckStatusSchema = z.enum([
  'AVAILABLE',
  'EN_ROUTE',
  'MAINTENANCE',
])

export const DriverSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  status: z.string(),
})

export const TruckSchema = z.object({
  id: z.string(),
  providerTruckId: z.string(),
  licensePlate: z.string(),
  status: TruckStatusSchema,
  driverId: z.string(),
  name: z.string(),
  vin: z.string(),
  serial: z.string(),
  make: z.string(),
  model: z.string(),
  year: z.string(),
  driver: DriverSchema.nullable().optional(),
})
