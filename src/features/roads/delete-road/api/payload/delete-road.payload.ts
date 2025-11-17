import { z } from 'zod'

export const DeleteRoadPayloadSchema = z.object({
  id: z.string().uuid(),
})

export type DeleteRoadPayload = z.infer<typeof DeleteRoadPayloadSchema>
