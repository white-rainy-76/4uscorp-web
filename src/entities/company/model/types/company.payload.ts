import { z } from 'zod'
import { CreateCompanyPayloadSchema } from '../../api/payload/company.payload'

export type CreateCompanyPayload = z.infer<typeof CreateCompanyPayloadSchema>
