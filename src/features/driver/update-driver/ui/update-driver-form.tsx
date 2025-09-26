'use client'

import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/shared/ui'
import { useUpdateDriverMutation } from '../api/update-driver.mutation'
import {
  UpdateDriverPayload,
  UpdateDriverPayloadSchema,
} from '../api/payload/update-driver.payload'
import { Driver } from '@/entities/driver'
import { useDictionary } from '@/shared/lib/hooks'

interface UpdateDriverFormProps {
  onClose: () => void
  driver?: Driver
}

export const UpdateDriverForm = ({
  onClose,
  driver,
}: UpdateDriverFormProps) => {
  const { dictionary } = useDictionary()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UpdateDriverPayload>({
    resolver: zodResolver(UpdateDriverPayloadSchema),
    defaultValues: {
      driverId: '',
      fullName: '',
      phone: '',
      email: '',
      telegramLink: '',
    },
  })

  const { mutateAsync: updateDriver, isPending } = useUpdateDriverMutation({
    onSuccess: () => {
      reset()
      onClose()
    },
  })

  useEffect(() => {
    if (driver) {
      setValue('driverId', driver.id)
      setValue('fullName', driver.fullName || '')
      setValue('phone', driver.phone || '')
      setValue('email', driver.email || '')
      setValue('telegramLink', driver.telegramLink || '')
    }
  }, [driver, setValue])

  const handleFormSubmit = async (data: UpdateDriverPayload) => {
    try {
      await updateDriver(data)
    } catch (error) {
      console.error('Failed to update driver:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-[30px]">
      {/* Full Name */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          {dictionary.home.input_fields.full_name}
        </label>
        <Input
          {...register('fullName')}
          placeholder={dictionary.home.input_fields.full_name_placeholder}
          variant="gray"
          className={errors.fullName ? 'border-red-500' : ''}
        />
        {errors.fullName && (
          <p className="text-sm text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          {dictionary.home.input_fields.phone}
        </label>
        <Input
          {...register('phone')}
          variant="gray"
          placeholder={dictionary.home.input_fields.phone_placeholder}
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          {dictionary.home.input_fields.email}
        </label>
        <Input
          {...register('email')}
          variant="gray"
          type="email"
          placeholder={dictionary.home.input_fields.email_placeholder}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Telegram Link */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          {dictionary.home.input_fields.telegram_link}
        </label>
        <Input
          {...register('telegramLink')}
          variant="gray"
          placeholder={dictionary.home.input_fields.telegram_link_placeholder}
          className={errors.telegramLink ? 'border-red-500' : ''}
        />
        {errors.telegramLink && (
          <p className="text-sm text-red-500">{errors.telegramLink.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-[22px]">
        {isPending
          ? dictionary.home.buttons.loading
          : dictionary.home.buttons.update_driver}
      </Button>
    </form>
  )
}
