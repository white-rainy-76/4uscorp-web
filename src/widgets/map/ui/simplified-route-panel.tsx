'use client'

import React, { useMemo } from 'react'
import { InfoCard } from '@/shared/ui'
import { useDictionary } from '@/shared/lib/hooks'
import { Directions } from '@/features/directions/api'
import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'
import { useSavedRoutesStore } from '@/shared/store'
import { AxelType, TollPaymentType } from '@/entities/tolls/api'
import {
  getAvailablePaymentTypesForAxles,
  getTollPaymentTypeLabel,
  getTollPriceAmountFor,
} from '@/entities/tolls/lib/toll-pricing'

interface SimplifiedRoutePanelProps {
  directionsData?: Directions
  tolls?: TollWithSection[]
  selectedAxelType: AxelType
  selectedPaymentType: TollPaymentType
  onAxelTypeChange: (axelType: AxelType) => void
  onPaymentTypeChange: (paymentType: TollPaymentType) => void
}

export const SimplifiedRoutePanel = ({
  directionsData,
  tolls,
  selectedAxelType,
  selectedPaymentType,
  onAxelTypeChange,
  onPaymentTypeChange,
}: SimplifiedRoutePanelProps) => {
  const { dictionary } = useDictionary()
  const { sectionId } = useSavedRoutesStore()

  // Получаем информацию о маршруте из выбранной секции
  const routeInfo = useMemo(() => {
    if (!directionsData?.route || !sectionId) return null
    const selectedRoute = directionsData.route.find(
      (route) => route.routeSectionId === sectionId,
    )
    return selectedRoute?.routeInfo || null
  }, [directionsData, sectionId])

  // Форматируем время вождения
  const displayDriveTime = useMemo(() => {
    if (
      !routeInfo ||
      typeof routeInfo.driveTime !== 'number' ||
      routeInfo.driveTime < 0
    )
      return '-'
    const totalMinutes = Math.floor(routeInfo.driveTime / 60)
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (hours > 0) {
      return `${hours}h ${minutes}min`
    } else {
      return `${minutes}min`
    }
  }, [routeInfo])

  // Форматируем мили
  const displayMiles = useMemo(() => {
    if (
      !routeInfo ||
      typeof routeInfo.miles !== 'number' ||
      routeInfo.miles < 0
    )
      return '-'
    const milesInMeters = routeInfo.miles
    const convertedMiles = (milesInMeters * 0.000621371).toFixed(1)
    return convertedMiles
  }, [routeInfo])

  const filteredTolls = useMemo(() => {
    if (!tolls || !sectionId) return []
    return tolls.filter(
      (toll) => toll.routeSection === sectionId && !toll.isDynamic,
    )
  }, [tolls, sectionId])

  const availablePaymentTypes = useMemo(() => {
    return getAvailablePaymentTypesForAxles(filteredTolls, selectedAxelType)
  }, [filteredTolls, selectedAxelType])

  // Суммируем tolls для выбранной секции по выбранным осям и типу оплаты
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

  if (!directionsData) return null

  return (
    <div className="absolute top-4 left-4 z-10 w-[420px]">
      <InfoCard
        title="Route Info"
        className="shadow-xl border border-border bg-card/95 backdrop-blur-sm">
        <div className="grid grid-cols-3 gap-x-2 text-sm text-text-neutral font-semibold">
          <div className="flex flex-col items-start">
            <span className="font-normal">
              {dictionary.home.route_panel.drive_time}
            </span>
            <span className="font-bold whitespace-nowrap">
              {displayDriveTime}
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal">
              {dictionary.home.route_panel.miles}
            </span>
            <span className="font-bold whitespace-nowrap">
              {displayMiles}mi
            </span>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-normal">
              Tolls{' '}
              <span className="font-bold">
                ({getTollPaymentTypeLabel(selectedPaymentType)}:
              </span>{' '}
              {selectedAxelType} axles)
            </span>
            <span className="font-bold whitespace-nowrap">
              {tollsInfo.total > 0 ? `$${tollsInfo.total.toFixed(2)}` : '-'}
            </span>
          </div>
        </div>

        {/* Selectors */}
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-text-neutral/80 font-medium text-text-muted">
              Axles
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onAxelTypeChange(AxelType._5L)}
                className={
                  selectedAxelType === AxelType._5L
                    ? 'px-2 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white'
                    : 'px-2 py-1 rounded-md text-xs font-semibold bg-muted text-text-neutral hover:bg-muted/70'
                }>
                5
              </button>
              <button
                type="button"
                onClick={() => onAxelTypeChange(AxelType._6L)}
                className={
                  selectedAxelType === AxelType._6L
                    ? 'px-2 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white'
                    : 'px-2 py-1 rounded-md text-xs font-semibold bg-muted text-text-neutral hover:bg-muted/70'
                }>
                6
              </button>
            </div>
          </div>

          <div className="flex items-start justify-between gap-2">
            <span className="text-xs text-text-neutral/80 font-medium pt-1 text-text-muted">
              Payment Type
            </span>
            <div className="flex flex-wrap gap-1 justify-end">
              {availablePaymentTypes.length === 0 ? (
                <span className="text-xs text-text-neutral/60">-</span>
              ) : (
                availablePaymentTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onPaymentTypeChange(type)}
                    className={
                      selectedPaymentType === type
                        ? 'px-2 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white'
                        : 'px-2 py-1 rounded-md text-xs font-semibold bg-muted text-text-neutral hover:bg-muted/70'
                    }>
                    {getTollPaymentTypeLabel(type)}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </InfoCard>
    </div>
  )
}
