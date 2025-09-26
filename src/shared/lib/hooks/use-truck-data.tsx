// import { useEffect } from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { truckQueries } from '@/entities/truck/api'
// import { useConnection } from '@/shared/lib/context'
// import signalRService from '@/shared/socket/signalRService'
// import {
//   useLoadingActions,
//   useTruckActions,
// } from '@/shared/store/truck-route-store'
// import { TruckStatsUpdate } from '@/shared/types'

// export function useTruckDataManager(truckId: string | undefined) {
//   const { setCurrentTruck, updateTruckStats } = useTruckActions()
//   const { setLoading } = useLoadingActions()
//   const { isConnected } = useConnection()

//   // Fetch truck data
//   const {
//     data: truckData,
//     isLoading: isTruckLoading,
//     isError: isTruckError,
//   } = useQuery({
//     ...truckQueries.truck(truckId!),
//     enabled: !!truckId,
//   })

//   // Update store when truck data changes
//   useEffect(() => {
//     setCurrentTruck(truckData || null)
//     setLoading('truck', isTruckLoading)
//   }, [truckData, isTruckLoading, setCurrentTruck, setLoading])

//   // Handle SignalR connection
//   useEffect(() => {
//     if (!isConnected || !truckId) {
//       updateTruckStats(null)
//       return
//     }

//     const handleUpdate = (update: TruckStatsUpdate) => {
//       updateTruckStats(update)
//     }

//     signalRService.subscribe(truckId, handleUpdate)

//     return () => {
//       signalRService.unsubscribe(truckId, handleUpdate)
//     }
//   }, [truckId, isConnected, updateTruckStats])

//   return {
//     isTruckError,
//     isTruckLoading,
//   }
// }
