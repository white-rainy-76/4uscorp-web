import { z } from 'zod'
import { SetCompanyUserResponseSchema } from '../../api/contracts/set-company-user.contract'

export type SetCompanyUserResponse = z.infer<
  typeof SetCompanyUserResponseSchema
>
