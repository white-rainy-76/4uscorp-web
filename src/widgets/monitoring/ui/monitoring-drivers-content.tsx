'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { driverQueries } from '@/entities/driver'
import { useDictionary } from '@/shared/lib/hooks'
import { Button } from '@/shared/ui'
import { useMonitoringFiltersStore } from '../model/store'

export function MonitoringDriversContent() {
  const { dictionary } = useDictionary()
  const companyId = useMonitoringFiltersStore((s) => s.companyId)
  const setMode = useMonitoringFiltersStore((s) => s.setMode)

  const { data: drivers = [], isLoading, error } = useQuery({
    ...driverQueries.listByCompany(companyId ?? ''),
    enabled: !!companyId,
  })

  if (!companyId) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-10">
        <div className="text-2xl font-black text-text-heading">
          {dictionary.home.monitoring.drivers_by_company}
        </div>
        <div className="mt-2 text-muted-foreground">
          {dictionary.home.monitoring.select_partner_company_above}
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Button onClick={() => setMode('trucks')} className="rounded-xl">
            {dictionary.home.monitoring.show_trucks}
          </Button>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
        <div className="text-lg font-black text-text-heading">
          {dictionary.home.monitoring.drivers_load_error}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">
          {error.message}
        </div>
        <Button
          variant="outline"
          className="mt-4 rounded-xl"
          onClick={() => setMode('trucks')}>
          {dictionary.home.monitoring.show_trucks}
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="text-text-heading font-bold">{dictionary.home.monitoring.loading_drivers}</div>
      </div>
    )
  }

  if (drivers.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-muted/20 p-10">
        <div className="text-2xl font-black text-text-heading">
          {dictionary.home.monitoring.drivers_by_company}
        </div>
        <div className="mt-2 text-muted-foreground">
          {dictionary.home.monitoring.no_drivers_in_company}
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Button onClick={() => setMode('trucks')} className="rounded-xl">
            {dictionary.home.monitoring.show_trucks}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {drivers.map((driver) => (
        <div
          key={driver.id}
          className="flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="font-bold text-text-heading">
              {driver.fullName ?? '—'}
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {driver.phone ? <span>{driver.phone}</span> : null}
              {driver.email ? <span>{driver.email}</span> : null}
              {driver.truck?.unitNumber ? (
                <span>{dictionary.home.monitoring.truck_label}: {driver.truck.unitNumber}</span>
              ) : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
