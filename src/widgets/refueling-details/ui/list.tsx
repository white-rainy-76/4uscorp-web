import { RouteIndicator } from '@/shared/ui'
import React, { useMemo } from 'react'
import { FuelStopInfo } from './card'
import {
  GasStation,
  FuelStationStatusType,
  gasStationQueries,
} from '@/entities/gas-station'
import { useDictionary } from '@/shared/lib/hooks'
import { useQuery } from '@tanstack/react-query'
import { useRouteInfoStore, useCartStore } from '@/shared/store'

interface RouteListProps {
  gasStations: GasStation[]
}

export const RouteList = ({ gasStations }: RouteListProps) => {
  const { dictionary } = useDictionary()
  const { selectedSectionId, routeId } = useRouteInfoStore()
  const { cart } = useCartStore()

  // Получаем заправки из cart, фильтруем по selectedSectionId и находим полные данные
  const cartStations = useMemo(() => {
    const stationIds = Object.keys(cart)
    return gasStations
      .filter(
        (station) =>
          stationIds.includes(station.id) &&
          station.roadSectionId === selectedSectionId,
      )
      .sort((a, b) => (a.stopOrder || 0) - (b.stopOrder || 0))
  }, [cart, gasStations, selectedSectionId])

  // Получаем статусы заправок каждые 2 секунды
  const { data: fuelStationStatuses = [] } = useQuery({
    ...gasStationQueries.fuelStationArrived(routeId || ''),
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
    return cartStations.map((station) => station.id)
  }, [cartStations])

  if (cartStations.length === 0) {
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
          pointCount={cartStations.length}
          fuelStationStatuses={statusMap}
          gasStationIds={gasStationIds}
        />
      </div>

      <div className="flex flex-col space-y-6 w-full">
        {cartStations.map((station, index) => (
          <FuelStopInfo
            key={station.id}
            station={station}
            refillLiters={cart[station.id]?.refillLiters}
            isLast={index === cartStations.length - 1}
          />
        ))}
      </div>
    </div>
  )
}
