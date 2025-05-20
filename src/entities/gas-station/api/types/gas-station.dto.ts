import { z } from 'zod'
import { GasStationDtoSchema } from '../contracts/gas-station.contract.dto'

export type GasStationDto = z.infer<typeof GasStationDtoSchema>
