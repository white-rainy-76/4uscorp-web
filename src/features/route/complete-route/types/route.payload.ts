import { z } from 'zod'

import { completeRoutePayloadSchema } from '../api/payload/route.payload'

export type CompleteRoutePayload = z.infer<typeof completeRoutePayloadSchema>
