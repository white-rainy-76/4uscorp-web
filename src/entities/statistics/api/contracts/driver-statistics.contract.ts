import { z } from 'zod'

export const DriverStatisticsDtoSchema = z.object({
  reportId: z.string().uuid(),
  driverId: z.string().uuid(),
  truckId: z.string().uuid(),
  driverName: z.string(),
  truckUnit: z.string(),
  stationPlanCount: z.number(),
  unSucssesStationPlanCount: z.number(),
})

export type DriverStatisticsDto = z.infer<typeof DriverStatisticsDtoSchema>
