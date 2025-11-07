'use client'

import { useCallback, useState } from 'react'
import { useGetTollRoadsByBoundingBoxMutation } from '@/entities/roads'
import { MapWithTollRoads } from '@/widgets/map'
import {
  BoundingBoxSearchForm,
  type BoundingBoxCoordinates,
} from '@/features/forms/bounding-box-search'

// Coordinates covering Colorado area
const DEFAULT_COORDINATES = {
  minLat: 37.0, // South of Colorado
  minLon: -109.0, // West of Colorado
  maxLat: 41.0, // North of Colorado
  maxLon: -102.0,
}

const DEFAULT_COORDINATES_STR = {
  minLat: '37.0',
  minLon: '-109.0',
  maxLat: '41.0',
  maxLon: '-102.0',
}

export default function TollRoadsPage() {
  const [currentCoordinates, setCurrentCoordinates] =
    useState<BoundingBoxCoordinates>(DEFAULT_COORDINATES)

  const { mutate, data, isPending } = useGetTollRoadsByBoundingBoxMutation({})

  const handleSearch = useCallback(
    (coordinates: BoundingBoxCoordinates) => {
      setCurrentCoordinates(coordinates)
      mutate(coordinates)
    },
    [mutate],
  )

  const handleTollRoadsUpdate = useCallback(() => {
    // Обновляем список дорог после операций (add, update, delete)
    mutate(currentCoordinates)
  }, [mutate, currentCoordinates])

  return (
    <div
      className="fixed inset-0 h-screen"
      style={{ width: 'calc(100vw - 92px)', left: '92px' }}>
      {/* Search Form */}
      <BoundingBoxSearchForm
        title="Toll Roads Search"
        description="Enter bounding box coordinates to search for toll roads"
        resultsCount={data?.length}
        resultsLabel="Found toll roads"
        isLoading={isPending}
        onSearch={handleSearch}
        defaultCoordinates={DEFAULT_COORDINATES_STR}
        className="w-80"
      />

      {/* Map */}
      <MapWithTollRoads
        tollRoads={data || []}
        isLoading={isPending}
        onTollRoadsUpdate={handleTollRoadsUpdate}
      />
    </div>
  )
}
