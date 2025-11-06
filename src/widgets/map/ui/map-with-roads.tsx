import { useState } from 'react'
import { MapBase, Spinner } from '@/shared/ui'
import { RoadPolyline } from '@/entities/roads/ui'
import { Road } from '@/entities/roads'

interface MapWithRoadsProps {
  roads: Road[]
  isLoading?: boolean
}

export const MapWithRoads = ({ roads, isLoading }: MapWithRoadsProps) => {
  const [clickedOutside, setClickedOutside] = useState(false)

  return (
    <div className="relative">
      <MapBase onMapClick={() => setClickedOutside(true)}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50 pointer-events-auto">
            <Spinner />
          </div>
        )}
        {roads &&
          roads.map((road) => <RoadPolyline key={road.id} road={road} />)}
      </MapBase>
    </div>
  )
}
