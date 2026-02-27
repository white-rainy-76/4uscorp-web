'use client'

import React, { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'

import { truckQueries } from '@/entities/truck'
import { useDictionary } from '@/shared/lib/hooks'
import { Button } from '@/shared/ui'
import { useMonitoringFiltersStore } from '../model/store'
import { MonitoringTruckCard } from './monitoring-truck-card'
import { MonitoringTruckCardSkeleton } from './monitoring-truck-card-skeleton'

export function MonitoringTrucksContent() {
  const { dictionary } = useDictionary()
  const companyId = useMonitoringFiltersStore((s) => s.companyId)
  const search = useMonitoringFiltersStore((s) => s.search)
  const statusFilter = useMonitoringFiltersStore((s) => s.statusFilter)
  const clearSearch = useMonitoringFiltersStore((s) => s.clearSearch)
  const clearStatusFilter = useMonitoringFiltersStore((s) => s.clearStatusFilter)

  const {
    data: trucks = [],
    isLoading: isTrucksLoading,
    error: trucksError,
  } = useQuery({
    ...truckQueries.listByCompany(companyId ?? ''),
    enabled: !!companyId,
  })

  const filteredTrucks = useMemo(() => {
    const q = search.trim().toLowerCase()
    const byStatus =
      statusFilter === 'ALL'
        ? trucks
        : trucks.filter((t) => t.status === statusFilter)

    if (!q) return byStatus

    return byStatus.filter((t) => {
      const hay = [
        t.name,
        t.licensePlate,
        t.driver?.fullName ?? '',
        t.make,
        t.model,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [search, statusFilter, trucks])

  if (trucksError) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="text-lg font-black text-text-heading">
          {dictionary.home.monitoring.trucks_load_error}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {trucksError.message}
        </div>
      </div>
    )
  }

  if (isTrucksLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <MonitoringTruckCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (filteredTrucks.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-10 text-center">
        <div className="text-xl font-black text-text-heading">
          {dictionary.home.monitoring.nothing_found}
        </div>
        <div className="mt-2 text-muted-foreground">
          {dictionary.home.monitoring.try_change_filters}
        </div>
        <div className="mt-6 flex items-center justify-center gap-2">
          {search ? (
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={clearSearch}>
              {dictionary.home.monitoring.clear_search}
            </Button>
          ) : null}
          {statusFilter !== 'ALL' ? (
            <Button
              variant="outline"
              className="rounded-xl text-text-heading"
              onClick={clearStatusFilter}>
              {dictionary.home.monitoring.reset_status}
            </Button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {filteredTrucks.map((truck) => (
        <MonitoringTruckCard key={truck.id} truck={truck} />
      ))}
    </div>
  )
}
