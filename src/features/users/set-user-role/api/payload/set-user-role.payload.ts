import { z } from 'zod'

export const SetUserRolePayloadSchema = z.object({
  userId: z.string().uuid('invalid_user_id'),
  roleName: z.string().min(1, 'invalid_role_name'),
})

export type SetUserRolePayload = z.infer<typeof SetUserRolePayloadSchema>
