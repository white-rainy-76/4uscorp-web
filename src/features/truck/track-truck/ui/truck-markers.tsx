import { Truck } from '@/entities/truck'
import { TrackTruck } from './tracked-truck'

interface TrackTruckMarkersProps {
  clickedOutside: boolean
  resetClick: () => void
  trucks: Truck[]
}

export const TrackTruckMarkers = ({
  clickedOutside,
  resetClick,
  trucks,
}: TrackTruckMarkersProps) => {
  return (
    <>
      {trucks.map((truck) => (
        <TrackTruck
          key={truck.id}
          truckId={truck.id}
          unitNumber={truck.name}
          clickedOutside={clickedOutside}
          resetClick={resetClick}
        />
      ))}
    </>
  )
}
