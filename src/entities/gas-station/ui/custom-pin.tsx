import Image from 'next/image'
import React from 'react'
import { GasStation } from '../model/gas-station'
import { getLogoUrl } from '../lib/getLogoUrl'

export const CustomPin = (
  setClicked: (value: boolean) => void,
  gasStation: GasStation,
) => {
  return (
    <div className="custom-pin bg-white rounded-md p-2 border border-gray-300 relative">
      <button
        className="absolute top-1 right-1 text-gray-500"
        onClick={() => setClicked(false)}>
        ✖
      </button>
      <div className="text-center">
        <Image
          alt="gas-station"
          src={getLogoUrl(gasStation.name)}
          width={32}
          height={32}
          className="mx-auto"
        />
        <p className="text-sm font-semibold mt-1 text-[hsl(var(--text-strong))]">
          {gasStation.address}
        </p>
        <div className="mt-2 p-2 bg-gray-100 rounded-md text-xs">
          <p className="text-gray-600">
            Цена:{' '}
            <span className="font-bold">
              {gasStation.fuelPrice?.price ?? 'N/A'}₴
            </span>
          </p>
          <p className="text-gray-600">
            Скидка:{' '}
            <span className="font-bold text-orange-600">
              {gasStation.fuelPrice?.discount ?? 'N/A'}₴
            </span>
          </p>
          <p className="text-gray-600">
            Итог:{' '}
            <span className="font-bold text-green-600">
              {gasStation.fuelPrice?.finalPrice ?? 'N/A'}₴
            </span>
          </p>
        </div>
      </div>
      <div className="tip" />
    </div>
  )
}
