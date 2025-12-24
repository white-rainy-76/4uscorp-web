'use client'

import { useMemo } from 'react'
import { Directions } from '@/features/directions/api'
import { convertRouteByIdToDirections } from '@/entities/route/lib/helpers/convert-route-by-id-to-directions'
import { RouteByIdData } from '@/entities/route'

type Params = {
  routeByIdData?: RouteByIdData
  directionsResponseData?: Directions
}

export function useCurrentDirections({
  routeByIdData,
  directionsResponseData,
}: Params) {
  const currentDirectionsData = useMemo<Directions | undefined>(() => {
    if (routeByIdData && !directionsResponseData) {
      return convertRouteByIdToDirections(routeByIdData)
    }
    return directionsResponseData
  }, [routeByIdData, directionsResponseData])

  return currentDirectionsData
}
