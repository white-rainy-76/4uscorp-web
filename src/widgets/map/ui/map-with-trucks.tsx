import { TrackTruckMarkers } from '@/features/truck-track'
import { MapBase } from '@/shared/ui'

export const MapWithTrucks = () => {
  return (
    <MapBase>
      <TrackTruckMarkers />
    </MapBase>
  )
}
