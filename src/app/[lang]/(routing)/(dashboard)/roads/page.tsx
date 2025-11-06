'use client'

import { useState, useEffect } from 'react'
import { Button, InfoCard } from '@/shared/ui'
import { useGetRoadsByBoundingBoxMutation } from '@/entities/roads'
import { MapWithRoads } from '@/widgets/map'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'

// Coordinates covering the entire continental United States
const DEFAULT_COORDINATES = {
  minLat: '37.0', // South of Colorado
  minLon: '-109.0', // West of Colorado
  maxLat: '41.0', // North of Colorado
  maxLon: '-102.0',
}

export default function RoadsPage() {
  const [minLat, setMinLat] = useState(DEFAULT_COORDINATES.minLat)
  const [minLon, setMinLon] = useState(DEFAULT_COORDINATES.minLon)
  const [maxLat, setMaxLat] = useState(DEFAULT_COORDINATES.maxLat)
  const [maxLon, setMaxLon] = useState(DEFAULT_COORDINATES.maxLon)

  const { mutate, data, isPending } = useGetRoadsByBoundingBoxMutation({
    onSuccess: (roads) => {
      console.log('Loaded roads:', roads.length)
    },
  })

  // Auto-load roads on component mount with default coordinates
  useEffect(() => {
    mutate({
      minLat: parseFloat(DEFAULT_COORDINATES.minLat),
      minLon: parseFloat(DEFAULT_COORDINATES.minLon),
      maxLat: parseFloat(DEFAULT_COORDINATES.maxLat),
      maxLon: parseFloat(DEFAULT_COORDINATES.maxLon),
    })
  }, [mutate])

  const handleSearch = () => {
    mutate({
      minLat: parseFloat(minLat),
      minLon: parseFloat(minLon),
      maxLat: parseFloat(maxLat),
      maxLon: parseFloat(maxLon),
    })
  }

  const handleReset = () => {
    setMinLat(DEFAULT_COORDINATES.minLat)
    setMinLon(DEFAULT_COORDINATES.minLon)
    setMaxLat(DEFAULT_COORDINATES.maxLat)
    setMaxLon(DEFAULT_COORDINATES.maxLon)
    mutate({
      minLat: parseFloat(DEFAULT_COORDINATES.minLat),
      minLon: parseFloat(DEFAULT_COORDINATES.minLon),
      maxLat: parseFloat(DEFAULT_COORDINATES.maxLat),
      maxLon: parseFloat(DEFAULT_COORDINATES.maxLon),
    })
  }

  return (
    <div className="relative h-screen">
      {/* Control Panel */}
      <div className="absolute top-4 left-4 z-10">
        <InfoCard title="Roads Search" className="w-80 shadow-lg">
          <p className="text-sm text-muted-foreground mb-4">
            Enter bounding box coordinates to search for roads
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minLat">Min Latitude</Label>
                <Input
                  id="minLat"
                  type="number"
                  step="0.01"
                  value={minLat}
                  onChange={(e) => setMinLat(e.target.value)}
                  placeholder="24.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minLon">Min Longitude</Label>
                <Input
                  id="minLon"
                  type="number"
                  step="0.01"
                  value={minLon}
                  onChange={(e) => setMinLon(e.target.value)}
                  placeholder="-125.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLat">Max Latitude</Label>
                <Input
                  id="maxLat"
                  type="number"
                  step="0.01"
                  value={maxLat}
                  onChange={(e) => setMaxLat(e.target.value)}
                  placeholder="49.0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLon">Max Longitude</Label>
                <Input
                  id="maxLon"
                  type="number"
                  step="0.01"
                  value={maxLon}
                  onChange={(e) => setMaxLon(e.target.value)}
                  placeholder="-66.9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSearch}
                disabled={isPending}
                className="flex-1">
                {isPending ? 'Loading...' : 'Search'}
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>
            {data && (
              <div className="text-sm text-muted-foreground pt-2 border-t">
                Found: <span className="font-semibold">{data.length}</span>{' '}
                roads
              </div>
            )}
          </div>
        </InfoCard>
      </div>

      {/* Map */}
      <MapWithRoads roads={data || []} isLoading={isPending} />
    </div>
  )
}
