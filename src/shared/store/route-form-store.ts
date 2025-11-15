import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Coordinate } from '@/shared/types'

interface RouteFormState {
  origin: Coordinate | null
  destination: Coordinate | null
  originName?: string
  destinationName?: string
  finishFuel?: number
  truckWeight?: number
}

interface RouteFormActions {
  setOrigin: (origin: Coordinate | null) => void
  setDestination: (destination: Coordinate | null) => void
  setOriginName: (originName: string | undefined) => void
  setDestinationName: (destinationName: string | undefined) => void
  setFinishFuel: (finishFuel: number | undefined) => void
  setTruckWeight: (truckWeight: number | undefined) => void
  setRouteForm: (data: Partial<RouteFormState>) => void
  clearRouteForm: () => void
}

type RouteFormStore = RouteFormState & RouteFormActions

const initialState: RouteFormState = {
  origin: null,
  destination: null,
  originName: undefined,
  destinationName: undefined,
  finishFuel: undefined,
  truckWeight: undefined,
}

export const useRouteFormStore = create<RouteFormStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setOrigin: (origin) => set({ origin }, undefined, 'routeForm/setOrigin'),
      setDestination: (destination) =>
        set({ destination }, undefined, 'routeForm/setDestination'),
      setOriginName: (originName) =>
        set({ originName }, undefined, 'routeForm/setOriginName'),
      setDestinationName: (destinationName) =>
        set({ destinationName }, undefined, 'routeForm/setDestinationName'),
      setFinishFuel: (finishFuel) =>
        set({ finishFuel }, undefined, 'routeForm/setFinishFuel'),
      setTruckWeight: (truckWeight) =>
        set({ truckWeight }, undefined, 'routeForm/setTruckWeight'),

      setRouteForm: (data) =>
        set(
          (state) => ({ ...state, ...data }),
          undefined,
          'routeForm/setRouteForm',
        ),

      clearRouteForm: () =>
        set(initialState, undefined, 'routeForm/clearRouteForm'),
    }),
    {
      name: 'RouteFormStore',
    },
  ),
)
