import { apiClient } from '@/shared/api/base'
import { RouteRequestPayload } from './payload/directions.payload'
import { Directions } from '../model/directions'

export const getDirections = async ({
  origin,
  destination,
}: RouteRequestPayload): Promise<Directions> => {
  const result = await apiClient.post<Directions>(
    `/fuelroutes-api/FuelRoute/create-fuel-route`,
    { origin, destination },
  )
  return result
}
