import { z } from 'zod'

export enum FuelPlanOperation {
  Add = 1,
  Remove = 2,
  Update = 3,
}

export const FuelStationChangeSchema = z.object({
  fuelStationId: z.string(),
  newRefill: z.number().nullable(),
})

export const FuelPlanChangePayloadSchema = z.object({
  routeSectionId: z.string(),
  currentFuelPercent: z.number(),
  fuelStationChange: FuelStationChangeSchema,
  operation: z.nativeEnum(FuelPlanOperation),
})

export const StepResultSchema = z.object({
  stationId: z.string(),
  fuelBefore: z.number(),
  fuelAfter: z.number(),
  refillAmount: z.number(),
  distance: z.number(),
  meetsReserveRequirement: z.boolean(),
  notes: z.string().nullable(),
  isValid: z.boolean(),
  insufficientFuelReserve: z.boolean(),
  insufficientRefillAmount: z.boolean(),
  tankCapacityExceeded: z.boolean(),
  insufficientFuelToFinish: z.boolean(),
  distanceTooClose: z.boolean(),
  stationsNotOrdered: z.boolean(),
  requiredFuelReserve: z.number(),
  actualFuelReserve: z.number(),
  requiredRefillAmount: z.number(),
  actualRefillAmount: z.number(),
  maxTankCapacity: z.number(),
  attemptedRefill: z.number(),
  requiredFuelToFinish: z.number(),
  actualFuelAtFinish: z.number(),
  minRequiredDistance: z.number(),
  actualDistance: z.number(),
  previousStationDistance: z.number(),
  currentStationDistance: z.number(),
})

export const FuelPlanChangeResponseSchema = z.object({
  isValid: z.boolean(),
  changes: z.array(
    z.object({
      fuelStationId: z.string(),
      originalRefill: z.number(),
      newRefill: z.number(),
      originalCurrentFuel: z.number(),
      newCurrentFuel: z.number(),
      isAlgo: z.boolean(),
      isManual: z.boolean(),
      status: z.string().nullable(),
    }),
  ),
  stepResults: z.array(StepResultSchema),
})

export type FuelPlanChangePayload = z.infer<typeof FuelPlanChangePayloadSchema>
export type FuelPlanChangeResponse = z.infer<
  typeof FuelPlanChangeResponseSchema
>
export type StepResult = z.infer<typeof StepResultSchema>
export type FuelStationChange = z.infer<typeof FuelStationChangeSchema>
