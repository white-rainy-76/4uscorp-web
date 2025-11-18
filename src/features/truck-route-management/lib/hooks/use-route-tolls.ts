'use client'

import { useEffect, useState } from 'react'
import { useGetTollsAlongPolylineSectionsMutation } from '@/features/tolls/get-tolls-along-polyline-sections'
import { TollWithSection } from '@/features/tolls/get-tolls-along-polyline-sections'
import { RouteByIdData } from '@/entities/route'
import { Directions } from '@/features/directions/api'

type UseRouteTollsParams = {
  routeByIdData?: RouteByIdData
  directionsResponseData?: Directions
}

export function useRouteTolls({
  routeByIdData,
  directionsResponseData,
}: UseRouteTollsParams) {
  const [tollsData, setTollsData] = useState<TollWithSection[]>([])

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
