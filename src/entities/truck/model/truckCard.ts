import { TruckStatus } from './truckStatus'

export interface TruckCard {
  avatarImage?: string
  unitNumber: string
  name: string
  fuelPercentage: number
  status: TruckStatus
  isActive: boolean
  setIsActive: () => void
}
