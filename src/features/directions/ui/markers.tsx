// features/directions/components/RouteMarkers.tsx
import React from 'react'
import { Marker } from '@vis.gl/react-google-maps'
import { GetDistanceData } from '@/entities/route'
import { DistanceTooltip } from './distance-tooltip'

interface RouteMarkersProps {
  hoverMarker: google.maps.LatLngLiteral | null
  wayPoints: google.maps.LatLngLiteral[]
  startMarker: google.maps.LatLngLiteral | null
  endMarker: google.maps.LatLngLiteral | null
  distanceData?: GetDistanceData
  isDistanceLoading?: boolean
  onMarkerDragStart: () => void
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void
  onExistingMarkerDragEnd: (index: number, e: google.maps.MapMouseEvent) => void
}

export const RouteMarkers = ({
  hoverMarker,
  wayPoints,
  startMarker,
  endMarker,
  distanceData,
  isDistanceLoading,
  onMarkerDragStart,
  onMarkerDragEnd,
  onExistingMarkerDragEnd,
}: RouteMarkersProps) => {
  return (
    <>
      {hoverMarker && (
        <>
          <Marker
            position={hoverMarker}
            draggable
            onDragStart={onMarkerDragStart}
            onDragEnd={onMarkerDragEnd}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: '#FF0000',
              fillOpacity: 1,
              strokeWeight: 2,
            }}
          />
          <DistanceTooltip
            position={hoverMarker}
            distanceData={distanceData}
            isLoading={isDistanceLoading}
          />
        </>
      )}
      {wayPoints.map((marker, index) => (
        <Marker
          key={`draggable-${index}`}
          position={marker}
          draggable
          onDragEnd={(e) => onExistingMarkerDragEnd(index, e)}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 6,
            fillColor: '#00AA00',
            fillOpacity: 1,
            strokeWeight: 2,
          }}
        />
      ))}
      {startMarker && (
        <Marker
          position={startMarker}
          label={{
            text: 'A',
            color: 'white',
            fontSize: '16px',
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: 'green',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: 'white',
          }}
        />
      )}
      {endMarker && (
        <Marker
          position={endMarker}
          label={{
            text: 'B',
            color: 'white',
            fontSize: '16px',
          }}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: 'red',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: 'white',
          }}
        />
      )}
    </>
  )
}
