import { apiClient } from '@/shared/api/base'
import { RouteRequestPayload } from './payload/directions.payload'
import { Directions } from '../model'
import { mapGasStations } from '@/entities/gas-station/api/mapper/map-gas-stations'
import { DirectionsDto } from './dto/direction.dto'

export const getDirections = async ({
  origin,
  destination,
  ViaPoints,
}: RouteRequestPayload): Promise<Directions> => {
  const resultDto = await apiClient.post<DirectionsDto>(
    `/fuelroutes-api/FuelRoute/create-fuel-route`,
    { origin, destination, ViaPoints },
  )
  const directions: Directions = {
    responseId: resultDto.responseId,
    routeDtos: resultDto.routeDtos,
    gasStations: mapGasStations(resultDto.fuelStationDtos),
  }

  return directions
}
