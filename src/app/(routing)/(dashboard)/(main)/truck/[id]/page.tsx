'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { DriverInfo } from '@/widgets/driver-info'
import { InfoCard } from '@/shared/ui/info-card'
import { useDictionary } from '@/shared/lib/hooks'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Coordinate } from '@/shared/types'
import { truckQueries } from '@/entities/truck/api'
import { DriverInfoSkeleton } from '@/widgets/driver-info/ui/driver-info.skeleton'
import { RouteList } from '@/widgets/refueling-details'
import { TruckRouteInfo } from '@/widgets/truck-route/ui'
import { useGetDirectionsMutation } from '@/features/directions/api/get-direction.mutation'
import { MapWithRoute } from '@/widgets/map'

export default function TruckInfo() {
  const { dictionary } = useDictionary()
  const params = useParams()
  const router = useRouter()

  const [origin, setOrigin] = useState<Coordinate | null>(null)
  const [destination, setDestination] = useState<Coordinate | null>(null)

  const truckId = useMemo(() => {
    const truckIdParam = params?.id
    return typeof truckIdParam === 'string' ? truckIdParam : undefined
  }, [params?.id])

  const {
    data: truckData,
    isLoading: isTruckLoading,
    isError: isTruckError,
  } = useQuery({
    ...truckQueries.truck(truckId!),
    enabled: !!truckId,
  })

  const {
    mutateAsync: getDirections,
    data: routeData,
    isPending: isRouteLoading,
    reset: resetRoute,
  } = useGetDirectionsMutation({
    onError: (error) => {
      console.error('Directions mutation error:', error)
    },
  })

  useEffect(() => {
    if (!truckId || (isTruckError && !isTruckLoading)) {
      router.replace('/404')
    }
  }, [truckId, isTruckError, isTruckLoading, router])

  useEffect(() => {
    if (!truckData) return

    const hasBothPoints = origin && destination
    hasBothPoints ? getDirections({ origin, destination }) : resetRoute()
  }, [origin, destination, truckData, getDirections, resetRoute])

  return (
    <>
      <InfoCard title={dictionary.home.headings.driver_info}>
        {isTruckLoading ? (
          <DriverInfoSkeleton />
        ) : (
          truckData && <DriverInfo truck={truckData} />
        )}
      </InfoCard>

      {truckData && (
        <InfoCard title={dictionary.home.headings.driver_info}>
          <TruckRouteInfo
            truck={truckData}
            setOrigin={setOrigin}
            setDestination={setDestination}
          />
        </InfoCard>
      )}

      <MapWithRoute
        origin={origin}
        destination={destination}
        routeData={routeData}
        isPending={isRouteLoading}
        mutateAsync={getDirections}
      />
      {routeData && (
        <InfoCard title={dictionary.home.headings.details_info}>
          <RouteList gasStations={routeData.gasStations} />
        </InfoCard>
      )}
    </>
  )
}
