import { z } from 'zod'
import {
  GasStationDtoSchema,
  GetGasStationsResponseDtoSchema,
} from '../../api/contracts/gas-station.dto.contract'

export type GasStationDto = z.infer<typeof GasStationDtoSchema>
export type GetGasStationsResponseDto = z.infer<
  typeof GetGasStationsResponseDtoSchema
>
