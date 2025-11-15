import { z } from 'zod'
import { FileResultSchema } from './file-result.contract'

export const PriceLoadAttemptSchema = z.object({
  id: z.string().uuid(),
  startedAt: z.string(),
  completedAt: z.string(),
  isSuccessful: z.boolean(),
  errorMessage: z.string().nullable(),
  totalFiles: z.number(),
  successfullyProcessedFiles: z.number(),
  failedFiles: z.number(),
  successRate: z.number(),
  processingDuration: z.string(),
  fileResults: z.array(FileResultSchema),
})

export const PriceLoadAttemptsResponseSchema = z.array(PriceLoadAttemptSchema)
