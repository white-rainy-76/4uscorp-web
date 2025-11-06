import React from 'react'
import { Polyline } from '@/shared/ui'
import { Road } from '../model/types/roads'

interface Props {
  road: Road
}

export const RoadPolyline: React.FC<Props> = ({ road }) => {
  const isToll = road.isToll ?? false
  const strokeColor = isToll ? '#FF6B6B' : '#4A90E2'
  const strokeWeight = isToll ? 4 : 3
  if (road.name === 'I-10 Express Lanes') {
    console.log(road.id)
  }
  return (
    <Polyline
      key={road.id}
      path={road.coordinates}
      strokeColor={strokeColor}
      strokeOpacity={0.8}
      strokeWeight={strokeWeight}
      zIndex={isToll ? 5 : 1}
    />
  )
}
