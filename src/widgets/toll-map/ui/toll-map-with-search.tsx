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
  selectedTolls?: Toll[]
  draftTollPosition?: { lat: number; lng: number } | null
  onTollSelect?: (toll: Toll) => void
  tolls: Toll[]
  onTollsChange: (tolls: Toll[] | ((prev: Toll[]) => Toll[])) => void
  onTollsDeselect?: () => void
  onDraftPositionChange?: (
    position: { lat: number; lng: number } | null,
  ) => void
}

export const TollMapWithSearch = ({
  selectedTolls,
  draftTollPosition,
  onTollSelect,
  tolls,
  onTollsChange,
  onTollsDeselect,
  onDraftPositionChange,
}: TollMapWithSearchProps) => {
  const { mutate, isPending } = useGetTollsByBoundingBoxMutation({
    onSuccess: (data) => {
      onTollsChange(data || [])
    },
  })

  const handleSearch = useCallback(
    (coordinates: BoundingBoxCoordinates) => {
      // Сбрасываем выбранные маркеры при новом запросе
      onTollsDeselect?.()
      mutate(coordinates)
    },
    [mutate, onTollsDeselect],
  )

  return (
    <main className="flex-1 h-full bg-background relative overflow-hidden">
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
        selectedTolls={selectedTolls}
        onTollSelect={onTollSelect}
        onDraftPositionChange={onDraftPositionChange}
        onTollsDeselect={onTollsDeselect}
      />
    </main>
  )
}
