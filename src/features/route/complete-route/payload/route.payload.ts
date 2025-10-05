import { z } from 'zod'

export const completeRoutePayloadSchema = z.object({
  routeId: z.string(),
})
