'use client'

import Image from 'next/image'
import React, { useState, useEffect, useCallback } from 'react'
import { getLogoUrl } from '../lib/getLogoUrl'
import { GasStation } from '../model/types/gas-station'
import { Input } from '@/shared/ui'
import { useDictionary } from '@/shared/lib/hooks'
import { useCartStore } from '@/shared/store'

interface Props {
  setClicked: (value: boolean) => void
  gasStation: GasStation
  isInCart: boolean
  onAddToCart: (station: GasStation, refillLiters: number) => void
  onRemoveFromCart: (stationId: string) => void
  onUpdateRefillLiters: (stationId: string, liters: number) => void
  errorMessage?: string
}

export const CustomPin: React.FC<Props> = ({
  setClicked,
  gasStation,
  isInCart,
  onAddToCart,
  onRemoveFromCart,
  onUpdateRefillLiters,
  errorMessage,
}) => {
  const { dictionary } = useDictionary()
  const { cart } = useCartStore()

  // Получаем refillLiters из cart или из исходных данных
  const getRefillLiters = useCallback(() => {
    if (isInCart && cart[gasStation.id]) {
      return cart[gasStation.id].refillLiters
    }
    return parseFloat(gasStation.refill || '0')
  }, [isInCart, cart, gasStation.id, gasStation.refill])

  // Получаем fuelBeforeRefill из cart или из исходных данных
  const getFuelBeforeRefill = useCallback(() => {
    if (isInCart && cart[gasStation.id]?.fuelBeforeRefill !== undefined) {
      return cart[gasStation.id].fuelBeforeRefill!
    }
    return gasStation.fuelLeftBeforeRefill || 0
  }, [isInCart, cart, gasStation.id, gasStation.fuelLeftBeforeRefill])

  // Инициализируем refillLiters из корзины или из исходных данных
  const [refillLiters, setRefillLiters] = useState<string>(() =>
    getRefillLiters().toString(),
  )

  // Синхронизируем refillLiters при изменении isInCart или cart
  useEffect(() => {
    setRefillLiters(getRefillLiters().toString())
  }, [getRefillLiters])

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
  const updatedFuelLeftBeforeRefill = getFuelBeforeRefill()

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
            {dictionary.home.gas_station.price}:{' '}
            <span className="font-bold">
              ${gasStation.fuelPrice?.price ?? 'N/A'}
            </span>
          </p>
          <p className="text-gray-600">
            {dictionary.home.gas_station.discount}:{' '}
            <span className="font-bold text-orange-600">
              ${gasStation.fuelPrice?.discount ?? 'N/A'}
            </span>
          </p>
          <p className="text-gray-600">
            {dictionary.home.gas_station.total}:{' '}
            <span className="font-bold text-green-600">
              ${gasStation.fuelPrice?.finalPrice ?? 'N/A'}
            </span>
          </p>
          <p className="text-gray-600">
            {dictionary.home.gas_station.fuel_before_station}:{' '}
            <span className="font-bold text-green-600">
              {updatedFuelLeftBeforeRefill.toFixed(2)}
            </span>
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md text-xs">
            <p className="text-red-700 font-semibold">
              ⚠️ {dictionary.home.errors.error}: {errorMessage}
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
            placeholder={dictionary.home.input_fields.liters}
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
          {isInCart
            ? dictionary.home.gas_station.remove_from_cart
            : dictionary.home.gas_station.add_to_cart}
        </button>
      </div>

      <div className="tip" />
    </div>
  )
}
