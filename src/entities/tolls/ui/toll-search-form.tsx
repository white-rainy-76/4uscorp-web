'use client'

import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, InfoCard, Spinner } from '@/shared/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select'
import {
  US_STATES_COORDINATES,
  US_STATES_LIST,
  type USState,
} from '@/shared/constants/us-states-coordinates'
import {
  tollSearchFormSchema,
  TollSearchFormValues,
  DEFAULT_COORDINATES,
} from '../model/schema'
import { FormField } from './components/form-field'
import { CoordinateField } from './components/coordinate-field'
import { Label } from '@/shared/ui/label'

interface TollSearchFormProps {
  tollsCount?: number
  isLoading?: boolean
  onSearch: (coordinates: {
    minLat: number
    minLon: number
    maxLat: number
    maxLon: number
  }) => void
}

export const TollSearchForm = ({
  tollsCount,
  isLoading,
  onSearch,
}: TollSearchFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
    trigger,
  } = useForm<TollSearchFormValues>({
    resolver: zodResolver(tollSearchFormSchema),
    mode: 'onBlur', // Валидация только при blur и submit
    defaultValues: {
      minLat: DEFAULT_COORDINATES.minLat,
      minLon: DEFAULT_COORDINATES.minLon,
      maxLat: DEFAULT_COORDINATES.maxLat,
      maxLon: DEFAULT_COORDINATES.maxLon,
    },
  })

  const onSubmit = (data: TollSearchFormValues) => {
    onSearch({
      minLat: parseFloat(data.minLat),
      minLon: parseFloat(data.minLon),
      maxLat: parseFloat(data.maxLat),
      maxLon: parseFloat(data.maxLon),
    })
  }

  const handleReset = () => {
    reset({
      minLat: DEFAULT_COORDINATES.minLat,
      minLon: DEFAULT_COORDINATES.minLon,
      maxLat: DEFAULT_COORDINATES.maxLat,
      maxLon: DEFAULT_COORDINATES.maxLon,
    })
  }

  // // Auto-load tolls on mount with default coordinates
  // useEffect(() => {
  //   const defaultData = {
  //     minLat: parseFloat(DEFAULT_COORDINATES.minLat),
  //     minLon: parseFloat(DEFAULT_COORDINATES.minLon),
  //     maxLat: parseFloat(DEFAULT_COORDINATES.maxLat),
  //     maxLon: parseFloat(DEFAULT_COORDINATES.maxLon),
  //   }
  //   onSearch(defaultData)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <div className="absolute top-4 left-4 z-10">
      <InfoCard
        title="Toll Points Search"
        className="w-96 shadow-xl border border-gray-200 bg-white/95 backdrop-blur-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* State Select */}
          <FormField label="Select State (Optional)" className="mb-4">
            <Select
              onValueChange={(value) => {
                // Обновляем координаты при выборе штата
                if (value && value in US_STATES_COORDINATES) {
                  const coordinates = US_STATES_COORDINATES[value as USState]
                  setValue('minLat', coordinates.minLat.toString(), {
                    shouldValidate: false,
                    shouldDirty: true,
                  })
                  setValue('minLon', coordinates.minLon.toString(), {
                    shouldValidate: false,
                    shouldDirty: true,
                  })
                  setValue('maxLat', coordinates.maxLat.toString(), {
                    shouldValidate: false,
                    shouldDirty: true,
                  })
                  setValue('maxLon', coordinates.maxLon.toString(), {
                    shouldValidate: false,
                    shouldDirty: true,
                  })
                }
              }}>
              <SelectTrigger className="h-11 border-gray-300 focus:ring-2 focus:ring-primary/20 text-black [&>span]:text-black">
                <SelectValue placeholder="Select a state..." />
              </SelectTrigger>
              <SelectContent>
                {US_STATES_LIST.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {/* Coordinates Grid */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Bounding Box
              </Label>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <CoordinateField
                name="minLat"
                label="Min Latitude"
                control={control}
                errors={errors}
                placeholder="24.0"
              />
              <CoordinateField
                name="minLon"
                label="Min Longitude"
                control={control}
                errors={errors}
                placeholder="-125.0"
              />
              <CoordinateField
                name="maxLat"
                label="Max Latitude"
                control={control}
                errors={errors}
                placeholder="50.0"
              />
              <CoordinateField
                name="maxLon"
                label="Max Longitude"
                control={control}
                errors={errors}
                placeholder="-66.0"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-11 font-semibold shadow-sm hover:shadow-md transition-shadow">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Spinner size="xs" />
                  Searching...
                </span>
              ) : (
                'Search'
              )}
            </Button>
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              className="h-11 px-6 border-gray-300 hover:bg-gray-50 transition-colors text-black">
              Reset
            </Button>
          </div>

          {/* Results Count */}
          {tollsCount !== undefined && (
            <div className="pt-4 mt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Found:
                </span>
                <span className="text-lg font-bold text-primary">
                  {tollsCount}
                </span>
              </div>
            </div>
          )}
        </form>
      </InfoCard>
    </div>
  )
}
