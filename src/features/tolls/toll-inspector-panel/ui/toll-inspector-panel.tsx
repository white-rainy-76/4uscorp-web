'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Checkbox } from '@/shared/ui'
import { useAddTollMutation } from '../../add-toll'
import { useUpdateTollMutation } from '../../update-toll'
import { useDeleteTollMutation } from '../../delete-toll'
import {
  AddTollPayload,
  AddTollPayloadSchema,
} from '../../add-toll/api/payload/add-toll.payload'
import {
  UpdateTollPayload,
  UpdateTollPayloadSchema,
} from '../../update-toll/api/payload/update-toll.payload'
import { Label } from '@/shared/ui/label'
import { Toll } from '@/entities/tolls'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog'

interface TollInspectorPanelProps {
  selectedToll: Toll | null
  onTollSelect: (toll: Toll | null) => void
  onDraftPositionChange: (position: { lat: number; lng: number } | null) => void
  tolls: Toll[]
  onTollsChange: (tolls: Toll[] | ((prev: Toll[]) => Toll[])) => void
}

export const TollInspectorPanel = ({
  selectedToll,
  onTollSelect,
  onDraftPositionChange,
  tolls,
  onTollsChange,
}: TollInspectorPanelProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const mode = selectedToll ? 'edit' : 'create'

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AddTollPayload | UpdateTollPayload>({
    resolver: zodResolver(
      mode === 'edit' ? UpdateTollPayloadSchema : AddTollPayloadSchema,
    ),
    defaultValues: {
      name: '',
      key: undefined,
      price: 0,
      latitude: 0,
      longitude: 0,
      isDynamic: false,
    },
  })

  // Заполняем форму при выборе toll для редактирования
  useEffect(() => {
    if (selectedToll && mode === 'edit') {
      setValue('name', selectedToll.name, { shouldValidate: true })
      setValue('key', selectedToll.key || '', {
        shouldValidate: true,
      })
      setValue('price', selectedToll.price, { shouldValidate: true })
      setValue('latitude', selectedToll.position.lat, { shouldValidate: true })
      setValue('longitude', selectedToll.position.lng, {
        shouldValidate: true,
      })
      setValue('isDynamic', selectedToll.isDynamic || false, {
        shouldValidate: true,
      })
      // id не нужен в форме, он передаётся в URL
      // Не показываем draft маркер при редактировании - выбранный toll уже виден на карте
      onDraftPositionChange(null)
    } else if (!selectedToll && mode === 'create') {
      // Сбрасываем форму при переключении в режим создания
      reset({
        name: '',
        key: undefined,
        price: 0,
        latitude: 0,
        longitude: 0,
        isDynamic: false,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedToll, mode])

  // Watch latitude and longitude to update draft marker in real-time
  const latitude = watch('latitude')
  const longitude = watch('longitude')

  React.useEffect(() => {
    // Показываем draft маркер только в режиме создания (не редактирования)
    if (mode === 'create') {
      if (
        typeof latitude === 'number' &&
        typeof longitude === 'number' &&
        latitude !== 0 &&
        longitude !== 0 &&
        !isNaN(latitude) &&
        !isNaN(longitude) &&
        isFinite(latitude) &&
        isFinite(longitude)
      ) {
        onDraftPositionChange({ lat: latitude, lng: longitude })
      } else {
        onDraftPositionChange(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude, mode])

  const { mutateAsync: addToll, isPending: isAdding } = useAddTollMutation({
    onSuccess: (createdToll) => {
      reset()
      onDraftPositionChange(null)

      // Используем реальный объект из ответа сервера с id
      onTollsChange((prev) => [...prev, createdToll])
    },
  })

  const { mutateAsync: updateToll, isPending: isUpdating } =
    useUpdateTollMutation({
      onSuccess: (updatedToll) => {
        reset()
        // Используем реальный объект из ответа сервера с всеми полями, включая key
        onTollsChange((prev) =>
          prev.map((toll) => (toll.id === updatedToll.id ? updatedToll : toll)),
        )
        // Обновляем selectedToll, чтобы форма отобразила обновленные данные
        onTollSelect(updatedToll)
      },
    })

  const { mutateAsync: deleteToll, isPending: isDeleting } =
    useDeleteTollMutation({
      onSuccess: (_, variables) => {
        onTollSelect(null)
        reset()
        onDraftPositionChange(null)
        setShowDeleteDialog(false)

        // Удаляем toll из списка
        onTollsChange((prev) => prev.filter((toll) => toll.id !== variables.id))
      },
    })

  const handleFormSubmit = async (data: AddTollPayload | UpdateTollPayload) => {
    try {
      if (mode === 'edit' && selectedToll) {
        await updateToll({
          id: selectedToll.id,
          payload: data as UpdateTollPayload,
        })
      } else {
        await addToll(data as AddTollPayload)
      }
    } catch (error) {
      console.error(`Failed to ${mode} toll:`, error)
    }
  }

  const handleClear = () => {
    onTollSelect(null)
    reset()
    onDraftPositionChange(null)
  }

  const handleDelete = () => {
    if (selectedToll) {
      setShowDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (selectedToll) {
      try {
        await deleteToll({ id: selectedToll.id })
      } catch (error) {
        console.error('Failed to delete toll:', error)
        setShowDeleteDialog(false)
      }
    }
  }

  const isPending = isAdding || isUpdating || isDeleting

  return (
    <>
      <div className="space-y-4">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {mode === 'edit' ? (
            <>
              <span className="text-lg">✏️</span>
              <h2 className="text-xl font-bold text-black">
                Edit Toll: {selectedToll?.name || ''}
              </h2>
            </>
          ) : (
            <>
              <span className="text-lg">➕</span>
              <h2 className="text-xl font-bold text-black">Add New Toll</h2>
            </>
          )}
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-black">
              Name
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter toll name"
              className={`text-black ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Key */}
          <div className="space-y-2">
            <Label htmlFor="key" className="text-black">
              Key
            </Label>
            <Input
              id="key"
              {...register('key')}
              placeholder="Enter toll key"
              className={`text-black ${errors.key ? 'border-red-500' : ''}`}
            />
            {errors.key && (
              <p className="text-sm text-red-500">{errors.key.message}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-black">
              Price
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              placeholder="0.00"
              className={`text-black ${errors.price ? 'border-red-500' : ''}`}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Latitude */}
          <div className="space-y-2">
            <Label htmlFor="latitude" className="text-black">
              Latitude
            </Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              {...register('latitude', { valueAsNumber: true })}
              placeholder="0.000000"
              className={`text-black ${
                errors.latitude ? 'border-red-500' : ''
              }`}
            />
            {errors.latitude && (
              <p className="text-sm text-red-500">{errors.latitude.message}</p>
            )}
          </div>

          {/* Longitude */}
          <div className="space-y-2">
            <Label htmlFor="longitude" className="text-black">
              Longitude
            </Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              {...register('longitude', { valueAsNumber: true })}
              placeholder="0.000000"
              className={`text-black ${
                errors.longitude ? 'border-red-500' : ''
              }`}
            />
            {errors.longitude && (
              <p className="text-sm text-red-500">{errors.longitude.message}</p>
            )}
          </div>

          {/* Is Dynamic */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDynamic"
              {...register('isDynamic')}
              checked={watch('isDynamic')}
              onCheckedChange={(checked) => setValue('isDynamic', !!checked)}
            />
            <Label htmlFor="isDynamic" className="text-black cursor-pointer">
              Is Dynamic
            </Label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            {mode === 'edit' ? (
              <>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded-[22px]">
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleDelete}
                    disabled={isPending}
                    variant="destructive"
                    className="flex-1 rounded-[22px]">
                    Delete
                  </Button>
                  <Button
                    type="button"
                    onClick={handleClear}
                    disabled={isPending}
                    variant="outline"
                    className="flex-1 rounded-[22px] text-black">
                    Clear
                  </Button>
                </div>
              </>
            ) : (
              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-[22px]">
                {isAdding ? 'Adding...' : 'Add Toll'}
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Toll</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{selectedToll?.name}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
