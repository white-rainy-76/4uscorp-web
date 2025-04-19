import { Directions } from '@/features/directions'
import { MapBase } from '@/shared/ui/map'

export const MapWithRoute = () => {
  // const { origin, destination } = useRouteStore()
  // const { data, isLoading, isError, error } = useQuery({
  //   ...gasStationQueries.list({
  //     radius: 15,
  //     source: '',
  //     destination: '',
  //   }),
  // })
  return (
    <MapBase>
      <Directions />
    </MapBase>
  )
}

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
