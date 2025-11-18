import { z } from 'zod'

export const DeleteSavedRoutePayloadSchema = z.object({
  id: z.string().uuid(),
})

export type DeleteSavedRoutePayload = z.infer<
  typeof DeleteSavedRoutePayloadSchema
>
