import { z } from 'zod'

const privateConfigSchema = z.object({
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  SERVER: z.string().optional(),
})

export const privateConfig = privateConfigSchema.parse(process.env)
