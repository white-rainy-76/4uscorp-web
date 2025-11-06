import { z } from 'zod'

export const SaveBestFuelRoutePayloadSchema = z.object({
  routeSectionId: z.string().min(1, 'routeSectionId_required'),
})

export type SaveBestFuelRoutePayload = z.infer<
  typeof SaveBestFuelRoutePayloadSchema
>
