import {
  DriverForTruck,
  DriverForTruckDto,
  Truck,
  TruckStatus,
} from '../../model'
import { TruckDto } from '../../model'

const TRUCK_STATUS_MAP: Record<number, TruckStatus> = {
  0: 'INACTIVE',
  1: 'ACTIVE',
  2: 'IDLE',
}

const mapDriver = (rawDriver: DriverForTruckDto): DriverForTruck => {
  return {
    id: rawDriver.id,
    truckId: rawDriver.truckId,
    fullName: rawDriver.fullName,
    phone: rawDriver.phone,
    email: rawDriver.email,
    bonus: rawDriver.bonus,
    telegramLink: rawDriver.telegramLink,
  }
}

export const mapTruck = (rawTruck: TruckDto): Truck => {
  const mappedDriver: DriverForTruck | null = rawTruck.driver
    ? mapDriver(rawTruck.driver)
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
    tankCapacityG: rawTruck.tankCapacityG,
    overWeight: rawTruck.overWeight,
    poundPerGallon: rawTruck.poundPerGallon,
  }
}

export const mapTrucks = (rawTrucks: TruckDto[]): Truck[] => {
  return rawTrucks.map(mapTruck)
}
