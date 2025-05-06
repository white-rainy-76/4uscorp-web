import { TrackTruckMarkers } from '@/features/truck-track'
import { MapBase } from '@/shared/ui'
import { useState } from 'react'

export const MapWithTrucks = () => {
  const [clickedOutside, setClickedOutside] = useState(false)
  return (
    <MapBase onMapClick={() => setClickedOutside(true)}>
      <TrackTruckMarkers
        clickedOutside={clickedOutside}
        resetClick={() => setClickedOutside(false)}
      />
    </MapBase>
  )
}
