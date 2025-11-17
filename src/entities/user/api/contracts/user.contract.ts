import { z } from 'zod'

export const UserSchema = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  email: z.string().email(),
  userName: z.string(),
  roles: z.array(z.string()),
})

export type User = z.infer<typeof UserSchema>

