import React, { useRef } from 'react'
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
  onExistingMarkerDragEnd: (
    index: number,
  ) => (e: google.maps.MapMouseEvent) => void
  onExistingMarkerClick?: (index: number) => void
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
  onExistingMarkerClick,
  onHoverMarkerClick,
}: RouteMarkersProps) => {
  const dragStateRef = useRef<Record<number, boolean>>({})

  return (
    <>
      {hoverMarker && (
        <>
          <Marker
            position={hoverMarker}
            draggable
            zIndex={1}
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
          zIndex={2}
          onDragStart={() => {
            dragStateRef.current[index] = false
          }}
          onDrag={() => {
            dragStateRef.current[index] = true
          }}
          onDragEnd={(e) => {
            if (dragStateRef.current[index]) {
              onExistingMarkerDragEnd(index)(e)
            }
            dragStateRef.current[index] = false
          }}
          onClick={() => {
            // onClick срабатывает только если не было drag
            // В Google Maps API onClick не срабатывает после drag, но для надежности проверяем
            if (!dragStateRef.current[index]) {
              onExistingMarkerClick?.(index)
            }
          }}
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
