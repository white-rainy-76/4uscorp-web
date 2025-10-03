import { z } from 'zod'

export const FileResultSchema = z.object({
  fileName: z.string(),
  isSuccess: z.boolean(),
  errorMessage: z.string().nullable(),
  processedAt: z.string(),
})

export const ReportLoadAttemptSchema = z.object({
  id: z.string().uuid(),
  transactionReportFileId: z.string().uuid(),
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

export const ReportLoadAttemptsResponseSchema = z.array(ReportLoadAttemptSchema)

export type ReportFileResult = z.infer<typeof FileResultSchema>
export type ReportLoadAttempt = z.infer<typeof ReportLoadAttemptSchema>
export type ReportLoadAttemptsResponse = z.infer<
  typeof ReportLoadAttemptsResponseSchema
>
