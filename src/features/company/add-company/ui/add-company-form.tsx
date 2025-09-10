'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/shared/ui'
import { useAddCompanyMutation } from '../api/add-company.mutation'
import {
  AddCompanyPayload,
  AddCompanyPayloadSchema,
} from '../api/payload/add-company.payload'
import { useDictionary } from '@/shared/lib/hooks'

interface AddCompanyFormProps {
  onClose: () => void
}

export const AddCompanyForm = ({ onClose }: AddCompanyFormProps) => {
  const { dictionary } = useDictionary()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddCompanyPayload>({
    resolver: zodResolver(AddCompanyPayloadSchema),
    defaultValues: {
      name: '',
      samsaraToken: '',
    },
  })

  const { mutateAsync: addCompany, isPending } = useAddCompanyMutation()

  const handleFormSubmit = async (data: AddCompanyPayload) => {
    try {
      await addCompany(data)
      reset()
      onClose()
    } catch (error) {
      console.error('Failed to add company:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-[30px]">
      {/* Company Name Field */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          {dictionary.home.input_fields.company_name}
        </label>
        <Input
          {...register('name')}
          placeholder={dictionary.home.input_fields.company_name_placeholder}
          variant="gray"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Samsara Token Field */}
      <div className="space-y-3">
        <label className="block text-sm font-extrabold text-[#A8A8A8]">
          {dictionary.home.input_fields.samsara_token}
        </label>
        <Input
          {...register('samsaraToken')}
          placeholder={dictionary.home.input_fields.samsara_token_placeholder}
          variant="gray"
          className={errors.samsaraToken ? 'border-red-500' : ''}
        />
        {errors.samsaraToken && (
          <p className="text-sm text-red-500">{errors.samsaraToken.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full rounded-[22px]">
        {isPending
          ? dictionary.home.buttons.loading
          : dictionary.home.buttons.add_company}
      </Button>
    </form>
  )
}
