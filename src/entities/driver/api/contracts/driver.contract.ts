import { z } from 'zod'

export const TruckInfoSchema = z.object({
  id: z.string().nullable(),
  unitNumber: z.string().nullable(),
  vin: z.string().nullable(),
})

export const DriverSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid().nullable().optional(),
  fullName: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  bonus: z.number().int().nonnegative(),
  telegramLink: z.string().nullable(),
  truck: TruckInfoSchema.nullable().optional(),
})
