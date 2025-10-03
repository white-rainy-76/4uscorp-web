import { z } from 'zod'

export const FuelRouteInfoDtoSchema = z.object({
  routeId: z.string().uuid(),
  startDate: z.string(),
  endDate: z.string(),
  orignName: z.string(), // Опечатка в API, сохраняем как есть
  destinationName: z.string(),
  driveTime: z.number(),
  totalDistance: z.number(),
  gallons: z.number(),
  tolls: z.number(),
})

export const FuelPlanStationDtoSchema = z.object({
  fuelStationId: z.string().uuid(),
  status: z.number(),
  planRefillGl: z.number(),
  address: z.string(),
  provider: z.string(),
  fuelBeforeRefillGl: z.number(),
  actualRefillGl: z.number(),
  wexRefillGl: z.number(),
  price: z.number(),
  stopOrder: z.number(),
})

export const FuelPlanReportItemDtoSchema = z.object({
  fuelRouteInfo: FuelRouteInfoDtoSchema,
  fuelPlanStations: z.array(FuelPlanStationDtoSchema),
})

export const StatisticsResponseDtoSchema = z.object({
  fuelPlanReportItems: z.array(FuelPlanReportItemDtoSchema),
})

export type FuelRouteInfoDto = z.infer<typeof FuelRouteInfoDtoSchema>
export type FuelPlanStationDto = z.infer<typeof FuelPlanStationDtoSchema>
export type FuelPlanReportItemDto = z.infer<typeof FuelPlanReportItemDtoSchema>
export type StatisticsResponseDto = z.infer<typeof StatisticsResponseDtoSchema>
