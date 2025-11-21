'use client'

import React, { useMemo } from 'react'
import { InfoCard } from '@/shared/ui'
import { useDictionary } from '@/shared/lib/hooks'
import { Directions } from '@/features/directions/api'
import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'
import { useSavedRoutesStore } from '@/shared/store'

interface SimplifiedRoutePanelProps {
  directionsData?: Directions
  tolls?: TollWithSection[]
}

export const SimplifiedRoutePanel = ({
  directionsData,
  tolls,
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

  // Суммируем tolls для выбранной секции
  const tollsInfo = useMemo(() => {
    if (!tolls || !sectionId) {
      return { tollsOnline: 0, tollsIPass: 0 }
    }

    // Фильтруем tolls по выбранной секции и убираем дубликаты по key (или id)
    const filteredTolls = tolls.filter(
      (toll) => toll.routeSection === sectionId,
    )

    const uniqueTollKeys = new Set<string>()
    const uniqueTolls: TollWithSection[] = []

    filteredTolls.forEach((toll) => {
      const key = toll.key || toll.id
      if (!uniqueTollKeys.has(key)) {
        uniqueTollKeys.add(key)
        uniqueTolls.push(toll)
      }
    })

    const tollsOnline = uniqueTolls.reduce((sum, toll) => {
      return sum + (toll.payOnline || 0)
    }, 0)

    const tollsIPass = uniqueTolls.reduce((sum, toll) => {
      return sum + (toll.iPass || 0)
    }, 0)

    return { tollsOnline, tollsIPass }
  }, [tolls, sectionId])

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
            <span className="font-normal">Tolls Online</span>
            <span className="font-bold whitespace-nowrap">
              {tollsInfo.tollsOnline > 0
                ? `$${tollsInfo.tollsOnline.toFixed(2)}`
                : '-'}
            </span>
          </div>
          <div className="flex flex-col items-start col-span-3">
            <span className="font-normal">IPass</span>
            <span className="font-bold whitespace-nowrap">
              {tollsInfo.tollsIPass > 0
                ? `$${tollsInfo.tollsIPass.toFixed(2)}`
                : '-'}
            </span>
          </div>
        </div>
      </InfoCard>
    </div>
  )
}
