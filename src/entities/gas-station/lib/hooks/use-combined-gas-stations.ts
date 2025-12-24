'use client'

import { useMemo } from 'react'
import { GasStation } from '@/entities/gas-station'
import { combineGasStations } from '@/entities/gas-station/lib/helpers'
import { RouteByIdData } from '@/entities/route'

type GasStationsApiData = { fuelStations?: GasStation[] } | undefined

export function useCombinedGasStations(
  gasStationsData: GasStationsApiData,
  routeByIdData?: RouteByIdData,
) {
  return useMemo(
    () => combineGasStations(gasStationsData, routeByIdData),
    [gasStationsData, routeByIdData],
  )
}
