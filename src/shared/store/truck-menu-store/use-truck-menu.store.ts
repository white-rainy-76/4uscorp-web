import { create } from 'zustand'

type TruckMenuStore = {
  openUnit: string | null
  setOpenUnit: (unitNumber: string | null) => void
}

export const useTruckMenuStore = create<TruckMenuStore>((set) => ({
  openUnit: null,
  setOpenUnit: (unitNumber) => set({ openUnit: unitNumber }),
}))

export const useOpenUnit = () => useTruckMenuStore((state) => state.openUnit)
