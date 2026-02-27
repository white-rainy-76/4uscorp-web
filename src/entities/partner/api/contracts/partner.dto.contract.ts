import { z } from 'zod'

export const PartnerDtoSchema = z.object({
  partnerId: z.string().uuid(),
  userId: z.string().uuid(),
  userName: z.string().nullable().optional(),
  fullName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  telegramLink: z.string().nullable().optional(),
  createdAt: z.string(),
})

export type PartnerDto = z.infer<typeof PartnerDtoSchema>
