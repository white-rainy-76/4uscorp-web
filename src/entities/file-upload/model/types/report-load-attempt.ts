import { z } from 'zod'
import {
  FileResultSchema,
  ReportLoadAttemptSchema,
  ReportLoadAttemptsResponseSchema,
} from '../../api/contracts/report-load-attempt.contract'

export type ReportFileResult = z.infer<typeof FileResultSchema>
export type ReportLoadAttempt = z.infer<typeof ReportLoadAttemptSchema>
export type ReportLoadAttemptsResponse = z.infer<
  typeof ReportLoadAttemptsResponseSchema
>
