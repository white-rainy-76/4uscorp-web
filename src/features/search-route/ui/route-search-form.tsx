import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/shared/ui/button/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { RouteSearchFormValues, routeSearchSchema } from '../model/schema'
import { AutocompleteCustom } from './autocomplete'
import { GooglePlace } from '@/shared/types/place'
import { useRouteStore } from '@/shared/store/route-store'
import { useDictionary } from '@/shared/lib/hooks'
import { getLocalizedErrorMessage } from '../lib'
import { Input } from '@/shared/ui/input'
import { FuelSlider } from '@/shared/ui/slider'
import { Icon } from '@/shared/ui/Icon'

export const RouteSearchForm = () => {
  const { setDestination, setOrigin } = useRouteStore()
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
      startPoint: '',
      endPoint: '',
      weight: '',
      fuelPercent: 0,
    },
  })

  const onSubmit = (data: RouteSearchFormValues) => {
    console.log(data)

    if (!selectedStartPoint && selectedStartPoint == null) {
      setError('startPoint', { type: 'manual', message: 'valid' })
    }

    if (!selectedEndPoint && selectedEndPoint == null) {
      setError('endPoint', { type: 'manual', message: 'valid' })
    }

    if (
      selectedStartPoint &&
      selectedStartPoint.location &&
      selectedEndPoint &&
      selectedEndPoint.location
    ) {
      setOrigin({
        latitude: selectedStartPoint.location.lat(),
        longitude: selectedStartPoint.location.lng(),
      })
      setDestination({
        latitude: selectedEndPoint.location.lat(),
        longitude: selectedEndPoint.location.lng(),
      })
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md">
      <div className="space-y-4">
        {/* Start Point */}
        <div className="flex items-center space-x-2">
          <div className="w-8 flex justify-center">
            <Icon name="common/marker" width={24} height={24} />
          </div>

          <Controller
            name="startPoint"
            control={control}
            render={({ field }) => (
              <AutocompleteCustom
                value={field.value}
                onChange={field.onChange}
                onPlaceSelect={(place) => setSelectedStartPoint(place)}
                placeholder="Отправка"
              />
            )}
          />
        </div>
        {errors.startPoint && errors.startPoint.message && (
          <p className="text-red-500 text-sm mt-1">
            {getLocalizedErrorMessage(errors.startPoint.message, dictionary)}
          </p>
        )}
        {/* End Point */}
        <div className="flex items-center space-x-2">
          <div className="w-8 flex justify-center">
            <Icon name="common/marker" width={24} height={24} />
          </div>

          <Controller
            name="endPoint"
            control={control}
            render={({ field }) => (
              <AutocompleteCustom
                value={field.value}
                onChange={field.onChange}
                onPlaceSelect={(place) => setSelectedEndPoint(place)}
                placeholder="Доставка"
              />
            )}
          />
        </div>
        {errors.endPoint && errors.endPoint.message && (
          <p className="text-red-500 text-sm mt-1">
            {getLocalizedErrorMessage(errors.endPoint.message, dictionary)}
          </p>
        )}
        {/* Weight */}
        <div className="flex items-center space-x-2">
          <div className="w-8 flex justify-center">
            <Icon name="common/weight" width={24} height={24} />
          </div>
          <div className="flex-1 bg-gray-100 rounded-full px-4  flex items-center">
            <span className="text-gray-700 text-sm mr-2">Вес</span>
            <Controller
              name="weight"
              control={control}
              render={({ field }) => (
                <Input
                  variant="gray"
                  placeholder={'Введите вес'}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
        {errors.weight && errors.weight.message && (
          <p className="text-red-500 text-sm mt-1">
            {getLocalizedErrorMessage(errors.weight.message, dictionary)}
          </p>
        )}

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
      {errors.fuelPercent && errors.fuelPercent.message && (
        <p className="text-red-500 text-sm mt-1">
          {getLocalizedErrorMessage(errors.fuelPercent.message, dictionary)}
        </p>
      )}
      <Button type="submit" className="w-full mt-4">
        {dictionary.home.calculate}
      </Button>
    </form>
  )
}
