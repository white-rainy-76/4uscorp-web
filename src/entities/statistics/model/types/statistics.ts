export interface FuelRouteInfo {
  routeId: string
  startDate: string
  endDate: string
  originName: string
  destinationName: string
  driveTime: number
  totalDistance: number
  gallons: number
  tolls: number
}

export interface FuelPlanStation {
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

export interface FuelPlanReportItem {
  fuelRouteInfo: FuelRouteInfo
  fuelPlanStation: FuelPlanStation[]
}

export interface Statistics {
  fuelPlanReportItems: FuelPlanReportItem[]
}
