import z from 'zod'
import { authResponseSchema } from '../../api/contracts/auth.contract'

export type AuthResponse = z.infer<typeof authResponseSchema>
