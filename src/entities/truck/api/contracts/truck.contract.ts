import { z } from 'zod'

export const TruckStatusSchema = z.enum([
  'INACTIVE', // 0
  'ACTIVE', // 1
  'IDLE', // 2
])

export const DriverForTruckSchema = z.object({
  id: z.string().uuid(),
  truckId: z.string().uuid(),
  fullName: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  bonus: z.number().int().nonnegative(),
  telegramLink: z.string().nullable(),
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
  driver: DriverForTruckSchema.nullable().optional(),
})
