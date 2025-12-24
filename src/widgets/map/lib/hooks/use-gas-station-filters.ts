import { useState, useCallback } from 'react'
import { GetGasStationsPayload } from '@/entities/gas-station/model/types/gas-station.payload'
import { GetGasStationsResponse } from '@/entities/gas-station/model/types/gas-station'
import {
  useRouteFormStore,
  useRouteInfoStore,
  useCartStore,
  useErrorsStore,
} from '@/shared/store'

interface UseGasStationFiltersProps {
  updateGasStations: (
    variables: GetGasStationsPayload,
  ) => Promise<GetGasStationsResponse>
}

export const useGasStationFilters = ({
  updateGasStations,
}: UseGasStationFiltersProps) => {
  const { finishFuel, truckWeight } = useRouteFormStore()
  const { routeId, sectionIds } = useRouteInfoStore()
  const { selectedProviders, setSelectedProviders } = useCartStore()
  const { clearAllErrors } = useErrorsStore()
  const [markersKey, setMarkersKey] = useState(0)

  const handleFilterChange = useCallback(
    async (providers: string[]) => {
      // Очищаем ошибки при изменении фильтров
      clearAllErrors()

      setSelectedProviders(providers)
      setMarkersKey((prevKey) => prevKey + 1)

      if (!routeId || sectionIds.length === 0) return

      await updateGasStations({
        routeId: routeId,
        routeSectionIds: sectionIds,
        FinishFuel: finishFuel,
        ...(truckWeight !== undefined &&
          truckWeight !== 0 && { Weight: truckWeight }),
        FuelProviderNameList: providers,
      })
    },
    [
      updateGasStations,
      finishFuel,
      truckWeight,
      routeId,
      sectionIds,
      setSelectedProviders,
      clearAllErrors,
    ],
  )

  return {
    selectedProviders,
    markersKey,
    handleFilterChange,
  }
}
