'use client'

import React, { useCallback } from 'react'
import { MapWithTolls } from '@/widgets/map'
import { Toll } from '@/entities/tolls'
import { useGetTollsByBoundingBoxMutation } from '@/entities/tolls/api'
import {
  BoundingBoxSearchForm,
  type BoundingBoxCoordinates,
} from '@/features/forms/bounding-box-search'

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
    (coordinates: BoundingBoxCoordinates) => {
      mutate(coordinates)
    },
    [mutate],
  )

  return (
    <main className="flex-1 overflow-y-auto bg-background custom-scroll relative">
      <BoundingBoxSearchForm
        title="Toll Points Search"
        resultsCount={tolls.length}
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
