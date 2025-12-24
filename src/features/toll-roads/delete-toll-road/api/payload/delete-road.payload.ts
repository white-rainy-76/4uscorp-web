import { z } from 'zod'

export const DeleteTollRoadPayloadSchema = z.object({
  id: z.string().uuid(),
})

export type DeleteTollRoadPayload = z.infer<typeof DeleteTollRoadPayloadSchema>
