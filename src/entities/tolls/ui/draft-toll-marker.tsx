import React from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { Icon } from '@/shared/ui/Icon'

interface Props {
  position: { lat: number; lng: number }
}

export const DraftTollMarker: React.FC<Props> = ({ position }) => {
  if (!position || position.lat == null || position.lng == null) {
    return null
  }

  return (
    <AdvancedMarker position={position} zIndex={1500}>
      <div className="relative flex items-center justify-center">
        {/* Пульсирующее кольцо для draft маркера */}
        <div className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
        {/* Внешнее кольцо с градиентом */}
        <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 opacity-50 blur-sm" />
        {/* Кольцо свечения */}
        <div className="absolute -inset-1 rounded-full ring-2 ring-green-500/50 ring-offset-2 ring-offset-white shadow-lg shadow-green-500/30" />
        {/* Сам маркер */}
        <div className="relative rounded-full p-1.5 border-2 border-green-500 bg-gradient-to-br from-green-100 via-green-50 to-white shadow-xl shadow-green-500/40 flex items-center justify-center scale-110">
          <Icon
            name="common/dollar"
            width={16}
            height={16}
            className="text-green-700"
          />
          {/* Внутренняя тень для глубины */}
          <div className="absolute inset-0 rounded-full bg-white/20 pointer-events-none" />
        </div>
      </div>
    </AdvancedMarker>
  )
}
