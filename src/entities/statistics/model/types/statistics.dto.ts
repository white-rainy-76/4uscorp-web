export interface FuelRouteInfoDto {
  routeId: string
  startDate: string
  endDate: string
  orignName: string
  destinationName: string
  driveTime: number
  totalDistance: number
  gallons: number
  tolls: number
}

export interface FuelPlanStationDto {
  fuelStationId: string
  status: number
  planRefillGl: number
  address: string
  provider: string
  fuelBeforeRefillGl: number
  actualRefillGl: number
  wexRefillGl: number
  price: number
  stopOrder: number
}

export interface FuelPlanReportItemDto {
  fuelRouteInfo: FuelRouteInfoDto
  fuelPlanStations: FuelPlanStationDto[]
}

export interface StatisticsResponseDto {
  fuelPlanReportItems: FuelPlanReportItemDto[]
}
