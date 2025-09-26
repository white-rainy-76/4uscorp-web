import { RouteIndicator } from '@/shared/ui'
import React, { useMemo } from 'react'
import { FuelStopInfo } from './card'
import { GasStation } from '@/entities/gas-station'
import { useDictionary } from '@/shared/lib/hooks'
import { useQuery } from '@tanstack/react-query'
import { routeQueries } from '@/entities/route/api/route.queries'
import { FuelStationStatusType } from '@/entities/route/model/types/fuel-station-status'

interface RouteListProps {
  gasStations: GasStation[]
  selectedRouteId: string | null
  routeId?: string | null
}

export const RouteList = ({
  gasStations,
  selectedRouteId,
  routeId,
}: RouteListProps) => {
  const { dictionary } = useDictionary()

  const algorithmStations = gasStations
    .filter(
      (station) =>
        station.roadSectionId === selectedRouteId && station.isAlgorithm,
    )
    .sort((a, b) => (a.stopOrder || 0) - (b.stopOrder || 0))

  // Получаем статусы заправок каждые 2 секунды
  const { data: fuelStationStatuses = [] } = useQuery({
    ...routeQueries.fuelStationArrived(routeId || ''),
    enabled: !!routeId,
  })

  // Преобразуем массив статусов в объект для быстрого поиска
  const statusMap = useMemo(() => {
    const map: { [fuelStationId: string]: FuelStationStatusType } = {}
    fuelStationStatuses.forEach((status) => {
      map[status.fuelStationId] = status.status
    })
    return map
  }, [fuelStationStatuses])

  // Получаем ID заправок в правильном порядке
  const gasStationIds = useMemo(() => {
    return algorithmStations.map((station) => station.id)
  }, [algorithmStations])

  if (algorithmStations.length === 0) {
    return (
      <div className="text-text-strong text-center py-4">
        {dictionary.home.details_info.no_gas_stations}
      </div>
    )
  }

  return (
    <div className="flex gap-6">
      <div className="mt-3">
        <RouteIndicator
          pointCount={algorithmStations.length}
          fuelStationStatuses={statusMap}
          gasStationIds={gasStationIds}
        />
      </div>

      <div className="flex flex-col space-y-6 w-full">
        {algorithmStations.map((station, index) => (
          <FuelStopInfo
            key={station.id}
            station={station}
            isLast={index === algorithmStations.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
