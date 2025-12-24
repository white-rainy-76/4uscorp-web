import { useState, useEffect, useRef } from 'react'
import { MapBase, Spinner } from '@/shared/ui'
import { TollMarker, DraftTollMarker } from '@/entities/tolls/ui'
import { Toll } from '@/entities/tolls'
import { useMap } from '@vis.gl/react-google-maps'

interface MapWithTollsProps {
  tolls: Toll[]
  isLoading?: boolean
  draftTollPosition?: { lat: number; lng: number } | null
  selectedTolls?: Toll[]
  onTollSelect?: (toll: Toll) => void
  onDraftPositionChange?: (
    position: { lat: number; lng: number } | null,
  ) => void
  onTollsDeselect?: () => void
}

export const MapWithTolls = ({
  tolls,
  isLoading,
  draftTollPosition,
  selectedTolls = [],
  onTollSelect,
  onDraftPositionChange,
  onTollsDeselect,
}: MapWithTollsProps) => {
  const [clickedOutside, setClickedOutside] = useState(false)
  const map = useMap()
  const rightClickListenerRef = useRef<google.maps.MapsEventListener | null>(
    null,
  )

  // Обработчик правого клика на карте для создания toll
  useEffect(() => {
    if (!map || !onDraftPositionChange) {
      return
    }

    const handleRightClick = (e: google.maps.MapMouseEvent) => {
      // Предотвращаем стандартное контекстное меню браузера
      if (e.domEvent) {
        e.domEvent.preventDefault()
      }

      if (e.latLng) {
        // Сбрасываем выбранные tolls при правом клике, чтобы показать draft маркер
        if (selectedTolls.length > 0) {
          onTollsDeselect?.()
        }

        // Устанавливаем позицию для создания нового toll
        onDraftPositionChange({
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        })
      }
    }

    // Добавляем обработчик правого клика
    rightClickListenerRef.current = google.maps.event.addListener(
      map,
      'rightclick',
      handleRightClick,
    )

    return () => {
      if (rightClickListenerRef.current) {
        google.maps.event.removeListener(rightClickListenerRef.current)
        rightClickListenerRef.current = null
      }
    }
  }, [map, onDraftPositionChange, onTollsDeselect, selectedTolls.length])

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
