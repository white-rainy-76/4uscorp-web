import { z } from 'zod'

export const UpdateDriverPayloadSchema = z.object({
  driverId: z.string().uuid('ID водителя обязателен'),
  fullName: z.string().min(1, 'Имя обязательно'),
  phone: z.string().min(1, 'Телефон обязателен'),
  email: z.string().email('Некорректный email'),
  telegramLink: z.string().url('Некорректная ссылка на Telegram').nullable(),
})

export type UpdateDriverPayload = z.infer<typeof UpdateDriverPayloadSchema>
