import { truckQueries } from '@/entities/truck/api'
import { TrackTruckMarkers } from '@/features/truck-track'
import { MapBase, Spinner } from '@/shared/ui'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export const MapWithTrucks = () => {
  const [clickedOutside, setClickedOutside] = useState(false)
  const { data, isPending } = useQuery(truckQueries.list())

  return (
    <div className="relative">
      <MapBase onMapClick={() => setClickedOutside(true)}>
        {isPending && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50 pointer-events-auto">
            <Spinner />
          </div>
        )}
        {data && (
          <TrackTruckMarkers
            clickedOutside={clickedOutside}
            resetClick={() => setClickedOutside(false)}
            trucks={data}
          />
        )}
      </MapBase>
    </div>
  )
}
