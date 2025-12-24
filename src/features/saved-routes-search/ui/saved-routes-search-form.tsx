'use client'

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/shared/ui'
import { AutocompleteCustom } from '@/features/forms/search-route/ui/autocomplete'
import { Coordinate } from '@/shared/types'
import { GooglePlace } from '@/shared/types/place'
import { MapPin, Search } from 'lucide-react'
import { useSavedRoutesStore } from '@/shared/store'
import { SavedRoutesRouteParams } from '../types'

const savedRoutesSearchSchema = z.object({
  startPoint: z.string().min(1, { message: 'Start point is required' }),
  endPoint: z.string().min(1, { message: 'End point is required' }),
})

type SavedRoutesSearchFormValues = z.infer<typeof savedRoutesSearchSchema>

export interface SavedRoutesSearchFormProps {
  isLoading?: boolean
  onSearchComplete?: () => void
  onCreateRoute?: (params: SavedRoutesRouteParams) => void
  isCreatingRoute?: boolean
}

export const SavedRoutesSearchForm = ({
  isLoading = false,
  onSearchComplete,
  onCreateRoute,
  isCreatingRoute = false,
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

  const applySearchParamsFromForm = (data: SavedRoutesSearchFormValues) => {
    if (!selectedStartPoint?.location) {
      setError('startPoint', {
        type: 'manual',
        message: 'Please select a valid start location',
      })
      return false
    }

    if (!selectedEndPoint?.location) {
      setError('endPoint', {
        type: 'manual',
        message: 'Please select a valid end location',
      })
      return false
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
    return { origin, destination, originName, destinationName }
  }

  const onSubmitSearch = (data: SavedRoutesSearchFormValues) => {
    void applySearchParamsFromForm(data)
  }

  const onSubmitCreate = (data: SavedRoutesSearchFormValues) => {
    if (!onCreateRoute) return
    const params = applySearchParamsFromForm(data)
    if (!params) return
    onCreateRoute(params)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-text-muted-alt">
        Search for saved routes between two locations
      </p>

      <form onSubmit={handleSubmit(onSubmitSearch)} className="space-y-4">
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

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 font-semibold"
            size="sm">
            <span className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              {isLoading ? 'Searching...' : 'Search Routes'}
            </span>
          </Button>

          {onCreateRoute && (
            <Button
              type="button"
              onClick={handleSubmit(onSubmitCreate)}
              disabled={isLoading || isCreatingRoute}
              variant="outline"
              className="flex-1 font-semibold text-text-heading"
              size="sm">
              {isCreatingRoute ? 'Creating...' : 'Create Route'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
