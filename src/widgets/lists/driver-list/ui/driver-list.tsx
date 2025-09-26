'use client'

import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { DriverCard, DriverCardSkeleton } from '@/entities/driver'
import { useDictionary } from '@/shared/lib/hooks'
import { useQuery } from '@tanstack/react-query'
import { driverQueries } from '@/entities/driver'
import { useParams, useRouter } from 'next/navigation'
import { GenericList, ListFilters } from '@/shared/ui'

export const DriverList = () => {
  const [filterText, setFilterText] = useState<string>('')
  const params = useParams()
  const router = useRouter()
  const activeDriverId = typeof params?.id === 'string' ? params.id : null

  const { dictionary, lang } = useDictionary()
  const { data: drivers = [], isLoading } = useQuery(driverQueries.list())

  const filteredDrivers = useMemo(() => {
    const lower = filterText.trim().toLowerCase()
    return drivers.filter((driver) =>
      driver.fullName?.toLowerCase().includes(lower),
    )
  }, [filterText, drivers])

  // Автоматически выбираем первый элемент, если нет активного
  useEffect(() => {
    if (filteredDrivers.length > 0 && !activeDriverId && !isLoading) {
      const firstDriver = filteredDrivers[0]
      router.push(`/${lang}/drivers/driver/${firstDriver.id}`)
    }
  }, [filteredDrivers, activeDriverId, isLoading, router, lang])

  const handleFilterChange = useCallback((filters: { search?: string }) => {
    setFilterText(filters.search ?? '')
  }, [])

  return (
    <div className="flex flex-col space-y-6 h-full">
      <ListFilters
        onChange={handleFilterChange}
        initialSearch={filterText}
        placeholder={dictionary.home.input_fields.search_drivers}
      />

      <GenericList
        items={filteredDrivers}
        isLoading={isLoading}
        skeleton={Array.from({ length: 12 }).map((_, i) => (
          <DriverCardSkeleton key={i} />
        ))}
        emptyMessage={dictionary.home.lists.no_drivers_found}
        renderItem={(driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            isActive={activeDriverId === driver.id}
          />
        )}
      />
    </div>
  )
}
