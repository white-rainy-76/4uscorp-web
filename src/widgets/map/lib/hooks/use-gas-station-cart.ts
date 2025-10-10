import { useState, useCallback } from 'react'
import { GasStation } from '@/entities/gas-station'
import {
  useChangeFuelPlanMutation,
  FuelPlanOperation,
  FuelPlanChangeResponse,
} from '@/features/directions/api'

interface GasStationCartItem {
  refillLiters: number
}

interface GasStationCart {
  [stationId: string]: GasStationCartItem
}

interface StationErrors {
  [stationId: string]: string
}

interface StationChanges {
  [stationId: string]: number
}

interface MapError {
  stationId: string
  message: string
}

interface UseGasStationCartProps {
  selectedRouteId: string | null
  fuel: string | undefined
  getPriorityFuelPlanId: () => string | undefined
  clearAlternativeRoutes?: (() => void) | null
}

export const useGasStationCart = ({
  selectedRouteId,
  fuel,
  getPriorityFuelPlanId,
  clearAlternativeRoutes,
}: UseGasStationCartProps) => {
  const [cart, setCart] = useState<GasStationCart>({})
  const [stationErrors, setStationErrors] = useState<StationErrors>({})
  const [stationChanges, setStationChanges] = useState<StationChanges>({})
  const [mapErrors, setMapErrors] = useState<MapError[]>([])
  const [finalFuelAmount, setFinalFuelAmount] = useState<number | undefined>(
    undefined,
  )
  const [updatedFuelAmount, setUpdatedFuelAmount] = useState<
    number | undefined
  >(undefined)
  const [updatedPriceAmount, setUpdatedPriceAmount] = useState<
    number | undefined
  >(undefined)

  const { mutateAsync: changeFuelPlan } = useChangeFuelPlanMutation({
    onSuccess: (data: FuelPlanChangeResponse) => {
      console.log('Fuel plan change response:', data)

      if (!data.isValid && data.stepResults) {
        // Обрабатываем ошибки и создаем объект ошибок для маркеров
        const errors: StationErrors = {}
        const mapErrorMessages: MapError[] = []

        data.stepResults.forEach((result) => {
          if (!result.isValid && result.notes) {
            // Игнорируем ошибки с stationId равным "00000000-0000-0000-0000-000000000000"
            if (result.stationId !== '00000000-0000-0000-0000-000000000000') {
              errors[result.stationId] = result.notes
              mapErrorMessages.push({
                stationId: result.stationId,
                message: result.notes,
              })
            } else {
              // Для общих ошибок добавляем их в mapErrors без привязки к конкретной заправке
              mapErrorMessages.push({
                stationId: 'general',
                message: result.notes,
              })
            }
          }
        })

        setStationErrors(errors)
        setMapErrors(mapErrorMessages)
      } else {
        // Очищаем ошибки если все валидно
        setStationErrors({})
        setMapErrors([])
      }

      // Обрабатываем изменения для обновления fuelLeftBeforeRefill
      if (data.changes && data.changes.length > 0) {
        console.log('Processing changes:', data.changes)
        const changes: StationChanges = {}

        data.changes.forEach((change) => {
          if (change.fuelStationId !== '00000000-0000-0000-0000-000000000000') {
            changes[change.fuelStationId] = change.newCurrentFuel
            console.log(
              `Updated fuel for station ${change.fuelStationId}: ${change.newCurrentFuel}`,
            )
          }
        })

        setStationChanges(changes)
      }

      // Сохраняем finalFuelAmount из ответа API
      if (data.finalFuelAmount !== undefined) {
        setFinalFuelAmount(data.finalFuelAmount)
      }

      // Сохраняем новые значения totalFuelAmmount и totalPriceAmmount из ответа API
      if (data.totalFuelAmmount !== undefined) {
        setUpdatedFuelAmount(data.totalFuelAmmount)
      }
      if (data.totalPriceAmmount !== undefined) {
        setUpdatedPriceAmount(data.totalPriceAmmount)
      }
    },
    onError: (error: any) => {
      console.error('Fuel plan change error:', error)
    },
  })

  // Проверяем, находится ли заправка в корзине
  const isStationInCart = useCallback(
    (stationId: string) => {
      return stationId in cart
    },
    [cart],
  )

  // Получаем refillLiters для заправки (из корзины или из исходных данных)
  const getStationRefillLiters = useCallback(
    (station: GasStation) => {
      if (isStationInCart(station.id)) {
        return cart[station.id].refillLiters
      }
      return parseFloat(station.refill || '0')
    },
    [cart, isStationInCart],
  )

  // Получаем обновленный fuelLeftBeforeRefill для заправки (из изменений или из исходных данных)
  const getStationFuelLeftBeforeRefill = useCallback(
    (station: GasStation) => {
      if (stationChanges[station.id] !== undefined) {
        return stationChanges[station.id]
      }
      return station.fuelLeftBeforeRefill || 0
    },
    [stationChanges],
  )

  // Добавление заправки в корзину
  const handleAddToCart = async (station: GasStation, refillLiters: number) => {
    try {
      // Сначала вызываем API
      await changeFuelPlan({
        routeSectionId: selectedRouteId || '',
        currentFuelPercent: parseFloat(fuel || '0'),
        fuelStationChange: {
          fuelStationId: station.id,
          newRefill: refillLiters,
        },
        operation: FuelPlanOperation.Add,
        fuelPlanId: getPriorityFuelPlanId(),
      })

      // Если API успешен, добавляем в корзину
      setCart((prev) => ({
        ...prev,
        [station.id]: { refillLiters },
      }))

      // Очищаем альтернативные маршруты
      clearAlternativeRoutes?.()
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  // Удаление заправки из корзины
  const handleRemoveFromCart = async (stationId: string) => {
    try {
      // Сначала вызываем API
      await changeFuelPlan({
        routeSectionId: selectedRouteId || '',
        currentFuelPercent: parseFloat(fuel || '0'),
        fuelStationChange: {
          fuelStationId: stationId,
          newRefill: null,
        },
        operation: FuelPlanOperation.Remove,
        fuelPlanId: getPriorityFuelPlanId(),
      })

      // Если API успешен, удаляем из корзины
      setCart((prev) => {
        const newCart = { ...prev }
        delete newCart[stationId]
        return newCart
      })

      // Очищаем альтернативные маршруты
      clearAlternativeRoutes?.()
    } catch (error) {
      console.error('Failed to remove from cart:', error)
    }
  }

  // Обновление refillLiters для заправки в корзине
  const handleUpdateRefillLiters = async (
    stationId: string,
    liters: number,
  ) => {
    try {
      // Сначала вызываем API
      await changeFuelPlan({
        routeSectionId: selectedRouteId || '',
        currentFuelPercent: parseFloat(fuel || '0'),
        fuelStationChange: {
          fuelStationId: stationId,
          newRefill: liters,
        },
        operation: FuelPlanOperation.Update,
        fuelPlanId: getPriorityFuelPlanId(),
      })

      // Если API успешен, обновляем корзину
      setCart((prev) => ({
        ...prev,
        [stationId]: { refillLiters: liters },
      }))

      // Очищаем альтернативные маршруты
      clearAlternativeRoutes?.()
    } catch (error) {
      console.error('Failed to update refill liters:', error)
    }
  }

  // Очистка корзины и ошибок
  const clearCartAndErrors = useCallback(() => {
    setCart({})
    setStationErrors({})
    setStationChanges({})
    setMapErrors([])
    setFinalFuelAmount(undefined)
  }, [])

  // Установка корзины (для инициализации алгоритмическими заправками)
  const setCartData = useCallback((cartData: GasStationCart) => {
    setCart(cartData)
  }, [])

  // Обертки для сеттеров с useCallback
  const updateMapErrors = useCallback((errors: MapError[]) => {
    setMapErrors(errors)
  }, [])

  const updateFinalFuelAmount = useCallback((amount: number | undefined) => {
    setFinalFuelAmount(amount)
  }, [])

  return {
    cart,
    stationErrors,
    stationChanges,
    mapErrors,
    finalFuelAmount,
    updatedFuelAmount,
    updatedPriceAmount,
    isStationInCart,
    getStationRefillLiters,
    getStationFuelLeftBeforeRefill,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateRefillLiters,
    clearCartAndErrors,
    setCartData,
    setMapErrors: updateMapErrors,
    setFinalFuelAmount: updateFinalFuelAmount,
  }
}
