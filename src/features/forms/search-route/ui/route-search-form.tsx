import React, { useState, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/shared/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { RouteSearchFormValues, routeSearchSchema } from '../model/schema'
import { AutocompleteCustom } from './autocomplete'
import { GooglePlace } from '@/shared/types/place'
import { useDictionary } from '@/shared/lib/hooks'
import { getLocalizedErrorMessage } from '../lib'
import { Input } from '@/shared/ui'
import { FuelSlider } from '@/shared/ui'
import { Icon } from '@/shared/ui'
import { Coordinate } from '@/shared/types'
import { RouteRequestPayload } from '@/features/directions/api'
import { Truck } from '@/entities/truck'

interface RouteSearchFormProps {
  destinationName: string | undefined
  originName: string | undefined
  truckWeight: number | undefined
  finishFuel: number | undefined
  origin?: Coordinate | null
  destination?: Coordinate | null
  truck?: Truck
  currentFuelPercent?: number
  onSubmitForm: (payload: {
    origin: Coordinate
    destination: Coordinate
    originName: string
    destinationName: string
    truckWeight?: number
    finishFuel?: number
  }) => void
}

export const RouteSearchForm = ({
  destinationName,
  originName,
  finishFuel,
  truckWeight,
  origin,
  destination,
  truck,
  currentFuelPercent,
  onSubmitForm,
}: RouteSearchFormProps) => {
  const { dictionary } = useDictionary()
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
    reset,
    watch,
  } = useForm<RouteSearchFormValues>({
    resolver: zodResolver(routeSearchSchema),
    defaultValues: {
      startPoint: originName || '',
      endPoint: destinationName || '',
      weight: truckWeight?.toString() || '',
      fuelPercent: finishFuel !== undefined ? finishFuel : 0,
    },
  })

  // Watch the weight field to recalculate max fuel slider value
  const watchedWeight = watch('weight')
  const currentWeight = watchedWeight ? parseFloat(watchedWeight) : 0

  // Recalculate max fuel slider value when weight changes
  const dynamicMaxFuelSliderValue = useMemo(() => {
    if (!truck || currentFuelPercent === undefined) {
      return 100 // Default fallback
    }

    const { tankCapacityG, overWeight, poundPerGallon } = truck

    // Formula: Math.Min(((OverWeight - TruckWeight) / PoundPerGalon) + (CurrentFuelPercent * (TankCapacityG / 100.0), TankCapacityG)
    const calculatedMax = Math.min(
      (overWeight - currentWeight) / poundPerGallon +
        currentFuelPercent * (tankCapacityG / 100.0),
      tankCapacityG,
    )
    console.log('calculatedMax', calculatedMax)
    // Convert to percentage (0-100)
    return calculatedMax
  }, [truck, currentFuelPercent, currentWeight])

  const onSubmit = (data: RouteSearchFormValues) => {
    // Проверяем, есть ли координаты (либо из API, либо выбранные пользователем)

    const hasStartCoordinates = selectedStartPoint?.location || origin
    const hasEndCoordinates = selectedEndPoint?.location || destination

    if (!hasStartCoordinates) {
      setError('startPoint', { type: 'manual', message: 'valid' })
    }

    if (!hasEndCoordinates) {
      setError('endPoint', { type: 'manual', message: 'valid' })
    }

    if (hasStartCoordinates && hasEndCoordinates) {
      // Используем координаты из выбранных мест или из API напрямую
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
      })
    }
  }

  const FieldError = ({ error }: { error?: { message?: string } }) =>
    error?.message ? (
      <p className="text-red-500 text-sm mt-1">
        {getLocalizedErrorMessage(error.message, dictionary)}
      </p>
    ) : null

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
      <Button type="submit" className="w-full mt-4">
        {dictionary.home.buttons.calculate}
      </Button>
    </form>
  )
}
