import { z } from 'zod'

export const DriverDtoSchema = z.object({
  id: z.string().uuid(),
  truckId: z.string().uuid(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  bonus: z.number().int().nonnegative(),
  telegramLink: z.string(),
})

export const TruckDtoSchema = z.object({
  id: z.string(),
  providerTruckId: z.string(),
  licensePlate: z.string().nullable(),
  status: z.number(),
  driverId: z.string(),
  driver: z.nullable(DriverDtoSchema).optional(),
  name: z.string(),
  vin: z.string(),
  serial: z.string().nullable(),
  make: z.string(),
  model: z.string(),
  harshAccelerationSettingType: z.string(),
  year: z.string(),
  createdAtTime: z.string(),
  updatedAtTime: z.string(),
})
