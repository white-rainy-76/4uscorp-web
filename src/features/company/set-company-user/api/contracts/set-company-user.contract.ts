import { z } from 'zod'

export const SetCompanyUserResponseSchema = z.string()

export type SetCompanyUserResponse = z.infer<
  typeof SetCompanyUserResponseSchema
>
