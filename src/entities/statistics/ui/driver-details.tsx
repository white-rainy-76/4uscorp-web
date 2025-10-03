'use client'

import React, { useMemo } from 'react'
import { format } from 'date-fns'
import { ru, enUS } from 'date-fns/locale'
import { useQuery } from '@tanstack/react-query'
import { statisticsQueries } from '../api/statistics.queries'
import { DriverStatistics } from '../model/types/driver-statistics'
import { Statistics } from '../model/types/statistics'
import { RouteSection } from './route-section'
import { useDictionary } from '@/shared/lib/hooks'

interface DriverDetailsProps {
  reportId: string
  driver: DriverStatistics
  statisticsData: Statistics
}

export function DriverDetails({
  reportId,
  driver,
  statisticsData,
}: DriverDetailsProps) {
  const { lang } = useDictionary()

  // Real API request (commented out for now)
  // const { data: realStatisticsData, isLoading: isStatisticsLoading } = useQuery(
  //   statisticsQueries.statistics({ reportId, driverId: driver.driverId }),
  // )

  // Use fake data for now
  // const statisticsData = realStatisticsData || fakeStatisticsData

  // Get the appropriate locale for date formatting
  const dateLocale = lang === 'ru' ? ru : enUS

  // Group routes by weekdays
  const groupedRoutes = useMemo(() => {
    const groups: { [key: string]: typeof statisticsData.fuelPlanReportItems } =
      {}

    statisticsData.fuelPlanReportItems.forEach((item) => {
      const startDate = new Date(item.fuelRouteInfo.startDate)
      const endDate = new Date(item.fuelRouteInfo.endDate)

      // Format weekdays with proper capitalization
      const startDay =
        format(startDate, 'EEEE', { locale: dateLocale })
          .charAt(0)
          .toUpperCase() +
        format(startDate, 'EEEE', { locale: dateLocale }).slice(1)
      const endDay =
        format(endDate, 'EEEE', { locale: dateLocale })
          .charAt(0)
          .toUpperCase() +
        format(endDate, 'EEEE', { locale: dateLocale }).slice(1)

      // If route is on the same day
      if (startDate.toDateString() === endDate.toDateString()) {
        const dayKey = `${format(startDate, 'd MMMM', { locale: dateLocale })}, ${startDay}`
        if (!groups[dayKey]) groups[dayKey] = []
        groups[dayKey].push(item)
      } else {
        // If route spans multiple days
        const dayKey = `${format(startDate, 'd MMMM', { locale: dateLocale })}, ${startDay} - ${format(endDate, 'd MMMM', { locale: dateLocale })}, ${endDay}`
        if (!groups[dayKey]) groups[dayKey] = []
        groups[dayKey].push(item)
      }
    })

    // Sort groups by start date of first route
    return Object.entries(groups).sort(([, a], [, b]) => {
      const dateA = new Date(a[0].fuelRouteInfo.startDate)
      const dateB = new Date(b[0].fuelRouteInfo.startDate)
      return dateA.getTime() - dateB.getTime()
    })
  }, [statisticsData, dateLocale])

  return (
    <div className="space-y-6">
      {groupedRoutes.map(([dayLabel, routes]) => (
        <div key={dayLabel} className="space-y-3">
          {/* Day header */}
          <h3 className="text-text-heading font-nunito font-black text-2xl leading-8 tracking-tight">
            {dayLabel}
          </h3>

          {/* Routes for this day */}
          <div className="space-y-4">
            {routes.map((route, index) => (
              <RouteSection
                key={`${route.fuelRouteInfo.routeId}-${index}`}
                routeInfo={route.fuelRouteInfo}
                gasStations={route.fuelPlanStation}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
