'use client'

import React, { useMemo, useState, useCallback, useEffect } from 'react'
import { StatisticsDriverCard } from './statistics-driver-card'
import { StatisticsDriverCardSkeleton } from './statistics-driver-card-skeleton'
import { useDictionary } from '@/shared/lib/hooks'
import { useQuery } from '@tanstack/react-query'
import { driverStatisticsQueries } from '../api/driver-statistics.queries'
import { GenericList, ListFilters } from '@/shared/ui'
import { useStatisticsStore } from '@/shared/store'

export const StatisticsDriverList = () => {
  const [filterText, setFilterText] = useState<string>('')
  const { selectedDriver, setSelectedDriver, fileReportId } =
    useStatisticsStore()

  const { dictionary } = useDictionary()

  // Real API request
  const { data: drivers = [], isLoading } = useQuery({
    ...driverStatisticsQueries.driversByReport({ FileReportId: fileReportId! }),
    enabled: !!fileReportId,
  })

  const filteredAndSortedDrivers = useMemo(() => {
    const lower = filterText.trim().toLowerCase()
    const filtered = drivers.filter(
      (driver) =>
        driver.driverName?.toLowerCase().includes(lower) ||
        driver.truckUnit?.toLowerCase().includes(lower),
    )

    // Sort: red drivers first (unSucssesStationPlanCount > 0), then green drivers
    return filtered.sort((a, b) => {
      const aHasViolations = a.unSucssesStationPlanCount > 0
      const bHasViolations = b.unSucssesStationPlanCount > 0

      if (aHasViolations && !bHasViolations) return -1 // a comes first (red)
      if (!aHasViolations && bHasViolations) return 1 // b comes first (red)
      return 0 // keep original order for same color
    })
  }, [filterText, drivers])

  // Auto-select first driver when drivers are loaded and no driver is selected
  useEffect(() => {
    if (filteredAndSortedDrivers.length > 0 && !selectedDriver) {
      setSelectedDriver(filteredAndSortedDrivers[0])
    }
  }, [filteredAndSortedDrivers, selectedDriver, setSelectedDriver])

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
        items={filteredAndSortedDrivers}
        isLoading={isLoading}
        skeleton={Array.from({ length: 12 }).map((_, i) => (
          <StatisticsDriverCardSkeleton key={i} />
        ))}
        emptyMessage={dictionary.home.lists.no_drivers_found}
        renderItem={(driver) => (
          <StatisticsDriverCard
            key={driver.driverId}
            driver={driver}
            isActive={selectedDriver?.driverId === driver.driverId}
            onClick={() => setSelectedDriver(driver)}
          />
        )}
      />
    </div>
  )
}
