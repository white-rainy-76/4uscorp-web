'use client'
import React from 'react'
import Link from 'next/link'
import { MapWithRoute } from '@/widgets/map'
import { RouteSearchForm } from '@/features/search-route'
import { DriverInfo } from '@/widgets/driver-info'
import { RouteIndicator } from '@/shared/ui/route-indicator'
import { InfoCard } from '@/shared/ui/info-card'
import { RouteList } from '@/widgets/route-info/ui/list'

export default function TruckInfo() {
  return (
    <>
      <DriverInfo />
      <InfoCard title="Информация о маршруте">
        <RouteSearchForm />
        <MapWithRoute />
      </InfoCard>
      <RouteList />
    </>
  )
}
