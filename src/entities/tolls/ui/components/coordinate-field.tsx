import React from 'react'
import { Controller, Control, FieldErrors } from 'react-hook-form'
import { FormField, FormFieldInput } from './form-field'
import { TollSearchFormValues } from '../../model/schema'

interface CoordinateFieldProps {
  name: 'minLat' | 'minLon' | 'maxLat' | 'maxLon'
  label: string
  control: Control<TollSearchFormValues>
  errors: FieldErrors<TollSearchFormValues>
  placeholder: string
}

export const CoordinateField: React.FC<CoordinateFieldProps> = ({
  name,
  label,
  control,
  errors,
  placeholder,
}) => {
  return (
    <FormField label={label} error={errors[name]?.message} className="flex-1">
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <FormFieldInput
              type="text"
              inputMode="decimal"
              placeholder={placeholder}
              error={errors[name]?.message}
              value={field.value ?? ''}
              onChange={(e) => {
                const inputValue = e.target.value

                // Разрешаем пустую строку, минус, и числовые значения
                if (
                  inputValue === '' ||
                  inputValue === '-' ||
                  /^-?\d*\.?\d*$/.test(inputValue)
                ) {
                  let cleanedValue = inputValue

                  // Убираем лидирующие нули только если после нуля идет цифра (не точка)
                  // Примеры: "023" -> "23", "0.5" -> "0.5", "0" -> "0"
                  if (cleanedValue.length > 1) {
                    // Для положительных чисел: "023" -> "23", но "0.5" -> "0.5"
                    if (/^0\d/.test(cleanedValue)) {
                      cleanedValue = cleanedValue.replace(/^0+/, '')
                    }

                    // Для отрицательных чисел: "-023" -> "-23", но "-0.5" -> "-0.5"
                    if (/^-0\d/.test(cleanedValue)) {
                      cleanedValue =
                        '-' + cleanedValue.slice(1).replace(/^0+/, '')
                    }
                  }

                  field.onChange(cleanedValue)
                }
              }}
              onBlur={field.onBlur}
              name={field.name}
            />
          )
        }}
      />
    </FormField>
  )
}
