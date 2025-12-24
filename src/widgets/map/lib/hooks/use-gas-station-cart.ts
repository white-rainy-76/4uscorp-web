import { useCallback } from 'react'
import { GasStation } from '@/entities/gas-station'
import {
  useChangeFuelPlanMutation,
  FuelPlanOperation,
  FuelPlanChangeResponse,
} from '@/features/directions/api'
import { useCartStore, useRouteInfoStore, useErrorsStore } from '@/shared/store'

interface UseGasStationCartProps {
  clearAlternativeRoutes?: (() => void) | null
}

export const useGasStationCart = ({
  clearAlternativeRoutes,
}: UseGasStationCartProps) => {
  const { selectedSectionId, setRouteInfo } = useRouteInfoStore()
  const { cart, setCart, clearCart, fuelPlanId, updateCartItem } =
    useCartStore()
  const {
    setGasStationError,
    clearGasStationErrors,
    setGasStationGlobalErrors,
  } = useErrorsStore()

  const { mutateAsync: changeFuelPlan } = useChangeFuelPlanMutation({
    onSuccess: (data: FuelPlanChangeResponse) => {
      console.log('Fuel plan change response:', data)

      if (!data.isValid && data.stepResults) {
        // Очищаем предыдущие ошибки
        clearGasStationErrors()
        setGasStationGlobalErrors([])

        const gasStationGlobalErrorsList: string[] = []

        data.stepResults.forEach((result) => {
          if (!result.isValid && result.notes) {
            // Игнорируем ошибки с stationId равным "00000000-0000-0000-0000-000000000000"
            if (result.stationId !== '00000000-0000-0000-0000-000000000000') {
              // Устанавливаем ошибку для конкретной заправки
              setGasStationError(result.stationId, result.notes)
            } else {
              // Для общих ошибок добавляем их в gasStationGlobalErrors
              gasStationGlobalErrorsList.push(result.notes)
            }
          }
        })

        if (gasStationGlobalErrorsList.length > 0) {
          setGasStationGlobalErrors(gasStationGlobalErrorsList)
        }
      } else {
        // Очищаем ошибки если все валидно
        clearGasStationErrors()
        setGasStationGlobalErrors([])
      }

      // Обрабатываем изменения для обновления refillLiters и fuelBeforeRefill в cart
      if (data.changes && data.changes.length > 0) {
        console.log('Processing changes:', data.changes)

        data.changes.forEach((change) => {
          if (
            change.fuelStationId !== '00000000-0000-0000-0000-000000000000' &&
            cart[change.fuelStationId]
          ) {
            // Обновляем refillLiters из newRefill и fuelBeforeRefill из newCurrentFuel
            updateCartItem(
              change.fuelStationId,
              change.newRefill,
              change.newCurrentFuel,
            )
          }
        })
      }

      // Обновляем route info store с данными из ответа
      setRouteInfo({
        fuelLeft: data.finalFuelAmount,
        gallons: data.totalFuelAmmount,
        totalPrice: data.totalPriceAmmount,
      })
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

  // Добавление заправки в корзину
  const handleAddToCart = async (station: GasStation, refillLiters: number) => {
    try {
      setCart({
        ...cart,
        [station.id]: {
          refillLiters,
        },
      })
      // Сначала вызываем API
      await changeFuelPlan({
        routeSectionId: selectedSectionId || '',
        fuelStationChange: {
          fuelStationId: station.id,
          newRefill: refillLiters,
        },
        operation: FuelPlanOperation.Add,
        fuelPlanId: fuelPlanId ?? undefined,
      })

      // Очищаем альтернативные маршруты
      clearAlternativeRoutes?.()
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  // Удаление заправки из корзины
  const handleRemoveFromCart = async (stationId: string) => {
    try {
      const { [stationId]: removed, ...rest } = cart
      setCart(rest)
      // Сначала вызываем API
      await changeFuelPlan({
        routeSectionId: selectedSectionId || '',
        fuelStationChange: {
          fuelStationId: stationId,
          newRefill: null,
        },
        operation: FuelPlanOperation.Remove,
        fuelPlanId: fuelPlanId ?? undefined,
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
        routeSectionId: selectedSectionId || '',
        fuelStationChange: {
          fuelStationId: stationId,
          newRefill: liters,
        },
        operation: FuelPlanOperation.Update,
        fuelPlanId: fuelPlanId ?? undefined,
      })

      // Очищаем альтернативные маршруты
      clearAlternativeRoutes?.()
    } catch (error) {
      console.error('Failed to update refill liters:', error)
    }
  }

  // Очистка корзины и ошибок
  const clearCartAndErrors = useCallback(() => {
    clearCart()
    clearGasStationErrors()
    setGasStationGlobalErrors([])
  }, [clearCart, clearGasStationErrors, setGasStationGlobalErrors])

  return {
    cart,
    isStationInCart,
    handleAddToCart,
    handleRemoveFromCart,
    handleUpdateRefillLiters,
    clearCartAndErrors,
  }
}
