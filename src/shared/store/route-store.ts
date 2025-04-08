import { create } from 'zustand'

type RouteStore = {
  origin: string
  destination: string
  setOrigin: (place: string) => void
  setDestination: (place: string) => void
}

export const useRouteStore = create<RouteStore>((set) => ({
  origin: '',
  destination: '',
  setOrigin: (place) => set({ origin: place }),
  setDestination: (place) => set({ destination: place }),
}))
