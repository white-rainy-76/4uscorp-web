import { getLocalizedErrorMessage } from '../lib'
import { useDictionary } from '@/shared/lib/hooks'

interface FieldErrorProps {
  error?: { message?: string }
}

export const FieldError = ({ error }: FieldErrorProps) => {
  const { dictionary } = useDictionary()

  if (!error?.message) return null

  return (
    <p className="text-red-500 text-sm mt-1">
      {getLocalizedErrorMessage(error.message, dictionary)}
    </p>
  )
}
