'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Checkbox } from '@/shared/ui'
import { useAddTollMutation } from '../api/add-toll.mutation'
import {
  AddTollPayload,
  AddTollPayloadSchema,
} from '../api/payload/add-toll.payload'
import { Label } from '@/shared/ui/label'

interface AddTollFormProps {
  onDraftPositionChange: (position: { lat: number; lng: number } | null) => void
  onCoordinatesRequest?: (
    setCoordinates: (pos: { lat: number; lng: number }) => void,
  ) => void
}

export const AddTollForm = ({
  onDraftPositionChange,
  onCoordinatesRequest,
}: AddTollFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AddTollPayload>({
    resolver: zodResolver(AddTollPayloadSchema),
    defaultValues: {
      name: '',
      key: '',
      price: 0,
      latitude: 0,
      longitude: 0,
      isDynamic: false,
    },
  })

  // Watch latitude and longitude to update draft marker in real-time
  const latitude = watch('latitude')
  const longitude = watch('longitude')

  React.useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude])

  // Функция для установки координат извне (например, при клике на карте)
  const setCoordinates = React.useCallback(
    (position: { lat: number; lng: number }) => {
      if (
        !position ||
        position.lat == null ||
        position.lng == null ||
        isNaN(position.lat) ||
        isNaN(position.lng)
      ) {
        return
      }
      setValue('latitude', position.lat, { shouldValidate: true })
      setValue('longitude', position.lng, { shouldValidate: true })
    },
    [setValue],
  )

  // Передаём функцию setCoordinates родительскому компоненту
  React.useEffect(() => {
    onCoordinatesRequest?.(setCoordinates)
  }, [setCoordinates, onCoordinatesRequest])

  const { mutateAsync: addToll, isPending } = useAddTollMutation({
    onSuccess: () => {
      reset()
      onDraftPositionChange(null)
    },
  })

  const handleFormSubmit = async (data: AddTollPayload) => {
    try {
      await addToll(data)
    } catch (error) {
      console.error('Failed to add toll:', error)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-black">Add New Toll</h2>
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
            className={`text-black ${errors.latitude ? 'border-red-500' : ''}`}
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
            className={`text-black ${errors.longitude ? 'border-red-500' : ''}`}
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

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full rounded-[22px]">
          {isPending ? 'Adding...' : 'Add Toll'}
        </Button>
      </form>
    </div>
  )
}
