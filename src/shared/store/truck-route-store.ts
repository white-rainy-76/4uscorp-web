// import { create } from 'zustand'
// import { devtools, subscribeWithSelector } from 'zustand/middleware'
// import { immer } from 'zustand/middleware/immer'
// import { Coordinate, TruckStatsUpdate } from '@/shared/types'
// import { Directions } from '@/features/directions/api'
// import { GasStation } from '@/entities/gas-station'
// import { RouteByIdData, RouteData } from '@/entities/route/api/types/route'
// import { Truck } from '@/entities/truck'

// interface RouteState {
//   // Current truck data
//   currentTruck: Truck | null
//   truckStats: TruckStatsUpdate | null

//   // Route data (current and detailed)
//   currentRoute: RouteData | null
//   detailedRoute: RouteByIdData | null

//   // UI state
//   viewMode: 'current' | 'detailed' | 'editing'
//   isEditing: boolean

//   // Route form data
//   origin: Coordinate | null
//   destination: Coordinate | null
//   originName: string | undefined
//   destinationName: string | undefined
//   finishFuel: number | undefined
//   truckWeight: number | undefined

//   // Map and directions
//   directionsData: Directions | undefined
//   gasStations: GasStation[]
//   selectedRouteId: string | null
//   selectedProviders: string[]

//   // Gas station cart
//   cart: GasStation[]

//   // Loading states
//   loadingStates: {
//     truck: boolean
//     currentRoute: boolean
//     detailedRoute: boolean
//     directions: boolean
//     gasStations: boolean
//   }

//   // Computed getters
//   isLoadingAny: boolean
//   activeGasStations: GasStation[]
//   routeToDisplay: RouteData | RouteByIdData | null
// }

// interface RouteActions {
//   // Truck actions
//   setCurrentTruck: (truck: Truck | null) => void
//   updateTruckStats: (stats: TruckStatsUpdate | null) => void

//   // Route actions
//   setCurrentRoute: (route: RouteData | null) => void
//   setDetailedRoute: (route: RouteByIdData | null) => void
//   clearDetailedRoute: () => void

//   // View mode actions
//   setViewMode: (mode: 'current' | 'detailed' | 'editing') => void
//   startEditing: () => void
//   cancelEditing: () => void
//   switchToCurrentView: () => void

//   // Route form actions
//   updateRouteForm: (
//     data: Partial<{
//       origin: Coordinate | null
//       destination: Coordinate | null
//       originName: string | undefined
//       destinationName: string | undefined
//       finishFuel: number | undefined
//       truckWeight: number | undefined
//     }>,
//   ) => void

//   // Directions and gas stations
//   setDirectionsData: (data: Directions | undefined) => void
//   setGasStations: (stations: GasStation[]) => void
//   setSelectedRouteId: (id: string | null) => void
//   setSelectedProviders: (providers: string[]) => void

//   // Cart actions
//   addToCart: (station: GasStation) => void
//   removeFromCart: (stationId: string) => void
//   updateCartItem: (stationId: string, refillLiters: number) => void
//   syncCartFromGasStations: () => void

//   // Loading states
//   setLoading: (key: keyof RouteState['loadingStates'], loading: boolean) => void

//   // Reset actions
//   resetRouteData: () => void
//   resetAll: () => void
// }

// type TruckRouteStore = RouteState & RouteActions

// export const useTruckRouteStore = create<TruckRouteStore>()(
//   devtools(
//     subscribeWithSelector(
//       immer((set, get) => ({
//         // Initial state
//         currentTruck: null,
//         truckStats: null,
//         currentRoute: null,
//         detailedRoute: null,
//         viewMode: 'current',
//         isEditing: false,

//         origin: null,
//         destination: null,
//         originName: undefined,
//         destinationName: undefined,
//         finishFuel: undefined,
//         truckWeight: undefined,

//         directionsData: undefined,
//         gasStations: [],
//         selectedRouteId: null,
//         selectedProviders: [],

