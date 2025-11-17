'use client'

import { Button } from '@/shared/ui'
import { Trash2 } from 'lucide-react'
import { useDeleteSavedRouteMutation } from '../api/delete-saved-route.mutation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

interface DeleteSavedRouteButtonProps {
  savedRouteId: string | null
  disabled?: boolean
  onSuccess?: () => void
}

export const DeleteSavedRouteButton = ({
  savedRouteId,
  disabled = false,
  onSuccess,
}: DeleteSavedRouteButtonProps) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useDeleteSavedRouteMutation({
    onSuccess: () => {
      toast.success('Route deleted successfully!')
      // Инвалидируем кэш saved routes для автоматического обновления списка
      queryClient.invalidateQueries({ queryKey: ['routes', 'saved-routes'] })
      onSuccess?.()
    },
    onError: (error) => {
      toast.error(`Failed to delete route: ${error.message}`)
    },
  })

  const handleClick = () => {
    if (!savedRouteId) {
      toast.error('No route selected')
      return
    }

    // Подтверждение удаления
    if (window.confirm('Are you sure you want to delete this saved route?')) {
      mutate({ id: savedRouteId })
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPending || !savedRouteId}
      variant="outline"
      className="flex-1 font-semibold text-text-heading hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
      size="sm">
      <Trash2 className="w-4 h-4 mr-2" />
      {isPending ? 'Deleting...' : 'Delete'}
    </Button>
  )
}
