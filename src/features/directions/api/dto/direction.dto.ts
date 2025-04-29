import { GasStationDto } from '@/entities/gas-station/api/dto/gas-station.dto'
import { Route } from '../../model'

export interface DirectionsDto {
  responseId: string
  routeDtos: Route[]
  fuelStationDtos: GasStationDto[]
}
