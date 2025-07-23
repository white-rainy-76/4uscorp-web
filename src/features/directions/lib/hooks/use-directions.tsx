// import { useEffect } from 'react'
// import { useHandleDirectionsMutation } from '@/features/directions/api/handle-direction.mutation'
// import { useUpdateGasStationsMutation } from '@/entities/gas-station/api/update-gas-station.mutation'
// import { Coordinate, TruckStatsUpdate } from '@/shared/types'
// import { useRouteFormStore } from '@/shared/store'

// interface UseDirectionsProps {
//   truckId: string | undefined
//   stats: TruckStatsUpdate | null
//   origin: Coordinate | null
//   destination: Coordinate | null
//   finishFuel: number | undefined
//   truckWeight: number | undefined
// }

// export function useDirections({
//   truckId,
//   stats,
//   finishFuel,
//   truckWeight,
//   origin,
//   destination,
// }: UseDirectionsProps) {
//   const { selectedProviders, selectedRouteId, setSelectedRouteId } =
//     useRouteFormStore()

//   const {
//     mutateAsync: updateGasStations,
//     data: gasStationsData,
//     isPending: isGasStationsLoading,
//   } = useUpdateGasStationsMutation({
//     onError: (error) => {
//       // ! Handle error in a better way
//       console.error('Update gas stations error:', error)
//     },
//   })

//   const {
//     mutateAsync: getDirections,
//     data: directionsData,
//     isPending: isDirectionsLoading,
//     reset: resetRoute,
//   } = useHandleDirectionsMutation({
//     onSuccess: (data) => {
//       if (data?.routeId) {
//         updateGasStations({
//           routeId: data.routeId,
//           routeSectionIds: data.route.map(
//             (routeDto) => routeDto.routeSectionId,
//           ),
//           FinishFuel: finishFuel,
//           ...(truckWeight !== undefined &&
//             truckWeight !== 0 && { Weight: truckWeight }),
//           FuelProviderNameList: selectedProviders,
//           CurrentFuel: stats?.fuelPercentage.toString(),
//         })
//       } else {
//         console.warn(
//           // ! Handle warn in a better way
//           'Missing data for updateGasStations after directions fetch.',
//         )
//       }
//     },
//     onError: (error) => {
//       // ! Handle error in a better way
//       console.error('Directions mutation error:', error)
//     },
//   })

//   // Auto-trigger directions when origin/destination changes
//   useEffect(() => {
//     if (!truckId) return
//     console.log('Here we go!')
//     const hasBothPoints = origin && destination
//     hasBothPoints
//       ? getDirections({ origin, destination, TruckId: truckId })
//       : resetRoute()
//   }, [origin, destination, truckId, getDirections, resetRoute])

//   // Auto-select first route when directions are loaded
//   useEffect(() => {
//     if (
//       directionsData?.route &&
//       directionsData.route.length > 0 &&
//       !selectedRouteId
//     ) {
//       setSelectedRouteId(directionsData.route[0].routeSectionId)
//     }
//   }, [directionsData, selectedRouteId, setSelectedRouteId])

//   const handleRouteClick = (routeIndex: number) => {
//     if (directionsData?.route && directionsData.route[routeIndex]) {
//       setSelectedRouteId(directionsData.route[routeIndex].routeSectionId)
//     }
//   }

//   return {
//     directionsData,
//     gasStationsData,
//     isDirectionsLoading,
//     isGasStationsLoading,
//     updateGasStations,
//     getDirections,
//     handleRouteClick,
//   }
// }
