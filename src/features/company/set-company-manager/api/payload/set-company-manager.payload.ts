import { z } from 'zod'

export const SetCompanyManagerPayloadSchema = z.object({
  userId: z.string().uuid('invalid_user_id'),
  companyId: z.string().uuid('invalid_company_id'),
})

export type SetCompanyManagerPayload = z.infer<
  typeof SetCompanyManagerPayloadSchema
>
