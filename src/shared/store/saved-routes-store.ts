import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Coordinate } from '@/shared/types'

interface SavedRoutesState {
  // Location data
  origin: Coordinate | null
  destination: Coordinate | null
  originName: string
  destinationName: string

  // Route identifiers
  sectionId: string | null
  routeId: string | null
  savedRouteId: string | null

  // Actions
  setOrigin: (origin: Coordinate | null) => void
  setDestination: (destination: Coordinate | null) => void
  setOriginName: (name: string) => void
  setDestinationName: (name: string) => void
  setSectionId: (id: string | null) => void
  setRouteId: (id: string | null) => void
  setSavedRouteId: (id: string | null) => void

  // Compound actions
  setSearchParams: (params: {
    origin: Coordinate | null
    destination: Coordinate | null
    originName: string
    destinationName: string
  }) => void

  reset: () => void
}

const initialState = {
  origin: null,
  destination: null,
  originName: '',
  destinationName: '',
  sectionId: null,
  routeId: null,
  savedRouteId: null,
}

export const useSavedRoutesStore = create<SavedRoutesState>()(
  devtools(
    (set) => ({
      ...initialState,

      setOrigin: (origin) =>
        set({ origin }, undefined, 'savedRoutes/setOrigin'),
      setDestination: (destination) =>
        set({ destination }, undefined, 'savedRoutes/setDestination'),
      setOriginName: (originName) =>
        set({ originName }, undefined, 'savedRoutes/setOriginName'),
      setDestinationName: (destinationName) =>
        set({ destinationName }, undefined, 'savedRoutes/setDestinationName'),
      setSectionId: (sectionId) =>
        set({ sectionId }, undefined, 'savedRoutes/setSectionId'),
      setRouteId: (routeId) =>
        set({ routeId }, undefined, 'savedRoutes/setRouteId'),
      setSavedRouteId: (savedRouteId) =>
        set({ savedRouteId }, undefined, 'savedRoutes/setSavedRouteId'),

      setSearchParams: ({ origin, destination, originName, destinationName }) =>
        set(
          { origin, destination, originName, destinationName },
          undefined,
          'savedRoutes/setSearchParams',
        ),

      reset: () => set(initialState, undefined, 'savedRoutes/reset'),
    }),
    {
      name: 'SavedRoutesStore',
    },
  ),
)
