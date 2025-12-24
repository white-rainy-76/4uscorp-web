'use client'

import React from 'react'
import { Spinner } from '@/shared/ui'

interface MapLoadingOverlayProps {
  isPending: boolean
}

export const MapLoadingOverlay: React.FC<MapLoadingOverlayProps> = ({
  isPending,
}) => {
  if (!isPending) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-[101] pointer-events-auto">
      <Spinner size="lg" />
    </div>
  )
}
