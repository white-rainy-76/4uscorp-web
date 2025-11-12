import { z } from 'zod'
import { UserSchema } from '../../api/contracts/user.contract'

export type User = z.infer<typeof UserSchema>
