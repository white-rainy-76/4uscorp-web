import { z } from 'zod'
import { FileResultSchema } from '../../api/contracts/file-result.contract'
import {
  PriceLoadAttemptSchema,
  PriceLoadAttemptsResponseSchema,
} from '../../api/contracts/price-load-attempt.contract'

export type PriceFileResult = z.infer<typeof FileResultSchema>
export type PriceLoadAttempt = z.infer<typeof PriceLoadAttemptSchema>
export type PriceLoadAttemptsResponse = z.infer<
  typeof PriceLoadAttemptsResponseSchema
>
