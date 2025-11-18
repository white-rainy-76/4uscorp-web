import { z } from 'zod'

export const EditSavedRoutePayloadSchema = z.object({
  savedRouteId: z.string().uuid(),
  routeSectionId: z.string().uuid(),
})

export type EditSavedRoutePayload = z.infer<typeof EditSavedRoutePayloadSchema>
