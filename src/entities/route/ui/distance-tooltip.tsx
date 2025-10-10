import React from 'react'
import { AdvancedMarker } from '@vis.gl/react-google-maps'
import { useQuery } from '@tanstack/react-query'
import { routeQueries } from '../api'

interface DistanceTooltipProps {
  position: google.maps.LatLngLiteral
  routeSectionId: string
}

export const DistanceTooltip = ({
  position,
  routeSectionId,
}: DistanceTooltipProps) => {
  const { data: distanceData, isLoading } = useQuery({
    ...routeQueries.distance({
      routeSectionId,
      latitude: position.lat,
      longitude: position.lng,
    }),
    enabled: !!routeSectionId,
  })

  if (!distanceData && !isLoading) return null

  // Конвертируем метры в мили (1 метр = 0.000621371 мили)
  const distanceInMiles = distanceData ? distanceData.distance * 0.000621371 : 0

  return (
    <AdvancedMarker position={position}>
      <div
        style={{
          transform: 'translate(-50%, -100%)',
          marginBottom: '8px',
          backgroundColor: 'white',
          border: '1px solid #ccc',
          borderRadius: '4px',
          padding: '8px 12px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          whiteSpace: 'nowrap',
          zIndex: 1000,
          pointerEvents: 'none',
        }}>
        {isLoading ? (
          <span style={{ color: '#666' }}>Loading...</span>
        ) : (
          <span style={{ color: '#333', fontWeight: 'bold' }}>
            {distanceInMiles.toFixed(1)} mi
          </span>
        )}
      </div>
    </AdvancedMarker>
  )
}
