'use client'

import React, { useMemo } from 'react'
import { GasStation } from '@/entities/gas-station/api/types/gas-station'
import { Directions as DirectionsType } from '@/features/directions/api'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { MultiSelect } from '@/shared/ui'
import { MapControl, ControlPosition } from '@vis.gl/react-google-maps'

interface Props {
  selectedRouteId: string | null
  onDeleteGasStation: (id: string) => void
  onFilterChange: (providers: string[]) => void
  onGasStationClick: (lat: number, lng: number) => void
  directions?: DirectionsType
  selectedProviders: string[]
  cart: GasStation[]
  fuelLeftOver: number | undefined
}

const FUEL_PROVIDERS = [
  'TA',
  'Pilot',
  'Loves',
  'Sapp Bros',
  'Road Rangers',
  'Petro',
].map((provider) => ({ label: provider, value: provider }))

export const RoutePanelOnMap = ({
  selectedRouteId,
  onDeleteGasStation,
  onFilterChange,
  onGasStationClick,
  directions,
  selectedProviders,
  cart,
  fuelLeftOver,
}: Props) => {
  const route = directions?.route.find(
    (r) => r.routeSectionId === selectedRouteId,
  )
  const routeInfo = route?.routeInfo

  const displayDriveTime = useMemo(() => {
    if (
      !routeInfo ||
      typeof routeInfo.driveTime !== 'number' ||
      routeInfo.driveTime < 0
    )
      return ''
    const totalMinutes = Math.floor(routeInfo.driveTime / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0) {
      return `${hours}h ${minutes}min`
    } else {
      return `${minutes}min`
    }
  }, [routeInfo])

  const displayMiles = useMemo(() => {
    if (
      !routeInfo ||
      typeof routeInfo.miles !== 'number' ||
      routeInfo.miles < 0
    )
      return '-'
    const milesInMeters = routeInfo.miles
    const convertedMiles = (milesInMeters * 0.000621371).toFixed(1)

    return convertedMiles
  }, [routeInfo])

  return (
    <MapControl position={ControlPosition.TOP_RIGHT}>
      <div className="w-[341px] p-4 bg-white rounded-xl shadow-lg space-y-5 border border-[#E1E5EA] z-[100] pointer-events-auto font-nunito">
        <div className="grid grid-cols-4 gap-x-2 text-sm text-text-neutral font-semibold">
          <div className="flex flex-col items-start">
            <span className="font-normal">Drive time:</span>
            <span className=" font-bold whitespace-nowrap">
              {displayDriveTime}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal">Miles:</span>
            <span className=" font-bold whitespace-nowrap">
              {displayMiles}mi
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal ">Gallons:</span>
            <span className="font-bold whitespace-nowrap">
              {routeInfo?.gallons ?? '-'}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal ">Tolls:</span>
            <span className=" font-bold whitespace-nowrap">
              ${routeInfo?.tolls ?? '-'}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal ">Fuel Left</span>
            <span className=" font-bold whitespace-nowrap">
              {fuelLeftOver?.toFixed(2) ?? '-'}
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="space-y-2">
          <h3 className="font-black text-xl mb-2 text-text-heading">Фильтр</h3>
          <MultiSelect
            options={FUEL_PROVIDERS}
            value={selectedProviders}
            onValueChange={onFilterChange}
            placeholder="Fuel Providers"
            modalPopover={true}
            className="w-full"
          />
        </div>

        {/* Gas Stations Section */}
        <div className="space-y-2">
          <h3 className="font-extrabold text-xl mb-2 text-[#192A3E]">
            Список заправок
          </h3>
          <ScrollArea className="h-40">
            <div className="space-y-4 pr-2">
              {cart.length > 0 ? (
                cart.map((station) => (
                  <div
                    key={station.id}
                    className="flex justify-between items-start text-sm">
                    <div
                      className="text-[#192A3E] hover:underline cursor-pointer flex-grow pr-2" // Added flex-grow and padding-right
                      onClick={() =>
                        onGasStationClick(
                          station.position.lat,
                          station.position.lng,
                        )
                      }>
                      <span className="text-[#9BA9BB] font-normal block text-xs">
                        Адрес
                      </span>
                      <span className="font-bold text-xs leading-4">
                        {station.address}
                      </span>
                    </div>

                    <button
                      className="text-[#D84949] font-bold text-sm underline whitespace-nowrap ml-auto" // Adjusted styling for delete
                      onClick={() => onDeleteGasStation(station.id)}>
                      delete
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No gas stations available
                </p>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </MapControl>
  )
}
