'use client'

import React, { useMemo, useState, useCallback } from 'react'
import { Card, CardSkeleton } from '@/entities/truck'
import { useDictionary } from '@/shared/lib/hooks'
import { useQuery } from '@tanstack/react-query'
import { truckQueries } from '@/entities/truck'
import { useParams } from 'next/navigation'
import { GenericList, ListFilters } from '@/shared/ui'

export const TruckList = () => {
  const [filterText, setFilterText] = useState<string>('')
  const params = useParams()
  const activeTruckId = typeof params?.id === 'string' ? params.id : null

  const { dictionary } = useDictionary()
  const { data: trucks = [], isLoading } = useQuery(truckQueries.list())

  const filteredTrucks = useMemo(() => {
    const lower = filterText.trim().toLowerCase()
    return trucks.filter((truck) => truck.name?.toLowerCase().includes(lower))
  }, [filterText, trucks])

  const handleFilterChange = useCallback((filters: { search?: string }) => {
    setFilterText(filters.search ?? '')
  }, [])

  return (
    <div className="flex flex-col space-y-6 h-full">
      <ListFilters
        onChange={handleFilterChange}
        initialSearch={filterText}
        placeholder={dictionary.home.input_fields.find_unit_placeholder}
      />

      <GenericList
        items={filteredTrucks}
        isLoading={isLoading}
        skeleton={Array.from({ length: 12 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
        emptyMessage={dictionary.home.trucks.no_trucks_found}
        renderItem={(truck) => (
          <Card
            key={truck.id}
            truck={truck}
            isActive={activeTruckId === truck.id}
          />
        )}
      />
    </div>
  )
}
