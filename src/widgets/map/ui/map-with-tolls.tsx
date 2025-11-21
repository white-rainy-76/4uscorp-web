import { useState } from 'react'
import { MapBase, Spinner } from '@/shared/ui'
import { TollMarker, DraftTollMarker } from '@/entities/tolls/ui'
import { Toll } from '@/entities/tolls'

interface MapWithTollsProps {
  tolls: Toll[]
  isLoading?: boolean
  draftTollPosition?: { lat: number; lng: number } | null
  selectedTolls?: Toll[]
  onTollSelect?: (toll: Toll) => void
}

export const MapWithTolls = ({
  tolls,
  isLoading,
  draftTollPosition,
  selectedTolls = [],
  onTollSelect,
}: MapWithTollsProps) => {
  const [clickedOutside, setClickedOutside] = useState(false)

  return (
    <div className="relative w-full h-full">
      <MapBase onMapClick={() => setClickedOutside(true)}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50 pointer-events-auto">
            <Spinner />
          </div>
        )}
        {tolls &&
          tolls.map((toll) => (
            <TollMarker
              key={toll.id}
              toll={toll}
              selectedTolls={selectedTolls}
              onTollSelect={onTollSelect}
            />
          ))}
        {draftTollPosition &&
          draftTollPosition.lat != null &&
          draftTollPosition.lng != null &&
          selectedTolls.length === 0 && (
            <DraftTollMarker position={draftTollPosition} />
          )}
      </MapBase>
    </div>
  )
}
