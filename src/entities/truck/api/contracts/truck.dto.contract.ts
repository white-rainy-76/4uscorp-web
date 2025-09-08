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
  providerTruckId: z.string(),
  licensePlate: z.string().nullable(),
  status: z.number(),
  driverId: z.string(),
  driver: z.nullable(DriverForTruckDtoSchema).optional(),
  name: z.string(),
  vin: z.string(),
  serial: z.string().nullable(),
  make: z.string(),
  model: z.string(),
  harshAccelerationSettingType: z.string(),
  year: z.string(),
  createdAtTime: z.string(),
  updatedAtTime: z.string(),
  tankCapacityG: z.number(),
  overWeight: z.number(),
  poundPerGallon: z.number(),
})
