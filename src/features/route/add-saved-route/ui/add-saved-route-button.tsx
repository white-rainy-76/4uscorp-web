'use client'

import { Button } from '@/shared/ui'
import { Bookmark } from 'lucide-react'
import { useAddSavedRouteMutation } from '../api/add-saved-route.mutation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface AddSavedRouteButtonProps {
  routeSectionId: string | null
  disabled?: boolean
  onSuccess?: () => void
}

export const AddSavedRouteButton = ({
  routeSectionId,
  disabled = false,
  onSuccess,
}: AddSavedRouteButtonProps) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useAddSavedRouteMutation({
    onSuccess: () => {
      toast.success('Route saved successfully!')
      // Инвалидируем кэш saved routes для автоматического обновления списка
      queryClient.invalidateQueries({ queryKey: ['routes', 'saved-routes'] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(`Failed to save route: ${error.message}`)
    },
  })

  const handleClick = () => {
    if (!routeSectionId) {
      toast.error('No route section selected')
      return
    }

    mutate({ routeSectionId })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPending || !routeSectionId}
      className="w-full font-semibold"
      size="sm">
      <Bookmark className="w-4 h-4 mr-2" />
      {isPending ? 'Saving...' : 'Save Route'}
    </Button>
  )
}
