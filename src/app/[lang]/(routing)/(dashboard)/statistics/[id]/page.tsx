'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { DriverDetails } from '@/entities/statistics'
import { useStatisticsStore } from '@/shared/store'
import { truckQueries } from '@/entities/truck'
import { InfoCard } from '@/shared/ui'
import { DriverInfo, DriverInfoSkeleton } from '@/widgets/info/driver-info'
import { useDictionary } from '@/shared/lib/hooks'
import { statisticsQueries } from '@/entities/statistics'

export default function StatisticsPage() {
  const { selectedDriver } = useStatisticsStore()
  const { dictionary } = useDictionary()

  const {
    data: truckData,
    isLoading: isTruckLoading,
    error: truckError,
  } = useQuery({
    ...truckQueries.truck(selectedDriver?.truckId || ''),
    enabled: !!selectedDriver?.truckId,
  })

  const { data: statisticsData } = useQuery({
    ...statisticsQueries.statistics({
      reportId: selectedDriver?.reportId || null,
      driverId: selectedDriver?.driverId || null,
    }),
    enabled: !!selectedDriver?.reportId && !!selectedDriver?.driverId,
  })

  if (!selectedDriver) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">
          {dictionary.home.statistics.choose_driver_for_statistics}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <InfoCard title={dictionary.home.headings.driver_info}>
        {isTruckLoading ? (
          <DriverInfoSkeleton />
        ) : (
          truckData && <DriverInfo truck={truckData} />
        )}
      </InfoCard>

      {statisticsData && (
        <DriverDetails
          reportId={selectedDriver.reportId}
          driver={selectedDriver}
          statisticsData={statisticsData}
        />
      )}
    </div>
  )
}
