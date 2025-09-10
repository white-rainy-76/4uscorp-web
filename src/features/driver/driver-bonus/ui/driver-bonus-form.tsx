'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui'
import {
  useIncreaseDriverBonusMutation,
  useDecreaseDriverBonusMutation,
} from '../api/driver-bonus.mutations'
import {
  DriverBonusPayload,
  DriverBonusPayloadSchema,
} from '../api/payload/driver-bonus.payload'
import { Driver } from '@/entities/driver'
import { useDictionary } from '@/shared/lib/hooks'

interface DriverBonusFormProps {
  onClose: () => void
  driver?: Driver
  actionType: 'increase' | 'decrease'
}

export const DriverBonusForm = ({
  onClose,
  driver,
  actionType,
}: DriverBonusFormProps) => {
  const { dictionary } = useDictionary()

  const BONUS_REASONS = [
    { value: 'birthday', label: dictionary.home.bonus.reasons.birthday },
    { value: 'good_work', label: dictionary.home.bonus.reasons.good_work },
    { value: 'overtime', label: dictionary.home.bonus.reasons.overtime },
    { value: 'bonus', label: dictionary.home.bonus.reasons.bonus },
    { value: 'achievement', label: dictionary.home.bonus.reasons.achievement },
    { value: 'holiday', label: dictionary.home.bonus.reasons.holiday },
  ]

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DriverBonusPayload>({
    resolver: zodResolver(DriverBonusPayloadSchema),
    defaultValues: {
      driverId: '',
      bonus: 0,
      reason: '',
    },
  })

  const watchedReason = watch('reason')

  const { mutateAsync: increaseBonus, isPending: isIncreasing } =
    useIncreaseDriverBonusMutation({
      onSuccess: () => {
        reset()
        onClose()
      },
    })

  const { mutateAsync: decreaseBonus, isPending: isPending } =
    useDecreaseDriverBonusMutation({
      onSuccess: () => {
        reset()
        onClose()
      },
    })

  useEffect(() => {
    if (driver) {
      setValue('driverId', driver.id)
    }
  }, [driver, setValue])

  const handleFormSubmit = async (data: DriverBonusPayload) => {
    try {
      if (actionType === 'increase') {
        await increaseBonus(data)
      } else {
        await decreaseBonus(data)
      }
    } catch (error) {
      console.error('Failed to update driver bonus:', error)
    }
  }

  const watchedBonus = watch('bonus')
  const isSubmitDisabled =
    !watchedReason ||
    !watchedBonus ||
    watchedBonus <= 0 ||
    isIncreasing ||
    isPending

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-[30px]">
      {/* Bonus Amount Field */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          {dictionary.home.bonus.amount}
        </label>
        <Input
          {...register('bonus', {
            valueAsNumber: true,
            min: { value: 1, message: dictionary.home.validation.min_bonus },
          })}
          type="number"
          placeholder={dictionary.home.bonus.amount_placeholder}
          variant="gray"
          className={errors.bonus ? 'border-red-500' : ''}
        />
        {errors.bonus && (
          <p className="text-sm text-red-500">{errors.bonus.message}</p>
        )}
      </div>

      {/* Reason Select */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          {dictionary.home.bonus.reason}
        </label>
        <Select onValueChange={(value) => setValue('reason', value)}>
          <SelectTrigger
            className={`h-10 text-[#000000] border-gray-300 ${watchedReason ? 'bg-white' : 'bg-gray-50'}`}>
            <SelectValue
              placeholder={dictionary.home.bonus.reason_placeholder}
            />
          </SelectTrigger>
          <SelectContent>
            {BONUS_REASONS.map((reason) => (
              <SelectItem key={reason.value} value={reason.value}>
                {reason.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.reason && (
          <p className="text-sm text-red-500">{errors.reason.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full rounded-[22px]">
        {isIncreasing || isPending
          ? dictionary.home.buttons.loading
          : actionType === 'increase'
            ? dictionary.home.bonus.add_bonus
            : dictionary.home.bonus.remove_bonus}
      </Button>
    </form>
  )
}
