'use client'

import { Button } from '@/shared/ui'
import { Edit } from 'lucide-react'
import { useEditSavedRouteMutation } from '../api/edit-saved-route.mutation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface EditSavedRouteButtonProps {
  savedRouteId: string | null
  routeSectionId: string | null
  disabled?: boolean
  onSuccess?: () => void
}

export const EditSavedRouteButton = ({
  savedRouteId,
  routeSectionId,
  disabled = false,
  onSuccess,
}: EditSavedRouteButtonProps) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useEditSavedRouteMutation({
    onSuccess: () => {
      toast.success('Route updated successfully!')
      // Инвалидируем кэш saved routes для автоматического обновления списка
      queryClient.invalidateQueries({ queryKey: ['routes', 'saved-routes'] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(`Failed to update route: ${error.message}`)
    },
  })

  const handleClick = () => {
    if (!savedRouteId || !routeSectionId) {
      toast.error('Missing route information')
      return
    }

    mutate({ savedRouteId, routeSectionId })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPending || !savedRouteId || !routeSectionId}
      variant="outline"
      className="flex-1 font-semibold text-text-heading"
      size="sm">
      <Edit className="w-4 h-4 mr-2" />
      {isPending ? 'Updating...' : 'Edit'}
    </Button>
  )
}
