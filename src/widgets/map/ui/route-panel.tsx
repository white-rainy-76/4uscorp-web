'use client'

import React, { useMemo } from 'react'
import { GasStation } from '@/entities/gas-station/model/types/gas-station'
import { ScrollArea } from '@/shared/ui/scroll-area'
import { MultiSelect } from '@/shared/ui'
import { MapControl, ControlPosition } from '@vis.gl/react-google-maps'
import { useDictionary } from '@/shared/lib/hooks'
import { useCartStore, useRouteInfoStore } from '@/shared/store'

interface Props {
  onDeleteGasStation: (id: string) => void
  onFilterChange: (providers: string[]) => void
  onGasStationClick: (lat: number, lng: number) => void
  gasStations?: GasStation[]
}

const FUEL_PROVIDERS = ['TA', 'Pilot', 'Loves'].map((provider) => ({
  label: provider,
  value: provider,
}))

export const RoutePanelOnMap = ({
  onDeleteGasStation,
  onFilterChange,
  onGasStationClick,
  gasStations,
}: Props) => {
  const { dictionary } = useDictionary()
  const {
    fuelLeft,
    gallons,
    totalPrice,
    driveTime,
    miles,
    tollsOnline,
    tollsIPass,
  } = useRouteInfoStore()
  const { cart, selectedProviders } = useCartStore()

  const displayDriveTime = useMemo(() => {
    if (typeof driveTime !== 'number' || driveTime < 0) return ''
    const totalMinutes = Math.floor(driveTime / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0) {
      return `${hours}h ${minutes}min`
    } else {
      return `${minutes}min`
    }
  }, [driveTime])

  const displayMiles = useMemo(() => {
    if (typeof miles !== 'number' || miles < 0) return '-'
    const milesInMeters = miles
    const convertedMiles = (milesInMeters * 0.000621371).toFixed(1)

    return convertedMiles
  }, [miles])

  return (
    <MapControl position={ControlPosition.TOP_RIGHT}>
      <div className="w-[341px] p-4 bg-white rounded-xl shadow-lg space-y-5 border border-[#E1E5EA] z-[100] pointer-events-auto font-nunito">
        <div className="grid grid-cols-4 gap-x-2 text-sm text-text-neutral font-semibold">
          <div className="flex flex-col items-start">
            <span className="font-normal">
              {dictionary.home.route_panel.drive_time}
            </span>
            <span className=" font-bold whitespace-nowrap">
              {displayDriveTime}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal">
              {dictionary.home.route_panel.miles}
            </span>
            <span className=" font-bold whitespace-nowrap">
              {displayMiles}mi
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal ">
              {dictionary.home.route_panel.gallons}
            </span>
            <span className="font-bold whitespace-nowrap">
              {gallons?.toFixed(2) ?? '-'}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal ">
              {dictionary.home.route_panel.fuel_left}
            </span>
            <span className=" font-bold whitespace-nowrap">
              {fuelLeft?.toFixed(2) ?? '-'}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal ">
              {dictionary.home.route_panel.total_price}
            </span>
            <span className=" font-bold whitespace-nowrap">
              ${totalPrice?.toFixed(2) ?? '-'}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal ">Tolls Online</span>
            <span className=" font-bold whitespace-nowrap">
              {tollsOnline !== undefined ? `$${tollsOnline.toFixed(2)}` : '-'}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal ">IPass</span>
            <span className=" font-bold whitespace-nowrap">
              {tollsIPass !== undefined ? `$${tollsIPass.toFixed(2)}` : '-'}
            </span>
          </div>
        </div>

        {/* Filter Section */}
        <div className="space-y-2">
          <h3 className="font-black text-xl mb-2 text-text-heading">
            {dictionary.home.route_panel.filter}
          </h3>
          <MultiSelect
            options={FUEL_PROVIDERS}
            value={selectedProviders}
            onValueChange={onFilterChange}
            placeholder={dictionary.home.route_panel.fuel_providers}
            modalPopover={true}
            className="w-full"
          />
        </div>

        {/* Gas Stations Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-xl text-[#192A3E]">
              {dictionary.home.route_panel.gas_stations_list}
            </h3>
            <span className="text-sm text-[#9BA9BB] font-medium">
              {Object.keys(cart).length}{' '}
              {dictionary.home.route_panel.items_count}
            </span>
          </div>
          <ScrollArea className="h-40">
            <div className="space-y-4 pr-2">
              {Object.keys(cart).length > 0 && gasStations ? (
                Object.entries(cart).map(([stationId, cartItem]) => {
                  // Находим информацию о заправке по ID
                  const station = gasStations.find((s) => s.id === stationId)
                  if (!station) return null

                  return (
                    <div
                      key={stationId}
                      className="flex justify-between items-start text-sm p-2 bg-gray-50 rounded-md border border-gray-200">
                      <div
                        className="text-[#192A3E] hover:underline cursor-pointer flex-grow pr-2"
                        onClick={() =>
                          onGasStationClick(
                            station.position.lat,
                            station.position.lng,
                          )
                        }>
                        <span className="text-[#9BA9BB] font-normal block text-xs">
                          {dictionary.home.route_panel.address}
                        </span>
                        <span className="font-bold text-xs leading-4">
                          {station.address}
                        </span>
                        <span className="text-[#9BA9BB] font-normal block text-xs mt-1">
                          {dictionary.home.route_panel.refuel}{' '}
                          {cartItem.refillLiters}{' '}
                          {dictionary.home.input_fields.liters}
                        </span>
                        {station.isAlgorithm && (
                          <span className="text-[#F59E0B] font-normal block text-xs mt-1">
                            {dictionary.home.route_panel.algorithmic}
                          </span>
                        )}
                      </div>

                      <button
                        className="text-[#D84949] font-bold text-sm underline whitespace-nowrap ml-auto hover:text-red-700"
                        onClick={() => onDeleteGasStation(stationId)}>
                        {dictionary.home.route_panel.delete}
                      </button>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500">
                    {dictionary.home.route_panel.no_stations_selected}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {dictionary.home.route_panel.add_stations_message}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </MapControl>
  )
}
