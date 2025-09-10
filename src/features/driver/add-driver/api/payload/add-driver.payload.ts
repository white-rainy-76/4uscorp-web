import { z } from 'zod'

export const AddDriverPayloadSchema = z.object({
  name: z.string().min(1, 'name_required'),
  phone: z.string().min(1, 'phone_required'),
  email: z.string().email('invalid_email'),
  telegramLink: z.string().url('invalid_telegram_url').nullable(),
})

export type AddDriverPayload = z.infer<typeof AddDriverPayloadSchema>
