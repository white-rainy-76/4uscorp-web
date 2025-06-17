'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Input } from '@/shared/ui'
import { Card, CardSkeleton } from '@/entities/truck'
import { useDebounce, useDictionary } from '@/shared/lib/hooks'
import { useQuery } from '@tanstack/react-query'
import { truckQueries } from '@/entities/truck/api'
import { useParams } from 'next/navigation'
import { TruckListFilters } from './truck-list-filters'
import { TruckFilters } from '../types'

export const TruckList = () => {
  const [filterText, setFilterText] = useState<string>('')
  const params = useParams()
  const truckIdParam = params?.id
  const activeTruckId = typeof truckIdParam === 'string' ? truckIdParam : null

  const { dictionary } = useDictionary()
  const { data: trucks = [], isLoading } = useQuery(truckQueries.list())

  const filteredTrucks = useMemo(() => {
    const lower = filterText.trim().toLowerCase()
    return trucks.filter((truck) => truck.name?.toLowerCase().includes(lower))
  }, [filterText, trucks])

  const handleFilterChange = useCallback((filters: TruckFilters) => {
    setFilterText(filters.search ?? '')
  }, [])

  return (
    <div className="flex flex-col space-y-6 h-full">
      <TruckListFilters
        onChange={handleFilterChange}
        initialSearch={filterText}
        placeholder={dictionary.home.input_fields.find_unit_placeholder}
      />

      <div className="flex-1 overflow-y-auto p-1 pr-2 custom-scroll">
        <div className="space-y-4 mb-[120px]">
          {isLoading ? (
            Array.from({ length: 12 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : filteredTrucks.length > 0 ? (
            filteredTrucks.map((truck) => (
              <Card
                key={truck.id}
                truck={truck}
                isActive={activeTruckId === truck.id}
              />
            ))
          ) : (
            <p className="text-center text-text-heading">
              {dictionary.home.trucks.no_trucks_found}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
