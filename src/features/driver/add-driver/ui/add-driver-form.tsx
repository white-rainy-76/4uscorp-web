'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/shared/ui'
import { useAddDriverMutation } from '../api/add-driver.mutation'
import {
  AddDriverPayload,
  AddDriverPayloadSchema,
} from '../api/payload/add-driver.payload'
import { useDictionary } from '@/shared/lib/hooks'

interface AddDriverFormProps {
  onClose: () => void
}

export const AddDriverForm = ({ onClose }: AddDriverFormProps) => {
  const { dictionary } = useDictionary()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddDriverPayload>({
    resolver: zodResolver(AddDriverPayloadSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      telegramLink: '',
    },
  })

  const { mutateAsync: addDriver, isPending } = useAddDriverMutation({
    onSuccess: () => {
      reset()
      onClose()
    },
  })

  const handleFormSubmit = async (data: AddDriverPayload) => {
    try {
      await addDriver(data)
    } catch (error) {
      console.error('Failed to add driver:', error)
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
          {...register('name')}
          placeholder={dictionary.home.input_fields.full_name_placeholder}
          variant="gray"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
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
          : dictionary.home.buttons.add_driver}
      </Button>
    </form>
  )
}
