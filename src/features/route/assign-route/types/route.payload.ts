import { z } from 'zod'

import { assignRoutePayloadSchema } from '../api/payload/route.payload'

export type AssignRoutePayload = z.infer<typeof assignRoutePayloadSchema>
