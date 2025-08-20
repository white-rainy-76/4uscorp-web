import { z } from 'zod'

export const AddCompanyPayloadSchema = z.object({
  name: z.string().min(1, 'Название компании обязательно'),
  samsaraToken: z.string().min(1, 'Samsara токен обязателен'),
})

export type AddCompanyPayload = z.infer<typeof AddCompanyPayloadSchema>
