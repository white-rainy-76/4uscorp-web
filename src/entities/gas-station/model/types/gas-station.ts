import { z } from 'zod'
import {
  FuelPriceSchema,
  GasStationSchema,
  GetGasStationsResponseSchema,
} from '../../api/contracts/gas-station.contract'

export type GasStation = z.infer<typeof GasStationSchema>
export type GetGasStationsResponse = z.infer<
  typeof GetGasStationsResponseSchema
>
export type FuelPrice = z.infer<typeof FuelPriceSchema>
