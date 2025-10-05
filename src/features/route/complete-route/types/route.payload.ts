import { z } from 'zod'

import { completeRoutePayloadSchema } from '../payload/route.payload'

export type CompleteRoutePayload = z.infer<typeof completeRoutePayloadSchema>
