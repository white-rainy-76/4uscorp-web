import React from 'react'
import { Polyline } from '@/shared/ui'
import { TollRoad } from '../model/types/roads'

interface TollRoadPolylineProps {
  road: TollRoad
  isSelected?: boolean
  onClick?: (e?: google.maps.MapMouseEvent) => void
}

export const TollRoadPolyline: React.FC<TollRoadPolylineProps> = ({
  road,
  isSelected = false,
  onClick,
}) => {
  if (isSelected) {
    return (
      <>
        {/* Белая обводка (толще) */}
        <Polyline
          key={`${road.id}-outline`}
          path={road.coordinates}
          strokeColor="#FFFFFF"
          strokeOpacity={1}
          strokeWeight={8}
          zIndex={19}
          onClick={(e) => onClick?.(e)}
        />
        {/* Основная цветная линия (тоньше) */}
        <Polyline
          key={road.id}
          path={road.coordinates}
          strokeColor="#4A90E2"
          strokeOpacity={1}
          strokeWeight={5}
          zIndex={20}
          onClick={(e) => onClick?.(e)}
        />
      </>
    )
  }

  return (
    <Polyline
      key={road.id}
      path={road.coordinates}
      strokeColor="#4A90E2"
      strokeOpacity={0.8}
      strokeWeight={4}
      zIndex={5}
      onClick={(e) => onClick?.(e)}
    />
  )
}
