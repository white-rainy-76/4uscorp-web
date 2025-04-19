export interface DriverDto {
  id: string
  fullName: string
  status: string
}

export interface TruckDto {
  id: string
  ulid: string
  licensePlate: string
  status: string
  driverId: string
  driver?: DriverDto | null
}
