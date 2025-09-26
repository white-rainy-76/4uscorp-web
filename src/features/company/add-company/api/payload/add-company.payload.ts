import { z } from 'zod'

export const AddCompanyPayloadSchema = z.object({
  name: z.string().min(1, 'company_name_required'),
  samsaraToken: z.string().min(1, 'samsara_token_required'),
})

export type AddCompanyPayload = z.infer<typeof AddCompanyPayloadSchema>
