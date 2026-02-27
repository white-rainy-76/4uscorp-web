'use client'

import React from 'react'
import { Truck, UsersRound } from 'lucide-react'

import { useDictionary } from '@/shared/lib/hooks'
import { Button, cn } from '@/shared/ui'
import { useMonitoringFiltersStore } from '../model/store'

export function MonitoringHeader() {
  const { dictionary } = useDictionary()
  const mode = useMonitoringFiltersStore((s) => s.mode)
  const setMode = useMonitoringFiltersStore((s) => s.setMode)

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="text-2xl font-black text-text-heading">
          {dictionary.home.navigation.monitoring}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant={mode === 'trucks' ? 'default' : 'outline'}
          className={cn(
            'rounded-xl',
            mode !== 'trucks' && 'bg-card text-text-heading',
          )}
          onClick={() => setMode('trucks')}>
          <Truck className="h-4 w-4 mr-2" />
          {dictionary.home.monitoring.trucks_tab}
        </Button>
        <Button
          variant={mode === 'drivers' ? 'default' : 'outline'}
          className={cn(
            'rounded-xl',
            mode !== 'drivers' && 'bg-card text-text-heading',
          )}
          onClick={() => setMode('drivers')}>
          <UsersRound className="h-4 w-4 mr-2" />
          {dictionary.home.monitoring.drivers_tab}
        </Button>
      </div>
    </div>
  )
}
