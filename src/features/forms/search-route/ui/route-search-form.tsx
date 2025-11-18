import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { RouteSearchFormValues, routeSearchSchema } from '../model/schema'
import { AutocompleteCustom } from './autocomplete'
import { GooglePlace } from '@/shared/types/place'
import { useDictionary } from '@/shared/lib/hooks'
import { Input } from '@/shared/ui'
import { FuelSlider } from './fuel-slider'
import { Icon } from '@/shared/ui'
import { Coordinate } from '@/shared/types'
import { Truck, useTruckStats } from '@/entities/truck'
import { useFuelSliderMax } from '../lib/hooks'
import { FieldError } from './field-error'
import { useRouteFormStore } from '@/shared/store'
import { useConnection } from '@/shared/lib/context'
import {
  useSavedRoutesLookup,
  SavedRoutesModal,
  SavedRouteSelection,
  SavedRouteItem,
} from '@/features/route/saved-routes-selector'
import { convertToCoordinate } from '@/shared/lib/coordinates'

interface RouteSearchFormProps {
  truck?: Truck
  onSubmitForm: (payload: {
    origin: Coordinate
    destination: Coordinate
    originName: string
    destinationName: string
    truckWeight?: number
    finishFuel?: number
    savedRouteId?: string
  }) => void
  isCreatingRoute?: boolean
}

