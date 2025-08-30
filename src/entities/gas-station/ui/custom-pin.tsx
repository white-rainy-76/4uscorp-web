'use client'

import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { getLogoUrl } from '../lib/getLogoUrl'
import { GasStation } from '../model/types/gas-station'
import { Input } from '@/shared/ui'

interface Props {
  setClicked: (value: boolean) => void
  gasStation: GasStation
  isInCart: boolean
  onAddToCart: (station: GasStation, refillLiters: number) => void
  onRemoveFromCart: (stationId: string) => void
  onUpdateRefillLiters: (stationId: string, liters: number) => void
  errorMessage?: string
  getStationRefillLiters: (station: GasStation) => number
  getStationFuelLeftBeforeRefill: (station: GasStation) => number
}

export const CustomPin: React.FC<Props> = ({
  setClicked,
  gasStation,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateRefillLiters,
  errorMessage,
  getStationRefillLiters,
  getStationFuelLeftBeforeRefill,
}) => {
  // Инициализируем refillLiters из корзины или из исходных данных
  const [refillLiters, setRefillLiters] = useState<string>(
    getStationRefillLiters(gasStation).toString(),
  )

  // Синхронизируем refillLiters при изменении isInCart
  useEffect(() => {
    setRefillLiters(getStationRefillLiters(gasStation).toString())
  }, [isInCart, getStationRefillLiters, gasStation])

  const handleCartClick = () => {
    const refillNum = parseFloat(refillLiters)
    console.log('Refill number ' + refillNum)
    console.log('Is in cart ' + isInCart)

    if (isInCart) {
      onRemoveFromCart(gasStation.id)
    } else {
      onAddToCart(gasStation, refillNum)
    }
  }

  const handleSaveClick = () => {
    const refillNum = parseFloat(refillLiters)
    if (!isNaN(refillNum)) {
      onUpdateRefillLiters(gasStation.id, refillNum)
    }
  }

  // Получаем обновленный fuelLeftBeforeRefill
  const updatedFuelLeftBeforeRefill = getStationFuelLeftBeforeRefill(gasStation)

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
              {updatedFuelLeftBeforeRefill.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md text-xs">
            <p className="text-red-700 font-semibold">
              ⚠️ Ошибка: {errorMessage}
            </p>
          </div>
        )}

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
          {/* Кнопка обновления показывается только если заправка в корзине */}
          {isInCart && (
            <button
              onClick={handleSaveClick}
              className="px-2 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
              💾
            </button>
          )}
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
