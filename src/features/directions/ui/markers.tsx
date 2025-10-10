import React from 'react'
import { Marker } from '@vis.gl/react-google-maps'
import { DistanceTooltip } from '@/entities/route'

interface RouteMarkersProps {
  hoverMarker: google.maps.LatLngLiteral | null
  hoveredRouteSectionId: string | null
  wayPoints: google.maps.LatLngLiteral[]
  startMarker: google.maps.LatLngLiteral | null
  endMarker: google.maps.LatLngLiteral | null
  onMarkerDragStart: () => void
  onMarkerDragEnd: (e: google.maps.MapMouseEvent) => void
  onExistingMarkerDragEnd: (index: number, e: google.maps.MapMouseEvent) => void
  onHoverMarkerClick?: (e: google.maps.MapMouseEvent) => void
}

export const RouteMarkers = ({
  hoverMarker,
  hoveredRouteSectionId,
  wayPoints,
  startMarker,
  endMarker,
  onMarkerDragStart,
  onMarkerDragEnd,
  onExistingMarkerDragEnd,
  onHoverMarkerClick,
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
            onClick={onHoverMarkerClick}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: '#FF0000',
              fillOpacity: 1,
              strokeWeight: 2,
            }}
          />
          {hoveredRouteSectionId && (
            <DistanceTooltip
              position={hoverMarker}
              routeSectionId={hoveredRouteSectionId}
            />
          )}
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
