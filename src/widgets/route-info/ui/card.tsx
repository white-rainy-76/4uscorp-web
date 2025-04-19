import { Icon } from '@/shared/ui/Icon'
import { FuelStop } from '../types/fuel-stop'

interface FuelStopInfoProps {
  fuelStop: FuelStop
}

export const FuelStopInfo = ({ fuelStop }: FuelStopInfoProps) => {
  return (
    <div className="flex items-center w-full">
      {/* Left Section: Fuel Icon and Gallons - Proportional width */}
      <div className="flex-1 flex items-center gap-[14px]">
        <Icon name="common/fuel" width={26} height={31} />
        <div>
          <div className="font-extrabold text-sm">{fuelStop.gallons}</div>
          <div className="text-sm">Галонов</div>
        </div>
      </div>

      {/* Center Section: Truck Stop Logo and Address - Proportional width with more emphasis */}
      <div className="flex-[3] flex items-center gap-4">
        <div className="w-16 h-auto">
          <img
            src={fuelStop.logoSrc}
            alt={fuelStop.truckStopName}
            className="max-h-8 object-contain"
          />
        </div>
        <div className="text-sm">
          <div className="text-sm">Адрес</div>
          <div className="text-xs font-bold">{fuelStop.address}</div>
        </div>
      </div>

      {/* Right Section: Price - Proportional width */}
      <div className="flex-1 max-w-[172px] border border-dashed rounded-md py-2 px-3 flex gap-[14.75px]">
        <Icon name="common/dollar" width={15.5} height={31} />
        <div className="flex flex-col">
          <div className="font-extrabold text-sm">
            ${fuelStop.price.toFixed(3)}
          </div>
          <div className="text-sm">Цена</div>
        </div>
      </div>
    </div>
  )
}
