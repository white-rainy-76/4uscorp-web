'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { getLogoUrl } from '../lib/getLogoUrl'
import { GasStation } from '../api/types/gas-station'
import { Input } from '@/shared/ui'

interface Props {
  setClicked: (value: boolean) => void
  gasStation: GasStation
  isInCart: boolean
  onAddToCart: (station: GasStation) => void
  onRemoveFromCart: (stationId: string) => void
  onUpdateRefillLiters: (stationId: string, liters: number) => void
}

export const CustomPin: React.FC<Props> = ({
  setClicked,
  gasStation,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateRefillLiters,
}) => {
  const [refillLiters, setRefillLiters] = useState<string>(
    gasStation.refill ?? '',
  )

  const handleCartClick = () => {
    const refillNum = parseFloat(refillLiters)
    console.log('Refill number ' + refillNum)
    console.log('Is in cart ' + isInCart)

    const updatedStation: GasStation = {
      ...gasStation,
      refill: refillLiters,
    }
    isInCart ? onRemoveFromCart(gasStation.id) : onAddToCart(updatedStation)
  }

  const handleSaveClick = () => {
    const refillNum = parseFloat(refillLiters)
    if (!isNaN(refillNum)) {
      onUpdateRefillLiters(gasStation.id, refillNum)
    }
  }

  return (
    <div className="custom-pin bg-white rounded-md p-2 border border-gray-300 relative shadow-md w-56">
      <button
        className="absolute top-1 right-1 text-gray-500 hover:text-gray-800"
        onClick={(e) => {
          e.stopPropagation()
          setClicked(false)
        }}>
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
        <p className="text-sm font-semibold mt-1 text-text-strong">
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
          <p className="text-gray-600">
            Fuel before gas station:{' '}
            <span className="font-bold text-green-600">
              {gasStation.fuelLeftBeforeRefill}
            </span>
          </p>
        </div>

        {/* Ввод и кнопки */}
        <div className="mt-2 flex items-center justify-between gap-2">
          <input
            type="number"
            className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm text-black"
            min={0}
            value={refillLiters}
            onChange={(e) => setRefillLiters(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            placeholder="Литры"
          />
          <button
            onClick={handleSaveClick}
            className="px-2 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
            💾
          </button>
        </div>

        <button
          className="mt-2 w-full px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
          onClick={handleCartClick}>
          {isInCart ? 'Удалить из корзины' : 'Добавить в корзину'}
        </button>
      </div>

      <div className="tip" />
    </div>
  )
}
