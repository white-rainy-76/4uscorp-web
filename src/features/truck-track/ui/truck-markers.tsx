import { useQuery } from '@tanstack/react-query'
import { TrackTruck } from './tracked-truck'
import { truckQueries } from '@/entities/truck/api'

export const fakeTruckMarkers = [
  {
    trackerId: '9805d6a2-e410-4092-a90f-1ef3497065ae',
    truckId: 'c55d568f-b29e-4273-a726-b414afa4e7d5',
    status: 'Inactive',
    unitNumber: 'TX-101',
  },
  {
    trackerId: 'cb6e5047-15d8-4e46-8c2f-46cf0717ade7',
    truckId: 'a7e52267-991b-4c0b-8e83-26d4aab10022',
    status: 'Inactive',
    unitNumber: 'TX-102',
  },
  {
    trackerId: 'b1df25e1-39bf-46fe-9869-3b7a0e12f700',
    truckId: '109aa1b7-33cd-4bd8-96d5-da773f3d2c64',
    status: 'Inactive',
    unitNumber: 'TX-103',
  },
]

export const TrackTruckMarkers = ({
  clickedOutside,
  resetClick,
}: {
  clickedOutside: boolean
  resetClick: () => void
}) => {
  const { data, isLoading } = useQuery({ ...truckQueries.list() })

  return (
    <>
      {fakeTruckMarkers.map((truck) => (
        <TrackTruck
          key={truck.truckId}
          truckId={truck.truckId}
          unitNumber={truck.unitNumber}
          clickedOutside={clickedOutside}
          resetClick={resetClick}
        />
      ))}
    </>
  )
}
