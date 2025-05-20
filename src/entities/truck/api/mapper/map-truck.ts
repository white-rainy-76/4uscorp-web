import { Driver, Truck, TruckStatus } from '../types/truck'
import { TruckDto } from '../types/truck.dto'

const statusMap: Record<string, TruckStatus> = {
  Available: 'AVAILABLE',
  EnRoute: 'EN_ROUTE',
  Maintenance: 'MAINTENANCE',
}

export const mapTruck = (rawTruck: TruckDto): Truck => {
  const mappedDriver: Driver | null = rawTruck.driver
    ? {
        id: rawTruck.driver.id,
        fullName: rawTruck.driver.fullName,
        status: rawTruck.driver.status,
      }
    : null

  return {
    id: rawTruck.id,
    providerTruckId: rawTruck.providerTruckId,
    licensePlate: rawTruck.licensePlate ? rawTruck.licensePlate : '',
    status: statusMap[rawTruck.status] ?? 'INACTIVE',
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
