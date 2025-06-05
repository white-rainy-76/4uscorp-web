import { Icon } from '@/shared/ui'
import { GasStation } from '@/entities/gas-station'

interface FuelStopInfoProps {
  station: GasStation
  isLast?: boolean
}

export const FuelStopInfo = ({ station, isLast }: FuelStopInfoProps) => {
  const gallons = station.refill ? Number(station.refill) : 0

  const price = station.fuelPrice?.finalPrice
    ? Number(station.fuelPrice.finalPrice)
    : station.fuelPrice?.price
      ? Number(station.fuelPrice.price)
      : 0

  return (
    <div className="flex items-center w-full">
      {/* Left Section: Fuel Icon and Gallons */}
      <div className="flex-1 flex items-center gap-2">
        <Icon name="common/fuel" width={26} height={31} />
        <div className="leading-tight">
          <div className="font-extrabold text-sm text-[hsl(var(--text-strong))]">
            {gallons.toFixed(0)}
          </div>
          <div className="text-xs text-[hsl(var(--text-muted-alt))]">
            Галонов
          </div>
        </div>
      </div>

      {/* Center Section: Station Info */}
      <div className="flex-[3] flex items-center gap-3">
        <div className="w-12 flex items-center justify-center">
          {station.isAlgorithm && (
            <Icon name="common/fuel" width={28} height={28} />
          )}
        </div>
        <div className="text-sm leading-tight space-y-[2px]">
          <div className="text-xs text-[hsl(var(--text-muted))]">Адрес</div>
          <div className="text-xs font-bold text-[hsl(var(--text-heading))]">
            {station.address || 'Адрес не указан'}
            {station.nextDistanceKm && !isLast && (
              <span className="text-gray-500 ml-1">
                ({Number(station.nextDistanceKm).toFixed(1)} km next)
              </span>
            )}
          </div>
          {station.stopOrder !== undefined && (
            <div className="text-xs text-gray-500">
              Stop order: {station.stopOrder}
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Price */}
      <div className="flex-1 max-w-[172px] border border-dashed rounded-md py-1.5 px-2.5 flex gap-3">
        <Icon name="common/dollar" width={15.5} height={31} />
        <div className="flex flex-col leading-tight space-y-[2px]">
          <div className="font-extrabold text-sm text-[hsl(var(--text-strong))]">
            ${price.toFixed(3)}
          </div>
          <div className="text-xs text-[hsl(var(--text-muted-alt))]">Цена</div>
          {station.fuelPrice?.discount && (
            <div className="text-[11px] text-green-500">
              Save ${Number(station.fuelPrice.discount).toFixed(3)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
