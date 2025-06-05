'use client'

import React, { useEffect, useState } from 'react'
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

  const truckIdParam = params?.id
  const truckId = typeof truckIdParam === 'string' ? truckIdParam : undefined

  const { data, isLoading, isError } = useQuery({
    ...truckQueries.truck(truckId!),
    enabled: !!truckId,
  })

  useEffect(() => {
    if (!truckId || (isError && !isLoading)) {
      router.replace('/404')
    }
  }, [truckId, isError, isLoading, router])

  const {
    mutateAsync,
    data: routeData,
    isPending,
    reset,
  } = useGetDirectionsMutation({
    onError: (error, variables, context) => {
      console.log(`Directions mutation error: ${error}`)
      if (context?.abortController) {
        context.abortController.abort(
          'Directions request cancelled due to error',
        )
      }
    },
  })

  useEffect(() => {
    if (origin && destination) {
      mutateAsync({
        origin,
        destination,
      })
    } else {
      reset()
    }
  }, [origin, destination, mutateAsync, reset])

  return (
    <>
      <InfoCard title={dictionary.home.headings.driver_info}>
        {isLoading && <DriverInfoSkeleton />}
        {data && <DriverInfo truck={data} />}
      </InfoCard>

      {data && (
        <TruckRouteInfo
          truck={data}
          setOrigin={setOrigin}
          setDestination={setDestination}
        />
      )}

      <MapWithRoute
        origin={origin}
        destination={destination}
        routeData={routeData}
        isPending={isPending}
        mutateAsync={mutateAsync}
      />
      {routeData && (
        <InfoCard title={dictionary.home.headings.details_info}>
          <RouteList gasStations={routeData.gasStations} />
        </InfoCard>
      )}
    </>
  )
}
