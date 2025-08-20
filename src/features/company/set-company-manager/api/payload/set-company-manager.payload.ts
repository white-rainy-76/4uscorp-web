import { z } from 'zod'

export const SetCompanyManagerPayloadSchema = z.object({
  userId: z.string().uuid('Некорректный ID пользователя'),
  companyId: z.string().uuid('Некорректный ID компании'),
})

export type SetCompanyManagerPayload = z.infer<
  typeof SetCompanyManagerPayloadSchema
>
