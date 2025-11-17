import { z } from 'zod'

const RequiredFuelStationPayloadSchema = z.object({
  stationId: z.string(),
  refillLiters: z.number().min(0),
})

export const GetGasStationsPayloadSchema = z.object({
  routeId: z.string(),
  routeSectionIds: z.array(z.string()),
  requiredFuelStations: z.array(RequiredFuelStationPayloadSchema).optional(),
  FinishFuel: z.number().optional(),
  Weight: z.number().optional(),
  FuelProviderNameList: z.array(z.string()).optional(),
  CurrentFuel: z.string().optional(),
  TankCapacityG: z.number().optional(),
})
