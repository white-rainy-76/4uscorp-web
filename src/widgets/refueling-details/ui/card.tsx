import { Icon } from '@/shared/ui'
import { GasStation, getLogoUrl } from '@/entities/gas-station'
import { useDictionary } from '@/shared/lib/hooks'
import Image from 'next/image'

interface FuelStopInfoProps {
  station: GasStation
  isLast?: boolean
}

export const FuelStopInfo = ({ station, isLast }: FuelStopInfoProps) => {
  const { dictionary } = useDictionary()
  const gallons = (station.refill ? Number(station.refill) : 0).toFixed(0)
  const price = station.fuelPrice?.finalPrice
    ? Number(station.fuelPrice.finalPrice)
    : station.fuelPrice?.price
      ? Number(station.fuelPrice.price)
      : 0
  const formattedPrice = price.toFixed(3)
  const nextDistance = station.nextDistanceKm
    ? Number(station.nextDistanceKm).toFixed(1)
    : null
  const discount = station.fuelPrice?.discount
    ? Number(station.fuelPrice.discount).toFixed(3)
    : null

  return (
    <div className="flex items-center w-full">
      {/* Left Section: Fuel Icon and Gallons */}
      <div className="flex-1 flex items-center gap-2">
        <Icon name="common/fuel" width={26} height={31} />
        <div className="leading-tight">
          <div className="font-extrabold text-sm text-text-strong">
            {gallons}
          </div>
          <div className="text-xs text-text-muted-alt">
            {dictionary.home.details_info.gallons}
          </div>
        </div>
      </div>

      {/* Center Section: Station Info */}
      <div className="flex-[3] flex items-center gap-3">
        <div className="w-12 flex items-center justify-center">
          {station.isAlgorithm && (
            <Image
              alt="gas-station"
              src={getLogoUrl(station.name)}
              width={28}
              height={28}
              className="mx-auto"
            />
          )}
        </div>
        <div className="text-sm leading-tight space-y-[2px]">
          <div className="text-xs text-text-muted">
            {dictionary.home.details_info.adress}
          </div>
          <div className="text-xs font-bold text-text-heading">
            {station.address || 'Адрес не указан'}
            {station.nextDistanceKm && !isLast && (
              <span className="text-gray-500 ml-1">
                ({nextDistance} {dictionary.home.details_info.miles_next})
              </span>
            )}
          </div>
          {station.stopOrder !== undefined && (
            <div className="text-xs text-gray-500">
              {dictionary.home.details_info.stop_order}: {station.stopOrder}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Price */}
      <div className="flex-1 max-w-[172px] border border-dashed rounded-md py-1.5 px-2.5 flex gap-3">
        <Icon name="common/dollar" width={15.5} height={31} />
        <div className="flex flex-col leading-tight space-y-[2px]">
          <div className="font-extrabold text-sm text-text-strong">
            ${formattedPrice}
          </div>
          <div className="text-xs text-text-muted-alt">
            {dictionary.home.details_info.price}
          </div>
          {station.fuelPrice?.discount && (
            <div className="text-[11px] text-green-500">
              {dictionary.home.details_info.save} ${discount}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