//         cart: [],

//         loadingStates: {
//           truck: false,
//           currentRoute: false,
//           detailedRoute: false,
//           directions: false,
//           gasStations: false,
//         },

//         // Computed getters
//         get isLoadingAny() {
//           const states = get().loadingStates
//           return Object.values(states).some(Boolean)
//         },

//         get activeGasStations() {
//           const { gasStations, selectedRouteId } = get()
//           return gasStations.filter(
//             (station) => station.roadSectionId === selectedRouteId,
//           )
//         },

//         get routeToDisplay() {
//           const { viewMode, currentRoute, detailedRoute } = get()
//           switch (viewMode) {
//             case 'detailed':
//             case 'editing':
//               return detailedRoute || currentRoute
//             case 'current':
//             default:
//               return currentRoute
//           }
//         },

//         // Actions
//         setCurrentTruck: (truck) =>
//           set((state) => {
//             state.currentTruck = truck
//           }),

//         updateTruckStats: (stats) =>
//           set((state) => {
//             state.truckStats = stats
//           }),

//         setCurrentRoute: (route) =>
//           set((state) => {
//             state.currentRoute = route
//           }),

//         setDetailedRoute: (route) =>
//           set((state) => {
//             state.detailedRoute = route
//             if (route) {
//               // Auto-populate form data
//               state.origin = route.origin
//               state.destination = route.destination
//               state.originName = route.originName
//               state.destinationName = route.destinationName
//               state.finishFuel = route.remainingFuel
//               state.truckWeight = route.weight
//             }
//           }),

//         clearDetailedRoute: () =>
//           set((state) => {
//             state.detailedRoute = null
//           }),

//         setViewMode: (mode) =>
//           set((state) => {
//             state.viewMode = mode
//             state.isEditing = mode === 'editing'
//           }),

//         startEditing: () =>
//           set((state) => {
//             state.viewMode = 'editing'
//             state.isEditing = true
//           }),

//         cancelEditing: () =>
//           set((state) => {
//             state.viewMode = state.detailedRoute ? 'detailed' : 'current'
//             state.isEditing = false
//           }),

//         switchToCurrentView: () =>
//           set((state) => {
//             state.viewMode = 'current'
//             state.isEditing = false
//           }),

//         updateRouteForm: (data) =>
//           set((state) => {
//             Object.assign(state, data)
//           }),

//         setDirectionsData: (data) =>
//           set((state) => {
//             state.directionsData = data
//           }),

//         setGasStations: (stations) =>
//           set((state) => {
//             state.gasStations = stations
//           }),

//         setSelectedRouteId: (id) =>
//           set((state) => {
//             state.selectedRouteId = id
//           }),

//         setSelectedProviders: (providers) =>
//           set((state) => {
//             state.selectedProviders = providers
//           }),

//         addToCart: (station) =>
//           set((state) => {
//             const exists = state.cart.find((s) => s.id === station.id)
//             if (!exists) {
//               state.cart.push({ ...station, refillLiters: station.refill || 0 })
//             }
//           }),

//         removeFromCart: (stationId) =>
//           set((state) => {
//             state.cart = state.cart.filter((s) => s.id !== stationId)
//           }),

//         updateCartItem: (stationId, refillLiters) =>
//           set((state) => {
//             const item = state.cart.find((s) => s.id === stationId)
//             if (item) {
//               item.refill = refillLiters
//             }
//           }),

//         syncCartFromGasStations: () =>
//           set((state) => {
//             const { gasStations, selectedRouteId } = state
//             state.cart = gasStations.filter(
//               (station) =>
//                 station.isAlgorithm &&
//                 station.roadSectionId === selectedRouteId,
//             )
//           }),

//         setLoading: (key, loading) =>
//           set((state) => {
//             state.loadingStates[key] = loading
//           }),

