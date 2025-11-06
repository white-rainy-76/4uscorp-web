'use client'

import React, { useCallback } from 'react'
import { TollSearchForm } from '@/entities/tolls/ui'
import { MapWithTolls } from '@/widgets/map'
import { Toll } from '@/entities/tolls'
import { useGetTollsByBoundingBoxMutation } from '@/entities/tolls/api'

interface SearchCoordinates {
  minLat: number
  minLon: number
  maxLat: number
  maxLon: number
}

interface TollMapWithSearchProps {
  selectedToll?: Toll | null
  draftTollPosition?: { lat: number; lng: number } | null
  onTollSelect?: (toll: Toll) => void
  tolls: Toll[]
  onTollsChange: (tolls: Toll[] | ((prev: Toll[]) => Toll[])) => void
}

export const TollMapWithSearch = ({
  selectedToll,
  draftTollPosition,
  onTollSelect,
  tolls,
  onTollsChange,
}: TollMapWithSearchProps) => {
  const { mutate, isPending } = useGetTollsByBoundingBoxMutation({
    onSuccess: (data) => {
      onTollsChange(data || [])
    },
  })

  const handleSearch = useCallback(
    (coordinates: SearchCoordinates) => {
      mutate(coordinates)
    },
    [mutate],
  )

  return (
    <main className="flex-1 overflow-y-auto bg-background custom-scroll relative">
      <TollSearchForm
        tollsCount={tolls.length}
        isLoading={isPending}
        onSearch={handleSearch}
      />

      <MapWithTolls
        tolls={tolls}
        isLoading={isPending}
        draftTollPosition={draftTollPosition}
        selectedToll={selectedToll}
        onTollSelect={onTollSelect}
      />
    </main>
  )
}
