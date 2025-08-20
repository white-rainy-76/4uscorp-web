import { z } from 'zod'

export const AddDriverPayloadSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  phone: z.string().min(1, 'Телефон обязателен'),
  email: z.string().email('Некорректный email'),
  telegramLink: z.string().url('Некорректная ссылка на Telegram').nullable(),
})

export type AddDriverPayload = z.infer<typeof AddDriverPayloadSchema>
