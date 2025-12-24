import { z } from 'zod'

export const AddSavedRoutePayloadSchema = z.object({
  routeSectionId: z.string().uuid(),
})

export type AddSavedRoutePayload = z.infer<typeof AddSavedRoutePayloadSchema>
