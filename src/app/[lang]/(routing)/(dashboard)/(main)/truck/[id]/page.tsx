'use client'

import { useMemo } from 'react'
import { useParams, notFound } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'

import { TruckDetailsWidget } from '@/widgets/truck-details'
import { truckQueries } from '@/entities/truck/api'

export default function TruckPage() {
  const params = useParams()

  const truckId = useMemo(() => {
    const truckIdParam = params?.id
    return typeof truckIdParam === 'string' ? truckIdParam : undefined
  }, [params?.id])

  if (!truckId) {
    notFound()
  }

  const {
    data: truckData,
    isLoading: isTruckLoading,
    isError: isTruckError,
  } = useQuery({
    ...truckQueries.truck(truckId),
    enabled: !!truckId,
  })

  if (!isTruckLoading && isTruckError) {
    notFound()
  }

  return (
    <TruckDetailsWidget truckData={truckData} isTruckLoading={isTruckLoading} />
  )
}