export const RouteSearchForm = ({
  truck,
  onSubmitForm,
  isCreatingRoute = false,
}: RouteSearchFormProps) => {
  const { dictionary } = useDictionary()
  const { isConnected } = useConnection()

  const { stats } = useTruckStats(truck?.id, isConnected, {
    trackedFields: ['fuelPercentage'],
  })

  const currentFuelPercent = stats?.fuelPercentage
    ? parseFloat(stats.fuelPercentage)
    : undefined
  const [selectedStartPoint, setSelectedStartPoint] =
    useState<GooglePlace | null>(null)
  const [selectedEndPoint, setSelectedEndPoint] = useState<GooglePlace | null>(
    null,
  )
  const [selectedSavedRoute, setSelectedSavedRoute] =
    useState<SavedRouteItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get route form data from store
  const {
    origin,
    destination,
    originName,
    destinationName,
    finishFuel,
    truckWeight,
  } = useRouteFormStore()

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset,
  } = useForm<RouteSearchFormValues>({
    resolver: zodResolver(routeSearchSchema),
    defaultValues: {
      startPoint: originName || '',
      endPoint: destinationName || '',
      weight: truckWeight?.toString() || '',
      fuelPercent: finishFuel ?? 0,
    },
  })

  // Watch the weight field to recalculate max fuel slider value
  const watchedWeight = watch('weight')
  const currentWeight = watchedWeight ? parseFloat(watchedWeight) : 0

  // Recalculate max fuel slider value when weight changes
  const dynamicMaxFuelSliderValue = useFuelSliderMax(
    truck,
    currentFuelPercent,
    currentWeight,
  )

  // Lookup saved routes when coordinates are available (selected from autocomplete)
  const {
    savedRoutes,
    isLoading: isLoadingSavedRoutes,
    hasSavedRoutes,
  } = useSavedRoutesLookup({
    origin: convertToCoordinate(selectedStartPoint?.location || origin),
    destination: convertToCoordinate(selectedEndPoint?.location || destination),
    enabled: true,
  })

  // Clear selected saved route when origin or destination changes
  useEffect(() => {
    if (selectedSavedRoute) {
      setSelectedSavedRoute(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStartPoint, selectedEndPoint])

  const onSubmit = (data: RouteSearchFormValues) => {
    // Проверяем, есть ли координаты (либо из стора, либо выбранные пользователем)
    const hasStartCoordinates = selectedStartPoint?.location || origin
    const hasEndCoordinates = selectedEndPoint?.location || destination

    if (!hasStartCoordinates) {
      setError('startPoint', { type: 'manual', message: 'valid' })
    }

    if (!hasEndCoordinates) {
      setError('endPoint', { type: 'manual', message: 'valid' })
    }

    if (hasStartCoordinates && hasEndCoordinates) {
      // Используем координаты из выбранных мест или из стора
      const startCoords = selectedStartPoint?.location
        ? {
            latitude: selectedStartPoint.location.lat(),
            longitude: selectedStartPoint.location.lng(),
          }
        : origin!

      const endCoords = selectedEndPoint?.location
        ? {
            latitude: selectedEndPoint.location.lat(),
            longitude: selectedEndPoint.location.lng(),
          }
        : destination!

      onSubmitForm({
        origin: startCoords,
        destination: endCoords,
        originName: data.startPoint,
        destinationName: data.endPoint,
        truckWeight: Number(data.weight),
        finishFuel: data.fuelPercent,
        savedRouteId: selectedSavedRoute?.id,
      })
    }
  }

  const handleSelectRoute = (route: SavedRouteItem) => {
    setSelectedSavedRoute(route)
  }

  const handleClearRoute = () => {
    setSelectedSavedRoute(null)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md">
      <div className="space-y-4">
        {/* Start Point */}
        <div className="flex items-center space-x-2">
          <div className="w-8 flex justify-center">
            <Icon name="common/marker-yellow" width={24} height={24} />
          </div>

          <Controller
            name="startPoint"
            control={control}
            render={({ field }) => (
              <AutocompleteCustom
                value={field.value}
                onChange={field.onChange}
                onPlaceSelect={(place) => setSelectedStartPoint(place)}
                placeholder={dictionary.home.input_fields.departure_placeholder}
              />
            )}
          />
        </div>
        <FieldError error={errors.startPoint} />

        {/* End Point */}
        <div className="flex items-center space-x-2">
          <div className="w-8 flex justify-center">
            <Icon name="common/marker-blue" width={24} height={24} />
          </div>

          <Controller
            name="endPoint"
            control={control}
            render={({ field }) => (
              <AutocompleteCustom
                value={field.value}
                onChange={field.onChange}
                onPlaceSelect={(place) => setSelectedEndPoint(place)}
                placeholder={
                  dictionary.home.input_fields.destination_placeholder
                }
              />
            )}
          />
        </div>
        <FieldError error={errors.endPoint} />
        {/* Weight */}
        <div className="flex items-center space-x-2">
          <div className="w-8 flex justify-center">
            <Icon name="common/weight" width={24} height={24} />
          </div>
          <Controller
            name="weight"
            control={control}
            render={({ field }) => (
              <Input
                className="w-full md:w-96"
                prefixText={dictionary.home.input_fields.weight}
                variant="gray"
                placeholder={dictionary.home.input_fields.weight_placeholder}
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <FieldError error={errors.weight} />

        {/* Fuel Slider */}
        <div className="flex items-center space-x-2 mt-4">
          <div className="w-8 flex justify-center">
            <Icon name="common/fuel" width={24} height={24} />
          </div>
          <div className="flex-1">
            <Controller
              name="fuelPercent"
              control={control}
              render={({ field }) => (
                <FuelSlider
                  defaultValue={[field.value as number]}
                  onChange={field.onChange}
                  max={dynamicMaxFuelSliderValue}
                  step={1}
                />
              )}
            />
          </div>
        </div>
      </div>
      <FieldError error={errors.fuelPercent} />

      {/* Selected Saved Route Display */}
      {selectedSavedRoute && (
        <div className="mt-4">
          <SavedRouteSelection
            selectedRoute={selectedSavedRoute}
            onClear={handleClearRoute}
            onOpenModal={() => setIsModalOpen(true)}
          />
        </div>
      )}

      {/* Saved Routes Button or Calculate Button */}
      <div className="mt-4 space-y-2">
        {!selectedSavedRoute && hasSavedRoutes && !isLoadingSavedRoutes && (
          <Button
            type="button"
            variant="outline"
            className="w-full font-semibold border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
            onClick={() => setIsModalOpen(true)}>
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Use Saved Route ({savedRoutes.length})
            </span>
          </Button>
        )}

        <Button type="submit" className="w-full" disabled={isCreatingRoute}>
          {dictionary.home.buttons.calculate}
        </Button>
      </div>

      {/* Loading indicator */}
      {isLoadingSavedRoutes && (
        <div className="flex items-center justify-center gap-2 mt-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-text-muted">Checking for saved routes...</span>
        </div>
      )}

      {/* Saved Routes Modal */}
      <SavedRoutesModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        savedRoutes={savedRoutes}
        onSelect={handleSelectRoute}
      />
    </form>
  )
}
