'use client'
import React from 'react'
import { MapWithTrucks } from '@/widgets/map'
import { PricesUpload } from '@/features/file-upload/upload-prices'
import { ReportUpload } from '@/features/file-upload/upload-report/ui/file-upload'

export default function HomePage() {
  return (
    <div>
      {/* <PricesUpload /> */}
      <ReportUpload />
      <MapWithTrucks />
    </div>
  )
}
