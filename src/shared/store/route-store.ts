import { create } from 'zustand'
import { Coordinate } from '@/shared/types'

interface RouteFormState {
  origin: Coordinate | null
  destination: Coordinate | null
  originName: string | undefined
  destinationName: string | undefined
  finishFuel: number | undefined
  truckWeight: number | undefined
  selectedProviders: string[]
  selectedRouteId: string | null

  // Actions
  setOrigin: (origin: Coordinate | null) => void
  setDestination: (destination: Coordinate | null) => void
  setOriginName: (name: string | undefined) => void
  setDestinationName: (name: string | undefined) => void
  setFinishFuel: (fuel: number | undefined) => void
  setTruckWeight: (weight: number | undefined) => void
  setSelectedProviders: (providers: string[]) => void
  setSelectedRouteId: (id: string | null) => void
  resetForm: () => void
}

const initialState = {
  origin: null,
  destination: null,
  originName: undefined,
  destinationName: undefined,
  finishFuel: undefined,
  truckWeight: undefined,
  selectedProviders: [],
  selectedRouteId: null,
}

export const useRouteFormStore = create<RouteFormState>((set) => ({
  ...initialState,

  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setOriginName: (originName) => set({ originName }),
  setDestinationName: (destinationName) => set({ destinationName }),
  setFinishFuel: (finishFuel) => set({ finishFuel }),
  setTruckWeight: (truckWeight) => set({ truckWeight }),
  setSelectedProviders: (selectedProviders) => set({ selectedProviders }),
  setSelectedRouteId: (selectedRouteId) => set({ selectedRouteId }),
  resetForm: () => set(initialState),
}))
