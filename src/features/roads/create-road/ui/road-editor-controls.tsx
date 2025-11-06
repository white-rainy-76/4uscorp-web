'use client'

import React from 'react'
import { Button, InfoCard } from '@/shared/ui'
import { useDictionary } from '@/shared/lib/hooks'

interface RoadEditorControlsProps {
  isEditing: boolean
  isEditMode?: boolean
  pointsCount: number
  selectedRoad?: { id: string; name: string | null } | null
  onStartEditing: () => void
  onStartEdit?: () => void
  onCancel: () => void
  onReset: () => void
  onSave: () => void
}

// Подкомпонент для отображения информации о выбранной дороге
interface SelectedRoadInfoProps {
  selectedRoad: { id: string; name: string | null }
  onStartEdit?: () => void
  onStartEditing: () => void
  dictionary: any
}

const SelectedRoadInfo: React.FC<SelectedRoadInfoProps> = ({
  selectedRoad,
  onStartEdit,
  onStartEditing,
  dictionary,
}) => {
  return (
    <>
      <div className="text-sm pt-2 border-t">
        <p className="font-semibold mb-1 text-black">
          {dictionary.home.roads.selected_road}:
        </p>
        <p className="text-muted-foreground">{selectedRoad.name}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {dictionary.home.roads.id}: {selectedRoad.id}
        </p>
      </div>
      {onStartEdit && (
        <Button onClick={onStartEdit} className="w-full">
          {dictionary.home.roads.start_editing}
        </Button>
      )}
    </>
  )
}

// Подкомпонент для начального состояния (создание новой дороги)
interface CreateNewRoadProps {
  onStartEditing: () => void
  dictionary: any
}

const CreateNewRoad: React.FC<CreateNewRoadProps> = ({
  onStartEditing,
  dictionary,
}) => {
  return (
    <>
      <p className="text-sm text-muted-foreground">
        {dictionary.home.roads.description}
      </p>
      <Button onClick={onStartEditing} className="w-full">
        {dictionary.home.roads.start_editing}
      </Button>
    </>
  )
}

// Подкомпонент для инструкций при редактировании
interface EditingInstructionsProps {
  dictionary: any
}

const EditingInstructions: React.FC<EditingInstructionsProps> = ({
  dictionary,
}) => {
  return (
    <div className="text-sm text-muted-foreground">
      <p className="mb-2">
        <strong>{dictionary.home.roads.instructions}:</strong>
      </p>
      <ul className="list-disc list-inside space-y-1 text-xs">
        <li>{dictionary.home.roads.instruction_add_point}</li>
        <li>{dictionary.home.roads.instruction_move_point}</li>
        <li>{dictionary.home.roads.instruction_delete_point}</li>
      </ul>
    </div>
  )
}

// Подкомпонент для кнопок управления при редактировании
interface EditingActionsProps {
  pointsCount: number
  isEditMode: boolean
  onSave: () => void
  onReset: () => void
  onCancel: () => void
  dictionary: any
}

const EditingActions: React.FC<EditingActionsProps> = ({
  pointsCount,
  isEditMode,
  onSave,
  onReset,
  onCancel,
  dictionary,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <Button onClick={onSave} className="w-full" disabled={pointsCount < 2}>
        {dictionary.home.roads.save}
      </Button>
      <div className="flex gap-2">
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1 text-black"
          disabled={pointsCount === 0}>
          {isEditMode
            ? dictionary.home.roads.cancel_changes
            : dictionary.home.roads.reset}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="flex-1 text-black">
          {dictionary.home.roads.cancel}
        </Button>
      </div>
    </div>
  )
}

// Подкомпонент для отображения количества точек
interface PointsCountProps {
  pointsCount: number
  dictionary: any
}

const PointsCount: React.FC<PointsCountProps> = ({
  pointsCount,
  dictionary,
}) => {
  return (
    <div className="text-sm pt-2 border-t text-black">
      {dictionary.home.roads.points_added}:{' '}
      <span className="font-semibold">{pointsCount}</span>
    </div>
  )
}

// Основной компонент
export const RoadEditorControls: React.FC<RoadEditorControlsProps> = ({
  isEditing,
  isEditMode = false,
  pointsCount,
  selectedRoad,
  onStartEditing,
  onStartEdit,
  onCancel,
  onReset,
  onSave,
}) => {
  const { dictionary } = useDictionary()

  const getTitle = () => {
    if (isEditing) {
      return isEditMode
        ? dictionary.home.roads.title.editing
        : dictionary.home.roads.title.create
    }
    return isEditMode
      ? dictionary.home.roads.title.selected
      : dictionary.home.roads.title.create
  }

  return (
    <div className="absolute top-4 right-4 z-10">
      <InfoCard title={getTitle()} className="w-80 shadow-lg">
        {!isEditing ? (
          <div className="space-y-4">
            {selectedRoad ? (
              <SelectedRoadInfo
                selectedRoad={selectedRoad}
                onStartEdit={onStartEdit}
                onStartEditing={onStartEditing}
                dictionary={dictionary}
              />
            ) : (
              <CreateNewRoad
                onStartEditing={onStartEditing}
                dictionary={dictionary}
              />
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <EditingInstructions dictionary={dictionary} />
            <PointsCount pointsCount={pointsCount} dictionary={dictionary} />
            <EditingActions
              pointsCount={pointsCount}
              isEditMode={isEditMode}
              onSave={onSave}
              onReset={onReset}
              onCancel={onCancel}
              dictionary={dictionary}
            />
          </div>
        )}
      </InfoCard>
    </div>
  )
}
