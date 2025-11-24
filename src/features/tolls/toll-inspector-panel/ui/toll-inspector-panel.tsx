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
import { DeleteTollDialog } from '@/features/tolls/delete-toll'

interface TollInspectorPanelProps {
  selectedTolls: Toll[]
  onTollsDeselect: () => void
  onDraftPositionChange: (position: { lat: number; lng: number } | null) => void
  draftTollPosition?: { lat: number; lng: number } | null
  tolls: Toll[]
  onTollsChange: (tolls: Toll[] | ((prev: Toll[]) => Toll[])) => void
}

export const TollInspectorPanel = ({
  selectedTolls,
  onTollsDeselect,
  onDraftPositionChange,
  draftTollPosition,
  tolls,
  onTollsChange,
}: TollInspectorPanelProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)

  const mode = selectedTolls.length > 0 ? 'edit' : 'create'
  const selectedToll = selectedTolls.length === 1 ? selectedTolls[0] : null

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
      iPass: undefined,
      iPassOvernight: undefined,
      payOnline: undefined,
      payOnlineOvernight: undefined,
    },
  })

  // Заполняем форму при выборе toll для редактирования
  useEffect(() => {
    if (selectedTolls.length > 0 && mode === 'edit') {
      // Если выбран один маркер, заполняем форму его данными
      if (selectedTolls.length === 1) {
        const toll = selectedTolls[0]
        setValue('name', toll.name, { shouldValidate: true })
        setValue('key', toll.key || '', {
          shouldValidate: true,
        })
        setValue('price', toll.price, { shouldValidate: true })
        setValue('latitude', toll.position.lat, { shouldValidate: true })
        setValue('longitude', toll.position.lng, {
          shouldValidate: true,
        })
        setValue('isDynamic', toll.isDynamic || false, {
          shouldValidate: true,
        })
        setValue('iPass', toll.iPass, { shouldValidate: true })
        setValue('iPassOvernight', toll.iPassOvernight, {
          shouldValidate: true,
        })
        setValue('payOnline', toll.payOnline, { shouldValidate: true })
        setValue('payOnlineOvernight', toll.payOnlineOvernight, {
          shouldValidate: true,
        })
      } else {
        // Если выбрано несколько маркеров, проверяем, одинаковые ли у них значения
        const firstToll = selectedTolls[0]
        const allSameName = selectedTolls.every(
          (t) => t.name === firstToll.name,
        )
        const allSameKey = selectedTolls.every((t) => t.key === firstToll.key)
        const allSamePrice = selectedTolls.every(
          (t) => t.price === firstToll.price,
        )
        const allSameIsDynamic = selectedTolls.every(
          (t) => (t.isDynamic || false) === (firstToll.isDynamic || false),
        )
        const allSameIPass = selectedTolls.every(
          (t) => t.iPass === firstToll.iPass,
        )
        const allSameIPassOvernight = selectedTolls.every(
          (t) => t.iPassOvernight === firstToll.iPassOvernight,
        )
        const allSamePayOnline = selectedTolls.every(
          (t) => t.payOnline === firstToll.payOnline,
        )
        const allSamePayOnlineOvernight = selectedTolls.every(
          (t) => t.payOnlineOvernight === firstToll.payOnlineOvernight,
        )

        setValue('name', allSameName ? firstToll.name : '', {
          shouldValidate: true,
        })
        setValue('key', allSameKey ? firstToll.key || '' : '', {
          shouldValidate: true,
        })
        setValue('price', allSamePrice ? firstToll.price : 0, {
          shouldValidate: true,
        })
        setValue('latitude', firstToll.position.lat, { shouldValidate: true })
        setValue('longitude', firstToll.position.lng, {
          shouldValidate: true,
        })
        setValue(
          'isDynamic',
          allSameIsDynamic ? firstToll.isDynamic || false : false,
          {
            shouldValidate: true,
          },
        )
        setValue('iPass', allSameIPass ? firstToll.iPass : undefined, {
          shouldValidate: true,
        })
        setValue(
          'iPassOvernight',
          allSameIPassOvernight ? firstToll.iPassOvernight : undefined,
          {
            shouldValidate: true,
          },
        )
        setValue(
          'payOnline',
          allSamePayOnline ? firstToll.payOnline : undefined,
          {
            shouldValidate: true,
          },
        )
        setValue(
          'payOnlineOvernight',
          allSamePayOnlineOvernight ? firstToll.payOnlineOvernight : undefined,
          {
            shouldValidate: true,
          },
        )
      }
      // Не показываем draft маркер при редактировании - выбранные tolls уже видны на карте
      onDraftPositionChange(null)
    } else if (selectedTolls.length === 0 && mode === 'create') {
      // Сбрасываем форму при переключении в режим создания
      reset({
        name: '',
        key: undefined,
        price: 0,
        latitude: 0,
        longitude: 0,
        isDynamic: false,
        iPass: undefined,
        iPassOvernight: undefined,
        payOnline: undefined,
        payOnlineOvernight: undefined,
      })
      onDraftPositionChange(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTolls, mode])

  // Watch latitude and longitude to update draft marker in real-time
  const latitude = watch('latitude')
  const longitude = watch('longitude')

  // Флаг для предотвращения циклических обновлений
  const isUpdatingFromDraftRef = React.useRef(false)

  // Обновляем координаты в форме при изменении draftTollPosition (например, при правом клике на карту)
  React.useEffect(() => {
    if (
      mode === 'create' &&
      draftTollPosition &&
      draftTollPosition.lat != null &&
      draftTollPosition.lng != null &&
      draftTollPosition.lat !== 0 &&
      draftTollPosition.lng !== 0 &&
      (Math.abs(latitude - draftTollPosition.lat) > 0.000001 ||
        Math.abs(longitude - draftTollPosition.lng) > 0.000001)
    ) {
      isUpdatingFromDraftRef.current = true
      setValue('latitude', draftTollPosition.lat, { shouldValidate: false })
      setValue('longitude', draftTollPosition.lng, { shouldValidate: false })
      // Сбрасываем флаг после обновления формы
      requestAnimationFrame(() => {
        isUpdatingFromDraftRef.current = false
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftTollPosition, mode])

  React.useEffect(() => {
    // Пропускаем обновление, если мы только что обновили форму из draftTollPosition
    if (isUpdatingFromDraftRef.current) {
      return
    }

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
        // Обновляем draft position только если координаты отличаются от текущего draftTollPosition
        if (
          !draftTollPosition ||
          Math.abs(draftTollPosition.lat - latitude) > 0.000001 ||
          Math.abs(draftTollPosition.lng - longitude) > 0.000001
        ) {
          onDraftPositionChange({ lat: latitude, lng: longitude })
        }
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
        // Используем реальный объект из ответа сервера с всеми полями, включая key
        onTollsChange((prev) =>
          prev.map((toll) => (toll.id === updatedToll.id ? updatedToll : toll)),
        )
      },
    })

  const { mutateAsync: deleteToll, isPending: isDeleting } =
    useDeleteTollMutation({
      onSuccess: (_, variables) => {
        // Удаляем toll из списка
        onTollsChange((prev) => prev.filter((toll) => toll.id !== variables.id))
      },
    })

  const handleFormSubmit = async (data: AddTollPayload | UpdateTollPayload) => {
    try {
      if (mode === 'edit' && selectedTolls.length > 0) {
        // При множественном выборе исключаем координаты из payload
        const payload =
          selectedTolls.length > 1
            ? {
                ...data,
                latitude: undefined,
                longitude: undefined,
              }
            : data

        // Обновляем все выбранные маркеры
        await Promise.all(
          selectedTolls.map((toll) =>
            updateToll({
              id: toll.id,
              payload: payload as UpdateTollPayload,
            }),
          ),
        )
        reset()
        onTollsDeselect()
      } else {
        await addToll(data as AddTollPayload)
      }
    } catch (error) {
      console.error(`Failed to ${mode} toll:`, error)
    }
  }

  const handleClear = () => {
    onTollsDeselect()
    reset()
    onDraftPositionChange(null)
  }

  const handleDelete = () => {
    if (selectedTolls.length > 0) {
      setShowDeleteDialog(true)
    }
  }

  const confirmDelete = async () => {
    if (selectedTolls.length > 0) {
      try {
        // Удаляем все выбранные маркеры
        await Promise.all(
          selectedTolls.map((toll) => deleteToll({ id: toll.id })),
        )
        setShowDeleteDialog(false)
        reset()
        onTollsDeselect()
        onDraftPositionChange(null)
      } catch (error) {
        console.error('Failed to delete tolls:', error)
        setShowDeleteDialog(false)
      }
    }
  }

  const isPending = isAdding || isUpdating || isDeleting

  return (
    <>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-48px)] custom-scroll pr-2">
        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {mode === 'edit' ? (
            <>
              <span className="text-lg">✏️</span>
              <h2 className="text-xl font-bold text-black">
                {selectedTolls.length === 1
                  ? `Edit Toll: ${selectedTolls[0]?.name || ''}`
                  : `Edit ${selectedTolls.length} Tolls`}
              </h2>
            </>
          ) : (
            <>
              <span className="text-lg">➕</span>
              <h2 className="text-xl font-bold text-black">Add New Toll</h2>
            </>
          )}
        </div>
        {selectedTolls.length > 1 && (
          <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
            Selected {selectedTolls.length} markers with the same key. Changes
            will be applied to all selected markers.
            <div className="mt-1 text-xs text-gray-500">
              💡 Tip: Use Ctrl+Click (Cmd+Click on Mac) to select a single
              marker for individual editing.
            </div>
          </div>
        )}
        {selectedTolls.length === 0 && (
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            💡 Tip: Click on a marker to select all markers with the same key.
            Use Ctrl+Click (Cmd+Click on Mac) to select a single marker.
          </div>
        )}

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

          {/* iPass Prices */}
          <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <Label className="text-black font-semibold">iPass Prices</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="iPass" className="text-black text-sm">
                  Day Price
                </Label>
                <Input
                  id="iPass"
                  type="number"
                  step="0.01"
                  {...register('iPass', { valueAsNumber: true })}
                  placeholder="0.00"
                  className={`text-black ${
                    errors.iPass ? 'border-red-500' : ''
                  }`}
                />
                {errors.iPass && (
                  <p className="text-sm text-red-500">{errors.iPass.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="iPassOvernight" className="text-black text-sm">
                  Overnight Price
                </Label>
                <Input
                  id="iPassOvernight"
                  type="number"
                  step="0.01"
                  {...register('iPassOvernight', { valueAsNumber: true })}
                  placeholder="0.00"
                  className={`text-black ${
                    errors.iPassOvernight ? 'border-red-500' : ''
                  }`}
                />
                {errors.iPassOvernight && (
                  <p className="text-sm text-red-500">
                    {errors.iPassOvernight.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* PayOnline Prices */}
          <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <Label className="text-black font-semibold">PayOnline Prices</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="payOnline" className="text-black text-sm">
                  Day Price
                </Label>
                <Input
                  id="payOnline"
                  type="number"
                  step="0.01"
                  {...register('payOnline', { valueAsNumber: true })}
                  placeholder="0.00"
                  className={`text-black ${
                    errors.payOnline ? 'border-red-500' : ''
                  }`}
                />
                {errors.payOnline && (
                  <p className="text-sm text-red-500">
                    {errors.payOnline.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="payOnlineOvernight"
                  className="text-black text-sm">
                  Overnight Price
                </Label>
                <Input
                  id="payOnlineOvernight"
                  type="number"
                  step="0.01"
                  {...register('payOnlineOvernight', { valueAsNumber: true })}
                  placeholder="0.00"
                  className={`text-black ${
                    errors.payOnlineOvernight ? 'border-red-500' : ''
                  }`}
                />
                {errors.payOnlineOvernight && (
                  <p className="text-sm text-red-500">
                    {errors.payOnlineOvernight.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Latitude */}
          <div className="space-y-2">
            <Label
              htmlFor="latitude"
              className={`text-black ${
                selectedTolls.length > 1 ? 'text-gray-400' : ''
              }`}>
              Latitude
              {selectedTolls.length > 1 && (
                <span className="ml-2 text-xs text-gray-500">
                  (disabled for multiple selection)
                </span>
              )}
            </Label>
            <Input
              id="latitude"
              type="number"
              step="any"
              disabled={selectedTolls.length > 1}
              {...register('latitude', { valueAsNumber: true })}
              placeholder="0.000000"
              className={`text-black ${
                errors.latitude ? 'border-red-500' : ''
              } ${selectedTolls.length > 1 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.latitude && (
              <p className="text-sm text-red-500">{errors.latitude.message}</p>
            )}
            {selectedTolls.length > 1 && (
              <p className="text-xs text-gray-500">
                Coordinates cannot be changed for multiple markers. Use
                Ctrl+Click to select a single marker to edit coordinates.
              </p>
            )}
          </div>

          {/* Longitude */}
          <div className="space-y-2">
            <Label
              htmlFor="longitude"
              className={`text-black ${
                selectedTolls.length > 1 ? 'text-gray-400' : ''
              }`}>
              Longitude
              {selectedTolls.length > 1 && (
                <span className="ml-2 text-xs text-gray-500">
                  (disabled for multiple selection)
                </span>
              )}
            </Label>
            <Input
              id="longitude"
              type="number"
              step="any"
              disabled={selectedTolls.length > 1}
              {...register('longitude', { valueAsNumber: true })}
              placeholder="0.000000"
              className={`text-black ${
                errors.longitude ? 'border-red-500' : ''
              } ${selectedTolls.length > 1 ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
            {errors.longitude && (
              <p className="text-sm text-red-500">{errors.longitude.message}</p>
            )}
            {selectedTolls.length > 1 && (
              <p className="text-xs text-gray-500">
                Coordinates cannot be changed for multiple markers. Use
                Ctrl+Click to select a single marker to edit coordinates.
              </p>
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
      <DeleteTollDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        selectedTolls={selectedTolls}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
