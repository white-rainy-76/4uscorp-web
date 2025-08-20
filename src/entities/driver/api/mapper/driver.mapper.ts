import { Driver, DriverDto, TruckInfo, TruckInfoDto } from '../../model'

const mapTruck = (rawTruck: TruckInfoDto): TruckInfo => {
  return {
    id: rawTruck.id ? rawTruck.id : null,
    unitNumber: rawTruck.unitNumber ? rawTruck.unitNumber : null,
    vin: rawTruck.vin ? rawTruck.vin : null,
  }
}

export const mapDriver = (rawDriver: DriverDto): Driver => {
  const mappedTruckInfo: TruckInfo | null = rawDriver.truck
    ? mapTruck(rawDriver.truck)
    : null

  return {
    id: rawDriver.id,
    fullName: rawDriver.fullName,
    phone: rawDriver.phone,
    email: rawDriver.email,
    bonus: rawDriver.bonus,
    telegramLink: rawDriver.telegramLink,
    truck: mappedTruckInfo,
  }
}

export const mapDrivers = (rawTrucks: DriverDto[]): Driver[] => {
  return rawTrucks.map(mapDriver)
}
