'use client'

import { useEffect, useState, useMemo } from 'react'
import { useGetTollsAlongPolylineSectionsMutation } from '@/features/tolls/get-tolls-along-polyline-sections'
import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'
import { RouteByIdData } from '@/entities/route'
import { Directions } from '@/features/directions/api'
import { useRouteInfoStore } from '@/shared/store'

type UseRouteTollsParams = {
  routeByIdData?: RouteByIdData
  directionsResponseData?: Directions
}

export function useRouteTolls({
  routeByIdData,
  directionsResponseData,
}: UseRouteTollsParams) {
  const [tollsData, setTollsData] = useState<TollWithSection[]>([])
  const { selectedSectionId, setTollsOnline, setTollsIPass } =
    useRouteInfoStore()

  const { mutateAsync: getTollsAlongSections, isPending: isTollsLoading } =
    useGetTollsAlongPolylineSectionsMutation({
      onSuccess: (data) => {
        setTollsData(data)
      },
      onError: (error) => {
        console.error('Get tolls along sections error:', error)
        setTollsData([])
      },
    })

  // Фильтруем tolls по выбранной секции
  const filteredTolls = useMemo(() => {
    if (!tollsData || !selectedSectionId) return []
    return tollsData.filter((toll) => toll.routeSection === selectedSectionId)
  }, [tollsData, selectedSectionId])

  // Пересчитываем сумму tolls при смене секции или получении новых tolls
  useEffect(() => {
    if (filteredTolls.length > 0) {
      // Фильтруем дубликаты по ключу - оставляем только уникальные ключи
      // Приоритет отдаём первому toll с ценой (payOnline или iPass)
      const uniqueTollsByKey = filteredTolls.reduce((acc, toll) => {
        const key = toll.key || toll.id

        // Если ключ еще не встречался, добавляем toll
        if (!acc.has(key)) {
          acc.set(key, toll)
        } else {
          // Если ключ уже есть, проверяем цены
          const existingToll = acc.get(key)!
          const existingHasPrice =
            (existingToll.payOnline !== undefined &&
              existingToll.payOnline > 0) ||
            (existingToll.iPass !== undefined && existingToll.iPass > 0)
          const currentHasPrice =
            (toll.payOnline !== undefined && toll.payOnline > 0) ||
            (toll.iPass !== undefined && toll.iPass > 0)

          // Если у текущего toll есть цена, а у существующего нет - заменяем
          if (currentHasPrice && !existingHasPrice) {
            acc.set(key, toll)
          }
          // Если у обоих нет цены или у обоих есть - оставляем первый (уже сохраненный)
        }
        return acc
      }, new Map<string | null, TollWithSection>())

      const uniqueTolls = Array.from(uniqueTollsByKey.values())

      // Суммируем payOnline только для уникальных tolls
      const totalTollsOnline = uniqueTolls.reduce((sum, toll) => {
        return sum + (toll.payOnline || 0)
      }, 0)
      setTollsOnline(totalTollsOnline)

      // Суммируем iPass только для уникальных tolls
      const totalTollsIPass = uniqueTolls.reduce((sum, toll) => {
        return sum + (toll.iPass || 0)
      }, 0)
      setTollsIPass(totalTollsIPass)
    } else {
      setTollsOnline(undefined)
      setTollsIPass(undefined)
    }
  }, [filteredTolls, setTollsOnline, setTollsIPass])

  // Когда приходит routeByIdData (одна секция)
  useEffect(() => {
    if (routeByIdData?.sectionId) {
      getTollsAlongSections([routeByIdData.sectionId])
    }
  }, [routeByIdData?.sectionId, getTollsAlongSections])

  // Когда приходит directionsResponseData (множество секций)
  useEffect(() => {
    if (
      directionsResponseData?.route &&
      directionsResponseData.route.length > 0
    ) {
      const sectionIds = directionsResponseData.route.map(
        (route) => route.routeSectionId,
      )
      if (sectionIds.length > 0) {
        getTollsAlongSections(sectionIds)
      }
    }
  }, [directionsResponseData, getTollsAlongSections])

  return {
    tollsData,
    isTollsLoading,
  }
}
