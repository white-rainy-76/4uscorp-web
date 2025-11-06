import { z } from 'zod'

export const UpdateTollPayloadSchema = z.object({
  name: z.string().min(1, 'name_required'),
  key: z.string().optional(),
  price: z.number().min(0, 'price_must_be_positive'),
  latitude: z.number().min(-90).max(90, 'latitude_invalid'),
  longitude: z.number().min(-180).max(180, 'longitude_invalid'),
  isDynamic: z.boolean().optional(),
})

export type UpdateTollPayload = z.infer<typeof UpdateTollPayloadSchema>
