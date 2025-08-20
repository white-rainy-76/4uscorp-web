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

interface DriverBonusFormProps {
  onClose: () => void
  driver?: Driver
  actionType: 'increase' | 'decrease'
}

const BONUS_REASONS = [
  { value: 'birthday', label: 'День рождения' },
  { value: 'good_work', label: 'Хорошая работа' },
  { value: 'overtime', label: 'Сверхурочная работа' },
  { value: 'bonus', label: 'Просто так' },
  { value: 'achievement', label: 'Достижение' },
  { value: 'holiday', label: 'Праздник' },
]

export const DriverBonusForm = ({
  onClose,
  driver,
  actionType,
}: DriverBonusFormProps) => {
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
          Количество бонусов
        </label>
        <Input
          {...register('bonus', {
            valueAsNumber: true,
            min: { value: 1, message: 'Минимум 1 бонус' },
          })}
          type="number"
          placeholder="Введите количество"
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
          Причина
        </label>
        <Select onValueChange={(value) => setValue('reason', value)}>
          <SelectTrigger
            className={`h-10 border-gray-300 ${watchedReason ? 'bg-white' : 'bg-gray-50'}`}>
            <SelectValue placeholder="Выберите причину" />
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
          ? 'Загрузка...'
          : `${actionType === 'increase' ? 'Добавить' : 'Убавить'} бонусы`}
      </Button>
    </form>
  )
}
