import { rawTruckStatusToTruckStatus } from '../../lib/convertStringToTruckStatus'
import { Driver, Truck } from '../../model/truck'

import { TruckDto } from '../dto/truck.dto'

export const mapTrucks = (rawTrucks: TruckDto[]): Truck[] => {
  return rawTrucks.map((rawTruck) => {
    const mappedDriver: Driver | null = rawTruck.driver
      ? {
          id: rawTruck.driver.id,
          fullName: rawTruck.driver.fullName,
        }
      : null

    return {
      id: rawTruck.id,
      ulid: rawTruck.ulid,
      licensePlate: rawTruck.licensePlate,
      status: rawTruckStatusToTruckStatus(rawTruck.status),
      driverId: rawTruck.driverId,
      driver: mappedDriver,
    }
  })
}
