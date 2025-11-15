import { TruckUnit, TruckUnitDto } from '../../model/types/truck-unit'

export const mapTruckUnit = (dto: TruckUnitDto): TruckUnit => {
  return {
    truckId: dto.truckId,
    unit: dto.unit,
  }
}

export const mapTruckUnits = (dtos: TruckUnitDto[]): TruckUnit[] => {
  return dtos.map(mapTruckUnit)
}
