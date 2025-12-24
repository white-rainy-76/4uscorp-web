import { z } from 'zod'

export const EditSavedRouteNamePayloadSchema = z.object({
  savedRouteId: z.string().uuid(),
  routeName: z.string().nullable(),
})

export type EditSavedRouteNamePayload = z.infer<
  typeof EditSavedRouteNamePayloadSchema
>
