import { z } from 'zod'
import {
  FuelPriceSchema,
  GasStationSchema,
  GetGasStationsResponseSchema,
  FuelRouteInfoSchema,
} from '../../api/contracts/gas-station.contract'

export type GasStation = z.infer<typeof GasStationSchema>
export type GetGasStationsResponse = z.infer<
  typeof GetGasStationsResponseSchema
>
export type FuelPrice = z.infer<typeof FuelPriceSchema>
export type FuelRouteInfo = z.infer<typeof FuelRouteInfoSchema>
