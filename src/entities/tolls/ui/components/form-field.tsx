import React from 'react'
import { Label } from '@/shared/ui/label'
import { Input } from '@/shared/ui/input'
import { cn } from '@/shared/ui/utils'

interface FormFieldProps {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  required,
  children,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-1 font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

interface FormFieldInputProps
  extends React.ComponentPropsWithoutRef<typeof Input> {
  error?: string
}

export const FormFieldInput: React.FC<FormFieldInputProps> = ({
  error,
  className,
  variant = 'gray',
  ...props
}) => {
  return (
    <Input
      variant={variant}
      className={cn(
        error && 'ring-2 ring-red-500/50 border-red-300',
        className,
      )}
      {...props}
    />
  )
}
