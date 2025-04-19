import { TruckStatus } from '../model/truckStatus'

export const rawTruckStatusToTruckStatus = (rawStatus: string): TruckStatus => {
  switch (rawStatus) {
    case 'IDLE':
      return TruckStatus.IDLE
    case 'EN_ROUTE':
      return TruckStatus.EN_ROUTE
    case 'LOADING':
      return TruckStatus.LOADING
    case 'ARRIVED':
      return TruckStatus.ARRIVED
    case 'MAINTENANCE':
      return TruckStatus.MAINTENANCE
    default:
      return TruckStatus.IDLE
  }
}
