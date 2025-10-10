import { z } from 'zod'

export const FileResultSchema = z.object({
  fileName: z.string(),
  isSuccess: z.boolean(),
  errorMessage: z.string().nullable(),
  processedAt: z.string(),
})

export const PriceLoadAttemptSchema = z.object({
  id: z.string().uuid(),
  startedAt: z.string(),
  completedAt: z.string().nullable(),
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

export type PriceFileResult = z.infer<typeof FileResultSchema>
export type PriceLoadAttempt = z.infer<typeof PriceLoadAttemptSchema>
export type PriceLoadAttemptsResponse = z.infer<
  typeof PriceLoadAttemptsResponseSchema
>
