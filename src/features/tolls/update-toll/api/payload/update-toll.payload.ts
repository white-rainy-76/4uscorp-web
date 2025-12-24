import { z } from 'zod'

export const UpdateTollPayloadSchema = z.object({
  name: z.string().min(1, 'name_required'),
  key: z.string().optional(),
  price: z.number().min(0, 'price_must_be_positive'),
  latitude: z.number().min(-90).max(90, 'latitude_invalid').optional(),
  longitude: z.number().min(-180).max(180, 'longitude_invalid').optional(),
  isDynamic: z.boolean().optional(),
  iPass: z.number().min(0, 'price_must_be_positive').optional(),
  iPassOvernight: z.number().min(0, 'price_must_be_positive').optional(),
  payOnline: z.number().min(0, 'price_must_be_positive').optional(),
  payOnlineOvernight: z.number().min(0, 'price_must_be_positive').optional(),
})

export type UpdateTollPayload = z.infer<typeof UpdateTollPayloadSchema>
