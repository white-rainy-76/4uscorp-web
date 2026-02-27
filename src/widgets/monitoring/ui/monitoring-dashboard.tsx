'use client'

import React from 'react'

import { useMonitoringFiltersStore } from '../model/store'
import { MonitoringHeader } from './monitoring-header'
import { MonitoringToolbar } from './monitoring-toolbar'
import { MonitoringTrucksContent } from './monitoring-trucks-content'
import { MonitoringDriversContent } from './monitoring-drivers-content'

export function MonitoringDashboard() {
  const mode = useMonitoringFiltersStore((s) => s.mode)

  return (
    <div
      className="h-screen bg-foreground overflow-hidden"
      style={{ width: 'calc(100vw - 92px)' }}>
      <main className="h-full overflow-y-auto bg-background rounded-[32px] p-6 my-6 ml-2 mr-6 space-y-6 custom-scroll">
        <MonitoringHeader />
        <MonitoringToolbar />

        {mode === 'trucks' ? (
          <div className="space-y-4">
            <MonitoringTrucksContent />
          </div>
        ) : (
          <div className="space-y-4">
            <MonitoringDriversContent />
          </div>
        )}
      </main>
    </div>
  )
}
