import z from 'zod'

export const signInPayloadSchema = z.object({
  userName: z.string(),
  password: z.string(),
})

export const signUpPayloadSchema = z.object({
  email: z.string(),
  userName: z.string(),
  password: z.string(),
})
