import { z } from 'zod'

const RequiredFuelStationPayloadSchema = z.object({
  stationId: z.string(),
  refillLiters: z.number().min(0),
})

export const UpdateGasStationsPayloadSchema = z.object({
  routeId: z.string(),
  routeSectionIds: z.array(z.string()),
  requiredFuelStations: z.array(RequiredFuelStationPayloadSchema).optional(),
})
