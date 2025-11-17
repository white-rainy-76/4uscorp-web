'use client'

import { useCallback } from 'react'
import { Coordinate } from '@/shared/types'
import { RouteRequestPayload, Directions } from '@/features/directions/api'
import { Truck } from '@/entities/truck'
import { useErrorsStore } from '@/shared/store'

type SubmitRouteFormPayload = {
  origin: Coordinate
  destination: Coordinate
  originName: string
  destinationName: string
  truckWeight?: number
  finishFuel?: number
}

type UseSubmitRouteParams = {
  truckData?: Truck
  setRouteForm: (payload: SubmitRouteFormPayload) => void
  handleDirectionsMutation: (
    payload: RouteRequestPayload,
  ) => Promise<Directions>
}

export function useSubmitRoute({
  truckData,
  setRouteForm,
  handleDirectionsMutation,
}: UseSubmitRouteParams) {
  const { clearAllErrors } = useErrorsStore()

  const handleSubmitRoute = useCallback(
    (formPayload: SubmitRouteFormPayload) => {
      if (!truckData) {
        console.error('Truck data is not available for route submission.')
        return
      }

      // Очищаем ошибки при поиске нового маршрута
      clearAllErrors()

      setRouteForm({
        origin: formPayload.origin,
        destination: formPayload.destination,
        originName: formPayload.originName,
        destinationName: formPayload.destinationName,
        truckWeight: formPayload.truckWeight,
        finishFuel: formPayload.finishFuel,
      })

      const payload: RouteRequestPayload = {
        origin: formPayload.origin,
        destination: formPayload.destination,
        TruckId: truckData.id,
        originName: formPayload.originName,
        destinationName: formPayload.destinationName,
      }

      handleDirectionsMutation(payload)
    },
    [truckData, setRouteForm, handleDirectionsMutation, clearAllErrors],
  )

  return { handleSubmitRoute }
}
