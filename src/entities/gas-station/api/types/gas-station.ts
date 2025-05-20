import { z } from 'zod'
import {
  FuelPriceSchema,
  GasStationSchema,
} from '../contracts/gas-station.contract'

export type GasStation = z.infer<typeof GasStationSchema>
export type FuelPrice = z.infer<typeof FuelPriceSchema>
