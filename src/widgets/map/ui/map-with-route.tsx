import { useMutation } from '@tanstack/react-query'
import { Directions } from '@/features/directions'
import { MapBase, Spinner } from '@/shared/ui'
import { getDirections } from '@/features/directions/api/get-directions'
import { useEffect, useRef } from 'react'
import { GasStationMarker } from '@/entities/gas-station'
import { Coordinate } from '@/shared/types'
import { ClusteredGasStationMarkers } from '@/entities/gas-station/ui/clustered-gas-station-markers'
import { FullScreenController } from './controlers/fullscreen'
import { ZoomControl } from './controlers/zoom'

interface MapWithRouteProps {
  origin: Coordinate | null
  destination: Coordinate | null
}

export const MapWithRoute = ({ origin, destination }: MapWithRouteProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { mutateAsync, data, isPending } = useMutation({
    mutationFn: getDirections,
  })

  useEffect(() => {
    if (origin && destination) {
      mutateAsync({
        origin,
        destination,
      })
    }
  }, [origin, destination])

  return (
    <div className="relative" ref={mapContainerRef}>
      <MapBase>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50 pointer-events-auto">
            <Spinner />
          </div>
        )}
        <Directions
          origin={origin}
          destination={destination}
          data={data}
          directionsMutation={mutateAsync}
        />
        {data?.gasStations && (
          <ClusteredGasStationMarkers gasStations={data?.gasStations} />
        )}
        <FullScreenController mapRef={mapContainerRef} />
        <ZoomControl />
      </MapBase>
    </div>
  )
}

// {data?.gasStations && (
//   <ClusteredGasStationMarkers gasStations={data?.gasStations} />
// )}

// data.gasStations.map((gasStation) => (
//   <GasStationMarker key={gasStation.id} gasStation={gasStation} />
// ))}
