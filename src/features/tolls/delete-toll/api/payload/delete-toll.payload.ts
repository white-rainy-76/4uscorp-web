import { z } from 'zod'

export const DeleteTollPayloadSchema = z.object({
  id: z.string().min(1, 'id_required'),
})

export type DeleteTollPayload = z.infer<typeof DeleteTollPayloadSchema>
