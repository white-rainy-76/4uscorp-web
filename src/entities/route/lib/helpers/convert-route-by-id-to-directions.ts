'use client'

import { Directions } from '@/features/directions/api'
import { convertCoordinateToPair } from '@/shared/lib/coordinates'
import { RouteByIdData } from '@/entities/route'

export function convertRouteByIdToDirections(
  routeByIdData: RouteByIdData,
): Directions {
  return {
    routeId: routeByIdData.routeId,
    route: [
      {
        routeSectionId: routeByIdData.sectionId,
        mapPoints: routeByIdData.mapPoints.map(convertCoordinateToPair),
        routeInfo: routeByIdData.routeInfo,
      },
    ],
    waypoints: routeByIdData.viaPoints?.map((viaPoint) => ({
      latitude: viaPoint.latitude,
      longitude: viaPoint.longitude,
      stopOrder: viaPoint.stopOrder,
    })),
  }
}
