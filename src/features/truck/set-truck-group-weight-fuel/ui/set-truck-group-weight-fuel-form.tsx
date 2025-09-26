'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/shared/ui'
import { useSetTruckGroupWeightFuelMutation } from '../api/set-truck-group-weight-fuel.mutation'
import {
  SetTruckGroupWeightFuelPayload,
  SetTruckGroupWeightFuelPayloadSchema,
} from '../api/payload/set-truck-group-weight-fuel.payload'
import { TruckGroup } from '@/entities/truck'
import { useDictionary } from '@/shared/lib/hooks'

interface SetTruckGroupWeightFuelFormProps {
  onClose: () => void
  truckGroup?: TruckGroup
}

export const SetTruckGroupWeightFuelForm = ({
  onClose,
  truckGroup,
}: SetTruckGroupWeightFuelFormProps) => {
  const { dictionary } = useDictionary()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SetTruckGroupWeightFuelPayload>({
    resolver: zodResolver(SetTruckGroupWeightFuelPayloadSchema),
    defaultValues: {
      truckGroupId: '',
      fuelCapacity: 0,
      weight: 0,
    },
  })

  const { mutateAsync: setTruckGroupWeightFuel, isPending } =
    useSetTruckGroupWeightFuelMutation()

  useEffect(() => {
    if (truckGroup) {
      setValue('truckGroupId', truckGroup.id)
      setValue('fuelCapacity', truckGroup.fuelCapacity)
      setValue('weight', truckGroup.weight)
    }
  }, [truckGroup, setValue])

  const handleFormSubmit = async (data: SetTruckGroupWeightFuelPayload) => {
    try {
      await setTruckGroupWeightFuel(data)
      onClose()
    } catch (error) {
      console.error('Failed to update truck group weight and fuel:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-[30px]">
      {/* Fuel Capacity Field */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          {dictionary.home.input_fields.fuel_capacity}
        </label>
        <Input
          {...register('fuelCapacity', {
            valueAsNumber: true,
            min: {
              value: 0,
              message: dictionary.home.validation.min_fuel_capacity,
            },
          })}
          type="number"
          placeholder={dictionary.home.input_fields.fuel_capacity_placeholder}
          variant="gray"
          className={errors.fuelCapacity ? 'border-red-500' : ''}
        />
        {errors.fuelCapacity && (
          <p className="text-sm text-red-500">{errors.fuelCapacity.message}</p>
        )}
      </div>

      {/* Weight Field */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          {dictionary.home.input_fields.weight_kg}
        </label>
        <Input
          {...register('weight', {
            valueAsNumber: true,
            min: { value: 0, message: dictionary.home.validation.min_weight },
          })}
          type="number"
          placeholder={dictionary.home.input_fields.weight_kg_placeholder}
          variant="gray"
          className={errors.weight ? 'border-red-500' : ''}
        />
        {errors.weight && (
          <p className="text-sm text-red-500">{errors.weight.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-[22px]">
        {isPending
          ? dictionary.home.buttons.loading
          : dictionary.home.buttons.save_changes}
      </Button>
    </form>
  )
}
