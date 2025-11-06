import { useState } from 'react'
import { MapBase, Spinner, Button } from '@/shared/ui'
import { RoadPolyline } from '@/entities/roads/ui'
import { Road } from '@/entities/roads'
import { RoadEditor } from '@/features/roads/create-road'

interface MapWithRoadsProps {
  roads: Road[]
  isLoading?: boolean
}

export const MapWithRoads = ({ roads, isLoading }: MapWithRoadsProps) => {
  const [clickedOutside, setClickedOutside] = useState(false)
  const [selectedRoad, setSelectedRoad] = useState<Road | null>(null)
  const [isEditingRoad, setIsEditingRoad] = useState(false)

  const handleRoadClick = (road: Road, e?: google.maps.MapMouseEvent) => {
    e?.domEvent?.stopPropagation() // Предотвращаем всплытие события
    setSelectedRoad(road)
    setIsEditingRoad(false)
  }

  const handleMapClick = () => {
    setClickedOutside(true)
    // Снимаем выделение при клике на карту (но не на полилинию)
    if (!isEditingRoad) {
      setSelectedRoad(null)
    }
  }

  const handleStartEdit = () => {
    if (selectedRoad) {
      setIsEditingRoad(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingRoad(false)
    setSelectedRoad(null)
  }

  const handleSaveRoad = (points: google.maps.LatLngLiteral[]) => {
    console.log('Road points to save:', points)
    // TODO: Реализовать сохранение дороги через API
    // После сохранения можно снять выделение
    // setSelectedRoad(null)
    // setIsEditingRoad(false)
  }

  return (
    <div className="absolute inset-0 w-full h-full">
      <MapBase onMapClick={handleMapClick}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50 pointer-events-auto">
            <Spinner />
          </div>
        )}
        {roads &&
          roads.map((road) => (
            <RoadPolyline
              key={road.id}
              road={road}
              isSelected={selectedRoad?.id === road.id}
              onClick={(e) => handleRoadClick(road, e)}
            />
          ))}
        <RoadEditor
          initialPoints={
            selectedRoad && isEditingRoad ? selectedRoad.coordinates : undefined
          }
          selectedRoad={selectedRoad && !isEditingRoad ? selectedRoad : null}
          onStartEdit={handleStartEdit}
          onSave={handleSaveRoad}
          onCancel={handleCancelEdit}
        />
      </MapBase>
    </div>
  )
}
