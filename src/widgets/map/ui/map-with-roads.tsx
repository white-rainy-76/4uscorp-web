import { useState } from 'react'
import { MapBase, Spinner } from '@/shared/ui'
import { TollRoadPolyline } from '@/entities/roads/ui'
import { TollRoad } from '@/entities/roads'
import { TollRoadEditor } from '@/features/roads/create-road'
import { useAddRoadMutation } from '@/features/roads/add-road'
import { useUpdateRoadMutation } from '@/features/roads/update-road'
import { useDeleteRoadMutation } from '@/features/roads/delete-road'
import { toast } from 'sonner'

interface MapWithTollRoadsProps {
  tollRoads: TollRoad[]
  isLoading?: boolean
  onTollRoadsUpdate?: () => void
}

export const MapWithTollRoads = ({
  tollRoads,
  isLoading,
  onTollRoadsUpdate,
}: MapWithTollRoadsProps) => {
  const [clickedOutside, setClickedOutside] = useState(false)
  const [selectedTollRoad, setSelectedTollRoad] = useState<TollRoad | null>(
    null,
  )
  const [isEditingTollRoad, setIsEditingTollRoad] = useState(false)

  // API mutations
  const { mutate: addTollRoad, isPending: isAdding } = useAddRoadMutation({
    onSuccess: () => {
      toast.success('Toll road created successfully!')
      setIsEditingTollRoad(false)
      setSelectedTollRoad(null)
      onTollRoadsUpdate?.()
    },
    onError: (error) => {
      toast.error(`Failed to create toll road: ${error.message}`)
    },
  })

  const { mutate: updateTollRoad, isPending: isUpdating } =
    useUpdateRoadMutation({
      onSuccess: () => {
        toast.success('Toll road updated successfully!')
        setIsEditingTollRoad(false)
        onTollRoadsUpdate?.()
      },
      onError: (error) => {
        toast.error(`Failed to update toll road: ${error.message}`)
      },
    })

  const { mutate: deleteTollRoad, isPending: isDeleting } =
    useDeleteRoadMutation({
      onSuccess: () => {
        toast.success('Toll road deleted successfully!')
        setSelectedTollRoad(null)
        setIsEditingTollRoad(false)
        onTollRoadsUpdate?.()
      },
      onError: (error) => {
        toast.error(`Failed to delete toll road: ${error.message}`)
      },
    })

  const handleTollRoadClick = (
    tollRoad: TollRoad,
    e?: google.maps.MapMouseEvent,
  ) => {
    e?.domEvent?.stopPropagation() // Предотвращаем всплытие события
    setSelectedTollRoad(tollRoad)
    setIsEditingTollRoad(false)
  }

  const handleMapClick = () => {
    setClickedOutside(true)
    // Снимаем выделение при клике на карту (но не на полилинию)
    if (!isEditingTollRoad) {
      setSelectedTollRoad(null)
    }
  }

  const handleStartEdit = () => {
    if (selectedTollRoad) {
      setIsEditingTollRoad(true)
    }
  }

  const handleCancelEdit = () => {
    setIsEditingTollRoad(false)
    setSelectedTollRoad(null)
  }

  const handleSaveTollRoad = (points: google.maps.LatLngLiteral[]) => {
    const coordinates = points.map((point) => ({
      latitude: point.lat,
      longitude: point.lng,
    }))

    if (selectedTollRoad && isEditingTollRoad) {
      // Обновление существующей дороги
      updateTollRoad({
        id: selectedTollRoad.id,
        name: selectedTollRoad.name || 'Unnamed Toll Road',
        highwayType: selectedTollRoad.highwayType || 'toll_road',
        isToll: true,
        state: '', // TODO: Определить state из координат
        ref: selectedTollRoad.ref || '',
        wayId: 0, // TODO: Получить wayId
        coordinates,
      })
    } else {
      // Создание новой дороги
      addTollRoad({
        name: 'New Toll Road',
        highwayType: 'toll_road',
        isToll: true,
        coordinates,
      })
    }
  }

  const handleDeleteTollRoad = () => {
    if (selectedTollRoad) {
      if (
        window.confirm(
          `Are you sure you want to delete toll road "${selectedTollRoad.name || 'Unnamed'}"?`,
        )
      ) {
        deleteTollRoad({ id: selectedTollRoad.id })
      }
    }
  }

  const isSaving = isAdding || isUpdating || isDeleting

  return (
    <div className="absolute inset-0 w-full h-full">
      <MapBase onMapClick={handleMapClick}>
        {(isLoading || isSaving) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 bg-opacity-50 z-50 pointer-events-auto">
            <Spinner />
          </div>
        )}
        {tollRoads &&
          tollRoads.map((tollRoad) => (
            <TollRoadPolyline
              key={tollRoad.id}
              road={tollRoad}
              isSelected={selectedTollRoad?.id === tollRoad.id}
              onClick={(e) => handleTollRoadClick(tollRoad, e)}
            />
          ))}
        <TollRoadEditor
          initialPoints={
            selectedTollRoad && isEditingTollRoad
              ? selectedTollRoad.coordinates
              : undefined
          }
          selectedTollRoad={
            selectedTollRoad && !isEditingTollRoad ? selectedTollRoad : null
          }
          onStartEdit={handleStartEdit}
          onSave={handleSaveTollRoad}
          onCancel={handleCancelEdit}
          onDelete={handleDeleteTollRoad}
          isDeleting={isDeleting}
        />
      </MapBase>
    </div>
  )
}
