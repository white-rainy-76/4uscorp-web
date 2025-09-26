import { z } from 'zod'

export const AttachDetachDriverResponseSchema = z.void()

export type AttachDetachDriverResponse = z.infer<
  typeof AttachDetachDriverResponseSchema
>




