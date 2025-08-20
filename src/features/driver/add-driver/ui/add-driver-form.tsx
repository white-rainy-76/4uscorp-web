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

interface AddDriverFormProps {
  onClose: () => void
}

export const AddDriverForm = ({ onClose }: AddDriverFormProps) => {
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
          Full Name
        </label>
        <Input
          {...register('name')}
          placeholder="Enter full name"
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
          Phone
        </label>
        <Input
          {...register('phone')}
          variant="gray"
          placeholder="Enter phone number"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          Email
        </label>
        <Input
          {...register('email')}
          variant="gray"
          type="email"
          placeholder="Enter email address"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Telegram Link */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          Telegram Link
        </label>
        <Input
          {...register('telegramLink')}
          variant="gray"
          placeholder="Enter Telegram link"
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
        {isPending ? 'Loading...' : 'Add Driver'}
      </Button>
    </form>
  )
}
