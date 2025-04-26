import { apiClient } from '@/shared/api/base'
import { Point } from '../model'
import { PointRequestPayload } from './payload/directions.payload'

export const getNearestDropPoint = async ({
  latitude,
  longitude,
}: PointRequestPayload): Promise<Point> => {
  const result = await apiClient.post<Point>(
    `/fuelroutes-api/FuelRoute/drop-point-V2`,
    { latitude, longitude },
  )
  return result
}
