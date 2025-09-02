import React from 'react'
import { Polyline } from '@/shared/ui/map'

interface RoutePolylinesProps {
  mainRoute: google.maps.LatLngLiteral[]
  alternativeRoutes: google.maps.LatLngLiteral[][]
  routeSectionIds: string[]
  onHover: (e: google.maps.MapMouseEvent, routeSectionId: string) => void
  onHoverOut: () => void
  onAltRouteClick: (index: number) => void
}

export const RoutePolylines = ({
  mainRoute,
  alternativeRoutes,
  routeSectionIds,
  onHover,
  onHoverOut,
  onAltRouteClick,
}: RoutePolylinesProps) => {
  return (
    <>
      {mainRoute.length > 0 && (
        <Polyline
          path={mainRoute}
          strokeColor="#0000FF"
          strokeOpacity={0.8}
          strokeWeight={10}
          onMouseMove={(e) => onHover(e, routeSectionIds[0] || '')}
          onMouseOut={onHoverOut}
        />
      )}
      {alternativeRoutes.map((altRoute, index) => (
        <Polyline
          key={`alt-route-${index}`}
          path={altRoute}
          strokeColor="#141414"
          strokeOpacity={0.5}
          strokeWeight={3}
          onMouseMove={(e) => onHover(e, routeSectionIds[index + 1] || '')}
          onMouseOut={onHoverOut}
          onClick={() => onAltRouteClick(index)}
        />
      ))}
    </>
  )
}
