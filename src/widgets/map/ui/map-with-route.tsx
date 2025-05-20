import { Directions } from '@/features/directions'
import { MapBase, Spinner } from '@/shared/ui'
import { useEffect, useRef } from 'react'
import { ClusteredGasStationMarkers } from '@/entities/gas-station/ui/clustered-gas-station-markers'
import { FullScreenController } from './controlers/fullscreen'
import { ZoomControl } from './controlers/zoom'
import { Coordinate } from '@/shared/types'
import { useGetDirectionsMutation } from '@/features/directions/api/get-direction.mutation'

interface MapWithRouteProps {
  origin: Coordinate | null
  destination: Coordinate | null
}

export const MapWithRoute = ({ origin, destination }: MapWithRouteProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { mutateAsync, data, isPending, context, reset } =
    useGetDirectionsMutation({
      onError: (error, variables, context) => {
        console.log(`Directions mutation error: ${error}`)
        if (context?.abortController) {
          context.abortController.abort(
            'Directions request cancelled due to error',
          )
        }
      },
    })

  useEffect(() => {
    if (origin && destination) {
      mutateAsync({
        origin,
        destination,
      })
    } else {
      reset()
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
