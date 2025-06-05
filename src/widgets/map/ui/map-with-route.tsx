import React, { useRef } from 'react'
import { MapBase, Spinner } from '@/shared/ui'
import { ClusteredGasStationMarkers } from '@/entities/gas-station/ui/clustered-gas-station-markers'
import { FullScreenController } from './controlers/fullscreen'
import { ZoomControl } from './controlers/zoom'
import { Coordinate } from '@/shared/types'
import { Directions } from '@/features/directions/api'
import { DirectionsRoutes } from '@/features/directions'

interface MapWithRouteProps {
  origin: Coordinate | null
  destination: Coordinate | null
  routeData: Directions | undefined
  mutateAsync: (variables: {
    origin: Coordinate
    destination: Coordinate
  }) => Promise<Directions>
  isPending: boolean
}

export const MapWithRoute = ({
  origin,
  destination,
  routeData,
  isPending,
  mutateAsync,
}: MapWithRouteProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)

  console.log(routeData?.gasStations?.[0])

  return (
    <div className="relative" ref={mapContainerRef}>
      <MapBase>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50 pointer-events-auto">
            <Spinner />
          </div>
        )}
        <DirectionsRoutes
          origin={origin}
          destination={destination}
          data={routeData}
          directionsMutation={mutateAsync}
        />
        {routeData?.gasStations && (
          <ClusteredGasStationMarkers gasStations={routeData.gasStations} />
        )}
        <FullScreenController mapRef={mapContainerRef} />
        <ZoomControl />
      </MapBase>
    </div>
  )
}
