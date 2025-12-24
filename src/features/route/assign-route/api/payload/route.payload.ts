import { z } from 'zod'

export const assignRoutePayloadSchema = z.object({
  routeId: z.string(),
  routeSectionId: z.string(),
  truckId: z.string(),
  fuelPlanId: z.string().optional().nullable(),
})
