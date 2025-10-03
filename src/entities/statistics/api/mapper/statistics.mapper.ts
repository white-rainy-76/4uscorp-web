import {
  StatisticsResponseDto,
  FuelPlanReportItemDto,
  FuelRouteInfoDto,
  FuelPlanStationDto,
} from '../../model/types/statistics.dto'
import {
  Statistics,
  FuelPlanReportItem,
  FuelRouteInfo,
  FuelPlanStation,
} from '../../model/types/statistics'

export function mapFuelRouteInfo(dto: FuelRouteInfoDto): FuelRouteInfo {
  return {
    routeId: dto.routeId,
    startDate: dto.startDate,
    endDate: dto.endDate,
    originName: dto.orignName, // Исправляем опечатку в DTO
    destinationName: dto.destinationName,
    driveTime: Math.round(dto.driveTime / 3600), // Convert seconds to hours
    totalDistance: Math.round(dto.totalDistance * 0.000621371), // Convert meters to miles
    gallons: Math.round(dto.gallons),
    tolls: dto.tolls,
  }
}

export function mapFuelPlanStation(dto: FuelPlanStationDto): FuelPlanStation {
  return {
    fuelStationId: dto.fuelStationId,
    status: dto.status,
    planRefillGl: Math.round(dto.planRefillGl),
    address: dto.address,
    provider: dto.provider,
    fuelBeforeRefillGl: Math.round(dto.fuelBeforeRefillGl),
    actualRefillGl: Math.round(dto.actualRefillGl),
    wexRefillGl: Math.round(dto.wexRefillGl),
    price: dto.price,
    stopOrder: dto.stopOrder,
  }
}

export function mapFuelPlanReportItem(
  dto: FuelPlanReportItemDto,
): FuelPlanReportItem {
  return {
    fuelRouteInfo: mapFuelRouteInfo(dto.fuelRouteInfo),
    fuelPlanStation: dto.fuelPlanStations.map(mapFuelPlanStation),
  }
}

export function mapStatistics(dto: StatisticsResponseDto): Statistics {
  return {
    fuelPlanReportItems: dto.fuelPlanReportItems.map(mapFuelPlanReportItem),
  }
}
