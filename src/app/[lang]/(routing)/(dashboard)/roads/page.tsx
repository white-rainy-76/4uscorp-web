'use client'

import { useCallback } from 'react'
import { useGetRoadsByBoundingBoxMutation } from '@/entities/roads'
import { MapWithRoads } from '@/widgets/map'
import {
  BoundingBoxSearchForm,
  type BoundingBoxCoordinates,
} from '@/features/forms/bounding-box-search'

// Coordinates covering Colorado area
const DEFAULT_COORDINATES = {
  minLat: '37.0', // South of Colorado
  minLon: '-109.0', // West of Colorado
  maxLat: '41.0', // North of Colorado
  maxLon: '-102.0',
}

export default function RoadsPage() {
  const { mutate, data, isPending } = useGetRoadsByBoundingBoxMutation({
    onSuccess: (roads) => {
      console.log('Loaded roads:', roads.length)
    },
  })

  const handleSearch = useCallback(
    (coordinates: BoundingBoxCoordinates) => {
      mutate(coordinates)
    },
    [mutate],
  )

  return (
    <div
      className="fixed inset-0 h-screen"
      style={{ width: 'calc(100vw - 92px)', left: '92px' }}>
      {/* Search Form */}
      <BoundingBoxSearchForm
        title="Roads Search"
        description="Enter bounding box coordinates to search for roads"
        resultsCount={data?.length}
        resultsLabel="Found roads"
        isLoading={isPending}
        onSearch={handleSearch}
        defaultCoordinates={DEFAULT_COORDINATES}
        className="w-80"
      />

      {/* Map */}
      <MapWithRoads roads={data || []} isLoading={isPending} />
    </div>
  )
}
