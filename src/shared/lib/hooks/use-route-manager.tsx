// import { useEffect, useCallback } from 'react'
// import { useGetRouteMutation } from '@/entities/route/api/get-route.mutation'
// import { useGetRouteByIdMutation } from '@/entities/route/api/get-route-by-id.mutation'
// import {
//   useLoadingActions,
//   useRouteActions,
//   useRouteData,
// } from '@/shared/store/truck-route-store'

// export function useRouteManager(truckId: string | undefined) {
//   const { currentRoute, detailedRoute, viewMode } = useRouteData()
//   const { setCurrentRoute, setDetailedRoute, setViewMode } = useRouteActions()
//   const { setLoading } = useLoadingActions()

//   // Current route mutation
//   const { mutateAsync: getCurrentRoute, isPending: isCurrentRouteLoading } =
//     useGetRouteMutation({
//       onError: (error) => {
//         console.error('Current route fetch error:', error)
//         setLoading('currentRoute', false)
//       },
//       onSuccess: (data) => {
//         setCurrentRoute(data)
//         setLoading('currentRoute', false)
//       },
//     })

//   // Detailed route mutation (cached)
//   const { mutateAsync: getDetailedRoute, isPending: isDetailedRouteLoading } =
//     useGetRouteByIdMutation({
//       onError: (error) => {
//         console.error('Detailed route fetch error:', error)
//         setLoading('detailedRoute', false)
//       },
//       onSuccess: (data) => {
//         setDetailedRoute(data)
//         setLoading('detailedRoute', false)
//       },
//     })

//   // Load current route on mount
//   useEffect(() => {
//     if (truckId && !currentRoute) {
//       setLoading('currentRoute', true)
//       getCurrentRoute({ truckId })
//     }
//   }, [truckId, currentRoute, getCurrentRoute, setLoading])

//   // Load detailed route when entering edit mode (only once)
//   const loadDetailedRoute = useCallback(async () => {
//     if (!currentRoute?.route?.isRoute || !currentRoute?.route?.routeId) {
//       return
//     }

//     // Only fetch if we don't have it cached
//     if (
//       !detailedRoute ||
//       detailedRoute.routeId !== currentRoute.route.routeId
//     ) {
//       setLoading('detailedRoute', true)
//       await getDetailedRoute({ routeId: currentRoute.route.routeId })
//     }
//   }, [currentRoute, detailedRoute, getDetailedRoute, setLoading])

//   // Public methods
//   const startEditing = useCallback(async () => {
//     await loadDetailedRoute()
//     setViewMode('editing')
//   }, [loadDetailedRoute, setViewMode])

//   const switchToDetailed = useCallback(async () => {
//     await loadDetailedRoute()
//     setViewMode('detailed')
//   }, [loadDetailedRoute, setViewMode])

//   const switchToCurrent = useCallback(() => {
//     setViewMode('current')
//   }, [setViewMode])

//   return {
//     startEditing,
//     switchToDetailed,
//     switchToCurrent,
//     isCurrentRouteLoading,
//     isDetailedRouteLoading,
//   }
// }
