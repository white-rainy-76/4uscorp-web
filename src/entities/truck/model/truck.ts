import { TruckStatus } from './truckStatus'

export interface Driver {
  id: string
  fullName: string
  status: string
}

export interface Truck {
  id: string
  licensePlate: string
  status: TruckStatus
  driverId: string
  vin: string
  serial: string
  make: string
  model: string
  year: string
  driver?: Driver | null
}
