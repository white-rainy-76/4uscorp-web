export interface DriverDto {
  id: string
  fullName: string
  status: string
}

export interface TruckDto {
  id: string
  providerTruckId: string
  ulid: string
  licensePlate: string
  status: string
  driverId: string
  driver?: DriverDto | null
  name: string
  vin: string
  serial: string
  make: string
  model: string
  harshAccelerationSettingType: string
  year: string
  createdAtTime: string // ISO string
  updatedAtTime: string // ISO string
}
