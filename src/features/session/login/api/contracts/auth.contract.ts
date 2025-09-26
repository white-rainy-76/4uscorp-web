import z from 'zod'

export const authResponseSchema = z.object({
  userId: z.string(),
  token: z.string(),
})
