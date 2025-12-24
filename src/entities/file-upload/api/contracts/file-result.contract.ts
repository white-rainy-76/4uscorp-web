import { z } from 'zod'

export const FileResultSchema = z.object({
  fileName: z.string(),
  isSuccess: z.boolean(),
  errorMessage: z.string().nullable(),
  processedAt: z.string(),
})
