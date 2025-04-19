import { apiClient } from '@/shared/api/base'
import { Truck } from '../model/truck'
import { TruckDto } from './dto/truck.dto'
import { mapTrucks } from './mapper/map-truck'

export const getTrucks = async (): Promise<Truck[]> => {
  const result = await apiClient.get<TruckDto[]>(`/api/Trucks/get-truck-list`)
  return mapTrucks(result)
}
