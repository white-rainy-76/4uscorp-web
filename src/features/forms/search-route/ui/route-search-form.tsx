import React, { useState } from 'react'
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
interface RouteSearchFormProps {
  destinationName: string | undefined
  originName: string | undefined
  truckWeight: number | undefined
  finishFuel: number | undefined
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
  } = useForm<RouteSearchFormValues>({
    resolver: zodResolver(routeSearchSchema),
    defaultValues: {
      startPoint: originName,
      endPoint: destinationName,
      weight: truckWeight?.toString() || '',
      fuelPercent: finishFuel !== undefined ? finishFuel : 0,
    },
  })

  const onSubmit = (data: RouteSearchFormValues) => {
    if (!selectedStartPoint) {
      setError('startPoint', { type: 'manual', message: 'valid' })
    }

    if (!selectedEndPoint) {
      setError('endPoint', { type: 'manual', message: 'valid' })
    }

    if (selectedStartPoint?.location && selectedEndPoint?.location) {
      onSubmitForm({
        origin: {
          latitude: selectedStartPoint.location.lat(),
          longitude: selectedStartPoint.location.lng(),
        },
        destination: {
          latitude: selectedEndPoint.location.lat(),
          longitude: selectedEndPoint.location.lng(),
        },
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
                  max={100}
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
