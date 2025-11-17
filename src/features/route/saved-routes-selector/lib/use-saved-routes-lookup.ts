'use client'

import { useEffect, useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { routeQueries } from '@/entities/route/api/route.queries'
import { GetSavedRoutesData } from '@/entities/route'
import { Coordinate } from '@/shared/types'

type UseSavedRoutesLookupParams = {
  origin: Coordinate | null | undefined
  destination: Coordinate | null | undefined
  enabled?: boolean
}

export function useSavedRoutesLookup({
  origin,
  destination,
  enabled = true,
}: UseSavedRoutesLookupParams) {
  const [savedRoutes, setSavedRoutes] = useState<GetSavedRoutesData>([])

  const hasOriginCoordinates =
    origin?.latitude !== undefined && origin?.longitude !== undefined
  const hasDestinationCoordinates =
    destination?.latitude !== undefined && destination?.longitude !== undefined

  // Запрос делаем только если есть обе координаты
  const shouldFetch = useMemo(() => {
    return enabled && hasOriginCoordinates && hasDestinationCoordinates
  }, [enabled, hasOriginCoordinates, hasDestinationCoordinates])

  const { data, isLoading, refetch } = useQuery({
    ...routeQueries.savedRoutes({
      startLatitude: origin?.latitude ?? 0,
      startLongitude: origin?.longitude ?? 0,
      endLatitude: destination?.latitude ?? 0,
      endLongitude: destination?.longitude ?? 0,
    }),
    enabled: shouldFetch,
  })

  useEffect(() => {
    if (data) {
      setSavedRoutes(data)
    } else {
      setSavedRoutes([])
    }
  }, [data])

  return {
    savedRoutes,
    isLoading,
    hasSavedRoutes: savedRoutes.length > 0,
    refetch,
  }
}
