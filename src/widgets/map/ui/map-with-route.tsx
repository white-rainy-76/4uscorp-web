import { useMutation, useQuery } from '@tanstack/react-query'
import { Directions } from '@/features/directions'
import { MapBase, Spinner } from '@/shared/ui'
import { getDirections } from '@/features/directions/api/get-directions'
import { useEffect } from 'react'
import { GasStationMarker } from '@/entities/gas-station'
import { Coordinate } from '@/shared/types'
interface MapWithRouteProps {
  origin: Coordinate | null
  destination: Coordinate | null
}

export const MapWithRoute = ({ origin, destination }: MapWithRouteProps) => {
  console.log('Render')
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
    <div className="relative">
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
        {data?.gasStations &&
          data.gasStations.map((gasStation) => (
            <GasStationMarker key={gasStation.id} gasStation={gasStation} />
          ))}
      </MapBase>
    </div>
  )
}

// <ClusteredGasStationMarkers gasStations={data?.gasStations} />
// const { data, isLoading, isError, error } = useQuery({
//   ...gasStationQueries.list({
//     radius: 15,
//     source: '',
//     destination: '',
//   }),
// })
//  <Directions />
// {isLoading && (
//   <div className="absolute top-4 right-4 z-10 bg-white text-blue-700 p-2 rounded-lg shadow-lg">
//     Loading...
//   </div>
// )}
// {isError && (
//   <div className="absolute top-4 right-4 z-10 bg-red-100 text-red-700 p-2 rounded-lg shadow-lg">
//     Error: {error?.message || 'Не удалось загрузить заправки'}
//   </div>
// )}
// {data &&
//   data.map((gasStation) => (
//     <GasStationMarker key={uuidv4()} gasStation={gasStation} />
//   ))}
