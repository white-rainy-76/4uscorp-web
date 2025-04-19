import { TruckStatus } from './truckStatus'

export interface Driver {
  id: string
  fullName: string
}

export interface Truck {
  id: string
  ulid: string
  licensePlate: string
  status: TruckStatus
  driverId: string
  driver: Driver | null
}
