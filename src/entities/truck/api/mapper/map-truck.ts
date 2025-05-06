import { rawTruckStatusToTruckStatus } from '../../lib/convert-string-to-truck-status'
import { Driver, Truck } from '../../model/truck'
import { TruckDto } from '../dto/truck.dto'

export const mapTrucks = (rawTrucks: TruckDto[]): Truck[] => {
  return rawTrucks.map((rawTruck) => {
    const mappedDriver: Driver | null = rawTruck.driver
      ? {
          id: rawTruck.driver.id,
          fullName: rawTruck.driver.fullName,
          status: rawTruck.driver.status,
        }
      : null
    return {
      id: rawTruck.id,
      licensePlate: rawTruck.licensePlate,
      status: rawTruckStatusToTruckStatus(rawTruck.status),
      driverId: rawTruck.driverId,
      vin: rawTruck.vin,
      serial: rawTruck.serial,
      make: rawTruck.make,
      model: rawTruck.model,
      year: rawTruck.year,
      driver: mappedDriver,
    }
  })
}
