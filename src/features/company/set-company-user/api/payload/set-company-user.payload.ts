import { z } from 'zod'

export const SetCompanyUserPayloadSchema = z.object({
  userId: z.string().uuid(),
  companyId: z.string().uuid(),
})

export type SetCompanyUserPayload = z.infer<typeof SetCompanyUserPayloadSchema>
