'use client'

import React, { useEffect, useState } from 'react'
import { MapWithRoute } from '@/widgets/map'
import { RouteSearchForm } from '@/features/search-route'
import { DriverInfo } from '@/widgets/driver-info'
import { InfoCard } from '@/shared/ui/info-card'
import { RouteList } from '@/widgets/route-info'
import { useDictionary } from '@/shared/lib/hooks'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Coordinate } from '@/shared/types'
import { truckQueries } from '@/entities/truck/api'

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
  }, [truckId, isError, isLoading])

  return (
    <>
      {data && (
        <>
          <DriverInfo truck={data} />

          <InfoCard title={dictionary.home.headings.route_info}>
            <RouteSearchForm
              setOrigin={setOrigin}
              setDestination={setDestination}
            />
          </InfoCard>
          <MapWithRoute origin={origin} destination={destination} />
          <InfoCard title={dictionary.home.headings.details_info}>
            <RouteList />
          </InfoCard>
        </>
      )}
    </>
  )
}
