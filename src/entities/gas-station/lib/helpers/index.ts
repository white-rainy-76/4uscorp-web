'use client'

import { GasStation } from '@/entities/gas-station'
import { RouteByIdData } from '@/entities/route'

type GasStationsData = { fuelStations?: GasStation[] } | undefined

export function combineGasStations(
  apiData: GasStationsData,
  routeByIdData?: RouteByIdData,
): GasStation[] | undefined {
  if (apiData?.fuelStations && apiData.fuelStations.length > 0) {
    return apiData.fuelStations
  }
  // Fallback to routeByIdData stations before get-gas-stations arrives
  if (routeByIdData?.fuelStations && routeByIdData.fuelStations.length > 0) {
    return routeByIdData.fuelStations
  }
  return undefined
}
