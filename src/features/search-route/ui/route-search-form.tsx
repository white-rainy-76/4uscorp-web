import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Button } from '@/shared/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { RouteSearchFormValues, routeSearchSchema } from '../model/schema'
import { AutocompleteCustom } from './autocomplete'
import { GooglePlace } from '@/shared/types/place'
import useDictionary from '@/shared/lib/hooks/use-dictionary'

export const RouteSearchForm = () => {
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
    reset,
  } = useForm<RouteSearchFormValues>({
    resolver: zodResolver(routeSearchSchema),
    defaultValues: {
      startPoint: '',
      endPoint: '',
    },
  })

  const getLocalizedErrorMessage = (key: string) => {
    switch (key) {
      case 'departure':
        return dictionary.home.errors.departure_required_error
      case 'arrival':
        return dictionary.home.errors.destination_required_error
      case 'differentPoints':
        return dictionary.home.errors.different_points
      default:
        return key
    }
  }

  const onSubmit = (data: RouteSearchFormValues) => {
    console.log('Данные формы:', data)
    console.log('Выбранное место отправки:', selectedStartPoint)
    console.log('Выбранное место прибытия:', selectedEndPoint)

    reset()
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full md:w-96">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {dictionary.home.departure}
        </label>
        <Controller
          name="startPoint"
          control={control}
          render={({ field }) => (
            <AutocompleteCustom
              value={field.value}
              onChange={field.onChange}
              onPlaceSelect={(place) => setSelectedStartPoint(place)}
            />
          )}
        />
        {errors.startPoint && errors.startPoint.message && (
          <p className="text-red-500 text-sm mt-1">
            {getLocalizedErrorMessage(errors.startPoint.message)}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          {dictionary.home.destination}
        </label>
        <Controller
          name="endPoint"
          control={control}
          render={({ field }) => (
            <AutocompleteCustom
              value={field.value}
              onChange={field.onChange}
              onPlaceSelect={(place) => setSelectedEndPoint(place)}
            />
          )}
        />
        {errors.endPoint && errors.endPoint.message && (
          <p className="text-red-500 text-sm mt-1">
            {getLocalizedErrorMessage(errors.endPoint.message)}
          </p>
        )}
      </div>

      <Button type="submit">{dictionary.home.calculate}</Button>
    </form>
  )
}
