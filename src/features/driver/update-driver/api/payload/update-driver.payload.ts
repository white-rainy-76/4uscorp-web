import { z } from 'zod'

export const UpdateDriverPayloadSchema = z.object({
  driverId: z.string().uuid('driver_id_required'),
  fullName: z.string().min(1, 'name_required'),
  phone: z.string().min(1, 'phone_required'),
  email: z.string().email('invalid_email'),
  telegramLink: z.string().url('invalid_telegram_url').nullable(),
})

export type UpdateDriverPayload = z.infer<typeof UpdateDriverPayloadSchema>