//         resetRouteData: () =>
//           set((state) => {
//             state.currentRoute = null
//             state.detailedRoute = null
//             state.directionsData = undefined
//             state.gasStations = []
//             state.cart = []
//             state.selectedRouteId = null
//             state.origin = null
//             state.destination = null
//             state.originName = undefined
//             state.destinationName = undefined
//             state.finishFuel = undefined
//             state.truckWeight = undefined
//           }),

//         resetAll: () =>
//           set((state) => {
//             // Reset everything to initial state
//             Object.assign(state, {
//               currentTruck: null,
//               truckStats: null,
//               currentRoute: null,
//               detailedRoute: null,
//               viewMode: 'current',
//               isEditing: false,
//               origin: null,
//               destination: null,
//               originName: undefined,
//               destinationName: undefined,
//               finishFuel: undefined,
//               truckWeight: undefined,
//               directionsData: undefined,
//               gasStations: [],
//               selectedRouteId: null,
//               selectedProviders: [],
//               cart: [],
//               loadingStates: {
//                 truck: false,
//                 currentRoute: false,
//                 detailedRoute: false,
//                 directions: false,
//                 gasStations: false,
//               },
//             })
//           }),
//       })),
//     ),
//     { name: 'truck-route-store' },
//   ),
// )

// // Selectors for better performance
// export const useTruckData = () =>
//   useTruckRouteStore((state) => ({
//     truck: state.currentTruck,
//     stats: state.truckStats,
//     isLoading: state.loadingStates.truck,
//   }))

// export const useRouteData = () =>
//   useTruckRouteStore((state) => ({
//     currentRoute: state.currentRoute,
//     detailedRoute: state.detailedRoute,
//     routeToDisplay: state.routeToDisplay,
//     viewMode: state.viewMode,
//     isEditing: state.isEditing,
//   }))

// export const useMapData = () =>
//   useTruckRouteStore((state) => ({
//     origin: state.origin,
//     destination: state.destination,
//     originName: state.originName,
//     destinationName: state.destinationName,
//     directionsData: state.directionsData,
//     gasStations: state.activeGasStations,
//     selectedRouteId: state.selectedRouteId,
//     selectedProviders: state.selectedProviders,
//     cart: state.cart,
//     isLoading: state.isLoadingAny,
//   }))

// export const useFormData = () =>
//   useTruckRouteStore((state) => ({
//     origin: state.origin,
//     destination: state.destination,
//     originName: state.originName,
//     destinationName: state.destinationName,
//     finishFuel: state.finishFuel,
//     truckWeight: state.truckWeight,
//   }))

// // Action selectors
// export const useTruckActions = () =>
//   useTruckRouteStore((state) => ({
//     setCurrentTruck: state.setCurrentTruck,
//     updateTruckStats: state.updateTruckStats,
//   }))

// export const useRouteActions = () =>
//   useTruckRouteStore((state) => ({
//     setCurrentRoute: state.setCurrentRoute,
//     setDetailedRoute: state.setDetailedRoute,
//     clearDetailedRoute: state.clearDetailedRoute,
//     setViewMode: state.setViewMode,
//     startEditing: state.startEditing,
//     cancelEditing: state.cancelEditing,
//     switchToCurrentView: state.switchToCurrentView,
//     updateRouteForm: state.updateRouteForm,
//   }))

// export const useMapActions = () =>
//   useTruckRouteStore((state) => ({
//     setDirectionsData: state.setDirectionsData,
//     setGasStations: state.setGasStations,
//     setSelectedRouteId: state.setSelectedRouteId,
//     setSelectedProviders: state.setSelectedProviders,
//     addToCart: state.addToCart,
//     removeFromCart: state.removeFromCart,
//     updateCartItem: state.updateCartItem,
//     syncCartFromGasStations: state.syncCartFromGasStations,
//   }))

// export const useLoadingActions = () =>
//   useTruckRouteStore((state) => ({
//     setLoading: state.setLoading,
//   }))
