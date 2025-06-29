import { Driver, Truck, TruckStatus } from '../types/truck'
import { TruckDto } from '../types/truck.dto'

const TRUCK_STATUS_MAP: Record<number, TruckStatus> = {
  0: 'INACTIVE',
  1: 'ACTIVE',
  2: 'IDLE',
}

export const mapTruck = (rawTruck: TruckDto): Truck => {
  const mappedDriver: Driver | null = rawTruck.driver
    ? {
        id: rawTruck.driver.id,
        fullName: rawTruck.driver.fullName,
        status: rawTruck.driver.status,
      }
    : null

  const truckStatus: TruckStatus =
    TRUCK_STATUS_MAP[rawTruck.status] ?? 'INACTIVE'

  return {
    id: rawTruck.id,
    providerTruckId: rawTruck.providerTruckId,
    licensePlate: rawTruck.licensePlate ? rawTruck.licensePlate : '',
    status: truckStatus,
    driverId: rawTruck.driverId,
    name: rawTruck.name,
    vin: rawTruck.vin,
    serial: rawTruck.serial ? rawTruck.serial : '',
    make: rawTruck.make,
    model: rawTruck.model,
    year: rawTruck.year,
    driver: mappedDriver,
  }
}
