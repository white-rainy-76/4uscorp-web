import { z } from 'zod'

export const DriverDtoSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  status: z.string(),
})

export const TruckDtoSchema = z.object({
  id: z.string(),
  providerTruckId: z.string(),
  licensePlate: z.string().nullable(),
  status: z.string(),
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
