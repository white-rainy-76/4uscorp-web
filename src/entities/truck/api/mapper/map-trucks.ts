import { Truck } from '../types/truck'
import { TruckDto } from '../types/truck.dto'
import { mapTruck } from './map-truck'

export const mapTrucks = (rawTrucks: TruckDto[]): Truck[] => {
  return rawTrucks.map(mapTruck)
}
