'use client'
import React from 'react'
import { MapWithRoute } from '@/widgets/map'
import { RouteSearchForm } from '@/features/search-route'
import { DriverInfo } from '@/widgets/driver-info'
import { InfoCard } from '@/shared/ui/info-card'
import { RouteList } from '@/widgets/route-info'

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
