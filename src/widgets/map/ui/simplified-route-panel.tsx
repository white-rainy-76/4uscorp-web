'use client'

import React, { useMemo } from 'react'
import { InfoCard } from '@/shared/ui'
import { useDictionary } from '@/shared/lib/hooks'
import { Directions } from '@/features/directions/api'
import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'
import { useSavedRoutesStore } from '@/shared/store'
import { AxelType, TollPaymentType } from '@/entities/tolls/api'
import { getTollPaymentTypeLabel } from '@/entities/tolls/lib'
import { TollSelectors } from './toll-selectors'
import { useTollsCalculation } from '../lib/hooks'

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

  // Используем переиспользуемый хук для вычисления стоимости tolls
  const tollsInfo = useTollsCalculation({
    tolls: filteredTolls,
    selectedAxelType,
    selectedPaymentType,
    sectionId,
  })

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
        {filteredTolls.length > 0 && (
          <div className="mt-3">
            <TollSelectors
              tolls={filteredTolls}
              selectedAxelType={selectedAxelType}
              selectedPaymentType={selectedPaymentType}
              onAxelTypeChange={onAxelTypeChange}
              onPaymentTypeChange={onPaymentTypeChange}
            />
          </div>
        )}
      </InfoCard>
    </div>
  )
}
