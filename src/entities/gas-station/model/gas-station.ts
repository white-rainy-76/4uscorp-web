import { FuelPrice } from './fuel-price'

export interface GasStation {
  id: string
  name?: string
  position: { lat: number; lng: number }
  address?: string
  fuelPrice?: FuelPrice
}
