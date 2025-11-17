import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface ErrorsState {
  globalErrors: string[]
  gasStationGlobalErrors: string[]
  gasStationErrors: { [stationId: string]: string }
}

interface ErrorsActions {
  setGlobalErrors: (errors: string[]) => void
  addGlobalError: (error: string) => void
  removeGlobalError: (index: number) => void
  setGasStationGlobalErrors: (errors: string[]) => void
  addGasStationGlobalError: (error: string) => void
  removeGasStationGlobalError: (index: number) => void
  setGasStationError: (stationId: string, error: string) => void
  removeGasStationError: (stationId: string) => void
  clearGasStationErrors: () => void
  clearAllErrors: () => void
}

type ErrorsStore = ErrorsState & ErrorsActions

const initialState: ErrorsState = {
  globalErrors: [],
  gasStationGlobalErrors: [],
  gasStationErrors: {},
}

export const useErrorsStore = create<ErrorsStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setGlobalErrors: (errors) =>
        set({ globalErrors: errors }, undefined, 'errors/setGlobalErrors'),

      addGlobalError: (error) =>
        set(
          (state) => ({
            globalErrors: [...state.globalErrors, error],
          }),
          undefined,
          'errors/addGlobalError',
        ),

      removeGlobalError: (index) =>
        set(
          (state) => ({
            globalErrors: state.globalErrors.filter((_, i) => i !== index),
          }),
          undefined,
          'errors/removeGlobalError',
        ),

      setGasStationGlobalErrors: (errors) =>
        set(
          { gasStationGlobalErrors: errors },
          undefined,
          'errors/setGasStationGlobalErrors',
        ),

      addGasStationGlobalError: (error) =>
        set(
          (state) => ({
            gasStationGlobalErrors: [...state.gasStationGlobalErrors, error],
          }),
          undefined,
          'errors/addGasStationGlobalError',
        ),

      removeGasStationGlobalError: (index) =>
        set(
          (state) => ({
            gasStationGlobalErrors: state.gasStationGlobalErrors.filter(
              (_, i) => i !== index,
            ),
          }),
          undefined,
          'errors/removeGasStationGlobalError',
        ),

      setGasStationError: (stationId, error) =>
        set(
          (state) => ({
            gasStationErrors: {
              ...state.gasStationErrors,
              [stationId]: error,
            },
          }),
          undefined,
          'errors/setGasStationError',
        ),

      removeGasStationError: (stationId) =>
        set(
          (state) => {
            const { [stationId]: removed, ...rest } = state.gasStationErrors
            return { gasStationErrors: rest }
          },
          undefined,
          'errors/removeGasStationError',
        ),

      clearGasStationErrors: () =>
        set(
          { gasStationErrors: {} },
          undefined,
          'errors/clearGasStationErrors',
        ),

      clearAllErrors: () =>
        set(initialState, undefined, 'errors/clearAllErrors'),
    }),
    {
      name: 'ErrorsStore',
    },
  ),
)
