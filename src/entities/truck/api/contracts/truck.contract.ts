import { z } from 'zod'

export const TruckStatusSchema = z.enum([
  'INACTIVE', // 0
  'ACTIVE', // 1
  'IDLE', // 2
])

export const DriverSchema = z.object({
  id: z.string().uuid(),
  truckId: z.string().uuid(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string().email(),
  bonus: z.number().int().nonnegative(),
  telegramLink: z.string().url(),
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
