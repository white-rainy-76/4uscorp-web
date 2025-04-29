import { TruckStatus } from '../model/truckStatus'

export const rawTruckStatusToTruckStatus = (rawStatus: string): TruckStatus => {
  switch (rawStatus) {
    case 'Available':
      return TruckStatus.AVAILABLE
    case 'Active':
      return TruckStatus.ACTIVE
    case 'InActive':
      return TruckStatus.INACTIVE
    default:
      return TruckStatus.INACTIVE
  }
}
