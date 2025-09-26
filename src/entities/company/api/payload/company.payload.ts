import { z } from 'zod'

export const CreateCompanyPayloadSchema = z.object({
  name: z.string(),
  samsaraToken: z.string(),
})
