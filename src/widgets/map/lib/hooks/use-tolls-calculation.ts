import { useMemo } from 'react'
import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'
import { AxelType, TollPaymentType } from '@/entities/tolls/api'
import { getTollPriceAmountFor } from '@/entities/tolls/lib'

interface UseTollsCalculationParams {
  tolls: TollWithSection[]
  selectedAxelType: AxelType
  selectedPaymentType: TollPaymentType
  sectionId?: string | null
}

export function useTollsCalculation({
  tolls,
  selectedAxelType,
  selectedPaymentType,
  sectionId,
}: UseTollsCalculationParams) {
  const filteredTolls = useMemo(() => {
    if (!tolls || !sectionId) return []
    return tolls.filter(
      (toll) => toll.routeSection === sectionId && !toll.isDynamic,
    )
  }, [tolls, sectionId])

  const tollsInfo = useMemo(() => {
    if (!filteredTolls || filteredTolls.length === 0) {
      return { total: 0 }
    }

    const hasSelectedPrice = (toll: TollWithSection) => {
      return (
        getTollPriceAmountFor(
          toll.tollPrices,
          selectedAxelType,
          selectedPaymentType,
        ) != null
      )
    }

    // Оставляем по ключу toll, у которого есть цена для выбранных осей и типа оплаты
    const uniqueTollsByKey = filteredTolls.reduce((acc, toll) => {
      const key = toll.key || toll.id
      if (!acc.has(key)) {
        acc.set(key, toll)
      } else {
        const existingToll = acc.get(key)!
        const existingHasPrice = hasSelectedPrice(existingToll)
        const currentHasPrice = hasSelectedPrice(toll)
        if (currentHasPrice && !existingHasPrice) {
          acc.set(key, toll)
        }
      }
      return acc
    }, new Map<string, TollWithSection>())

    const uniqueTolls = Array.from(uniqueTollsByKey.values())

    const total = uniqueTolls.reduce((sum, toll) => {
      const amountFromTollPrices = getTollPriceAmountFor(
        toll.tollPrices,
        selectedAxelType,
        selectedPaymentType,
      )
      if (amountFromTollPrices != null && amountFromTollPrices > 0) {
        return sum + amountFromTollPrices
      }
      return sum
    }, 0)

    return { total }
  }, [filteredTolls, selectedAxelType, selectedPaymentType])

  return tollsInfo
}
