'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, InfoCard } from '@/shared/ui'
import { AutocompleteCustom } from '@/features/forms/search-route/ui/autocomplete'
import { Coordinate } from '@/shared/types'
import { GooglePlace } from '@/shared/types/place'
import { MapPin, Search } from 'lucide-react'
import { useSavedRoutesStore } from '@/shared/store'

const savedRoutesSearchSchema = z.object({
  startPoint: z.string().min(1, { message: 'Start point is required' }),
  endPoint: z.string().min(1, { message: 'End point is required' }),
})

type SavedRoutesSearchFormValues = z.infer<typeof savedRoutesSearchSchema>

export interface SavedRoutesSearchFormProps {
  isLoading?: boolean
  onSearchComplete?: () => void
}

export const SavedRoutesSearchForm = ({
  isLoading = false,
  onSearchComplete,
}: SavedRoutesSearchFormProps) => {
  const { setSearchParams } = useSavedRoutesStore()
  const [selectedStartPoint, setSelectedStartPoint] =
    useState<GooglePlace | null>(null)
  const [selectedEndPoint, setSelectedEndPoint] = useState<GooglePlace | null>(
    null,
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<SavedRoutesSearchFormValues>({
    resolver: zodResolver(savedRoutesSearchSchema),
    defaultValues: {
      startPoint: '',
      endPoint: '',
    },
  })

  const onSubmit = (data: SavedRoutesSearchFormValues) => {
    if (!selectedStartPoint?.location) {
      setError('startPoint', {
        type: 'manual',
        message: 'Please select a valid start location',
      })
      return
    }

    if (!selectedEndPoint?.location) {
      setError('endPoint', {
        type: 'manual',
        message: 'Please select a valid end location',
      })
      return
    }

    const origin: Coordinate = {
      latitude: selectedStartPoint.location.lat(),
      longitude: selectedStartPoint.location.lng(),
    }

    const destination: Coordinate = {
      latitude: selectedEndPoint.location.lat(),
      longitude: selectedEndPoint.location.lng(),
    }

    const originName = selectedStartPoint.formattedAddress || data.startPoint
    const destinationName = selectedEndPoint.formattedAddress || data.endPoint

    setSearchParams({ origin, destination, originName, destinationName })
    onSearchComplete?.()
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted-alt">
        Search for saved routes between two locations
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Start Point */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-heading flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            From
          </label>
          <Controller
            name="startPoint"
            control={control}
            render={({ field }) => (
              <AutocompleteCustom
                value={field.value}
                onChange={field.onChange}
                onPlaceSelect={(place) => setSelectedStartPoint(place)}
                placeholder="Enter start location"
              />
            )}
          />
          {errors.startPoint && (
            <p className="text-xs text-destructive">
              {errors.startPoint.message}
            </p>
          )}
        </div>

        {/* End Point */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-heading flex items-center gap-2">
            <MapPin className="w-4 h-4 text-destructive" />
            To
          </label>
          <Controller
            name="endPoint"
            control={control}
            render={({ field }) => (
              <AutocompleteCustom
                value={field.value}
                onChange={field.onChange}
                onPlaceSelect={(place) => setSelectedEndPoint(place)}
                placeholder="Enter destination"
              />
            )}
          />
          {errors.endPoint && (
            <p className="text-xs text-destructive">
              {errors.endPoint.message}
            </p>
          )}
        </div>

        {/* Search Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full font-semibold"
          size="sm">
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            {isLoading ? 'Searching...' : 'Search Routes'}
          </span>
        </Button>
      </form>
    </div>
  )
}
