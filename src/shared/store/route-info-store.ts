import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface RouteInfoState {
  routeId: string | undefined
  sectionIds: string[]
  selectedSectionId: string | null
  miles: number | undefined
  driveTime: number | undefined
  gallons: number | undefined
  fuelLeft: number | undefined
  totalPrice: number | undefined
  tolls: number | undefined
}

interface RouteInfoActions {
  setRouteId: (routeId: string | undefined) => void
  setSectionIds: (sectionIds: string[]) => void
  setSelectedSectionId: (sectionId: string | null) => void
  setMiles: (miles: number | undefined) => void
  setDriveTime: (driveTime: number | undefined) => void
  setGallons: (gallons: number | undefined) => void
  setFuelLeft: (fuelLeft: number | undefined) => void
  setTotalPrice: (totalPrice: number | undefined) => void
  setTolls: (tolls: number | undefined) => void
  setRouteInfo: (data: Partial<RouteInfoState>) => void
  clearRouteInfo: () => void
}

type RouteInfoStore = RouteInfoState & RouteInfoActions

const initialState: RouteInfoState = {
  routeId: undefined,
  sectionIds: [],
  selectedSectionId: null,
  miles: undefined,
  driveTime: undefined,
  gallons: undefined,
  fuelLeft: undefined,
  totalPrice: undefined,
  tolls: undefined,
}

export const useRouteInfoStore = create<RouteInfoStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setRouteId: (routeId) =>
        set({ routeId }, undefined, 'routeInfo/setRouteId'),
      setSectionIds: (sectionIds) =>
        set({ sectionIds }, undefined, 'routeInfo/setSectionIds'),
      setSelectedSectionId: (selectedSectionId) =>
        set({ selectedSectionId }, undefined, 'routeInfo/setSelectedSectionId'),
      setMiles: (miles) => set({ miles }, undefined, 'routeInfo/setMiles'),
      setDriveTime: (driveTime) =>
        set({ driveTime }, undefined, 'routeInfo/setDriveTime'),
      setGallons: (gallons) =>
        set({ gallons }, undefined, 'routeInfo/setGallons'),
      setFuelLeft: (fuelLeft) =>
        set({ fuelLeft }, undefined, 'routeInfo/setFuelLeft'),
      setTotalPrice: (totalPrice) =>
        set({ totalPrice }, undefined, 'routeInfo/setTotalPrice'),
      setTolls: (tolls) => set({ tolls }, undefined, 'routeInfo/setTolls'),

      setRouteInfo: (data) =>
        set(
          (state) => ({ ...state, ...data }),
          undefined,
          'routeInfo/setRouteInfo',
        ),

      clearRouteInfo: () =>
        set(initialState, undefined, 'routeInfo/clearRouteInfo'),
    }),
    {
      name: 'RouteInfoStore',
    },
  ),
)
