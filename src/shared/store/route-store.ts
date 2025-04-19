import { create } from 'zustand'

interface Coordinate {
  latitude: number
  longitude: number
}

interface RouteState {
  origin: Coordinate | null
  destination: Coordinate | null
  setOrigin: (origin: Coordinate) => void
  setDestination: (destination: Coordinate) => void
}

export const useRouteStore = create<RouteState>((set) => ({
  origin: null,
  destination: null,
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
}))
