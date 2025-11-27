import { z } from 'zod'

export const DriverForTruckDtoSchema = z.object({
  id: z.string().uuid(),
  truckId: z.string().uuid(),
  fullName: z.string().nullable(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  bonus: z.number().int().nonnegative(),
  telegramLink: z.string().nullable(),
})

export const TruckDtoSchema = z.object({
  id: z.string(),
  providerTruckId: z.string().nullable().optional(),
  licensePlate: z.string().nullable().optional(),
  status: z.number().nullable().optional(),
  driverId: z.string().nullable().optional(),
  driver: z.nullable(DriverForTruckDtoSchema).optional(),
  name: z.string().nullable().optional(),
  vin: z.string().nullable().optional(),
  serial: z.string().nullable().optional(),
  make: z.string().nullable().optional(),
  model: z.string().nullable().optional(),
  harshAccelerationSettingType: z.string().nullable().optional(),
  year: z.string().nullable().optional(),
  createdAtTime: z.string(),
  updatedAtTime: z.string(),
  tankCapacityG: z.number(),
  overWeight: z.number(),
  poundPerGallon: z.number(),
})
