import { useState, useCallback } from 'react'
import { GetGasStationsPayload } from '@/entities/gas-station/model/types/gas-station.payload'
import { GetGasStationsResponse } from '@/entities/gas-station/model/types/gas-station'
import { Directions } from '@/features/directions/api'

interface UseGasStationFiltersProps {
  updateGasStations: (
    variables: GetGasStationsPayload,
  ) => Promise<GetGasStationsResponse>
  directionsData: Directions | undefined
  finishFuel: number | undefined
  truckWeight: number | undefined
  fuel: string | undefined
}

export const useGasStationFilters = ({
  updateGasStations,
  directionsData,
  finishFuel,
  truckWeight,
  fuel,
}: UseGasStationFiltersProps) => {
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [markersKey, setMarkersKey] = useState(0)

  const handleFilterChange = useCallback(
    async (providers: string[]) => {
      setSelectedProviders(providers)
      setMarkersKey((prevKey) => prevKey + 1)

      if (!directionsData?.routeId || !directionsData.route) return

      await updateGasStations({
        routeId: directionsData.routeId,
        routeSectionIds: directionsData.route.map((r) => r.routeSectionId),
        FinishFuel: finishFuel,
        ...(truckWeight !== undefined &&
          truckWeight !== 0 && { Weight: truckWeight }),
        FuelProviderNameList: providers,
        CurrentFuel: fuel?.toString(),
      })
    },
    [updateGasStations, directionsData, finishFuel, truckWeight, fuel],
  )

  return {
    selectedProviders,
    markersKey,
    handleFilterChange,
    setSelectedProviders,
  }
}
