import { z } from 'zod'

export const TruckInfoDtoSchema = z.object({
  id: z.string().optional(),
  unitNumber: z.string().nullable().optional(),
  vin: z.string().nullable().optional(),
})

export const DriverDtoSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  bonus: z.number().int().nonnegative(),
  telegramLink: z.string().nullable(),
  truck: TruckInfoDtoSchema.nullable().optional(),
})
