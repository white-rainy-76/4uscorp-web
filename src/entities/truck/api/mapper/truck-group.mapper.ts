import { TruckGroup, TruckGroupDto } from '../../model'

export const mapTruckGroup = (data: TruckGroupDto): TruckGroup => ({
  id: data.id,
  truckGroupName: data.truckGroupName,
  weight: data.weight,
  fuelCapacity: data.fuelCapacity,
  trucksCount: data.trucksCount,
})

export const mapTruckGroups = (data: TruckGroupDto[]): TruckGroup[] => {
  return data.map(mapTruckGroup)
}




