import { z } from 'zod'
import {
  FuelPriceSchema,
  GasStationSchema,
  GetGasStationsResponseSchema,
  FuelRouteInfoSchema,
  ValidationErrorSchema,
} from '../../api/contracts/gas-station.contract'

export type GasStation = z.infer<typeof GasStationSchema>
export type GetGasStationsResponse = z.infer<
  typeof GetGasStationsResponseSchema
>
export type FuelPrice = z.infer<typeof FuelPriceSchema>
export type FuelRouteInfo = z.infer<typeof FuelRouteInfoSchema>
export type ValidationError = z.infer<typeof ValidationErrorSchema>
