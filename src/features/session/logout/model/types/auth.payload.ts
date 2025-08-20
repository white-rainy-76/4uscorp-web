import { z } from 'zod'
import {
  signInPayloadSchema,
  signUpPayloadSchema,
} from '../../api/payload/auth.payload'

export type SignInPayload = z.infer<typeof signInPayloadSchema>
export type SignUpPayload = z.infer<typeof signUpPayloadSchema>
