import { z } from 'zod'
import {
  GasStationDtoSchema,
  GetGasStationsResponseDtoSchema,
  FuelRouteInfoDtoSchema,
  FuelPlanDtoSchema,
} from '../../api/contracts/gas-station.dto.contract'

export type GasStationDto = z.infer<typeof GasStationDtoSchema>
export type GetGasStationsResponseDto = z.infer<
  typeof GetGasStationsResponseDtoSchema
>
export type FuelRouteInfoDto = z.infer<typeof FuelRouteInfoDtoSchema>
export type FuelPlanDto = z.infer<typeof FuelPlanDtoSchema>
