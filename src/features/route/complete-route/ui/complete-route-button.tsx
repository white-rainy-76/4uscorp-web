'use client'

import { Button } from '@/shared/ui/button'
import { useDictionary } from '@/shared/lib/hooks'
import { useCompleteRouteMutation } from '../api/complete-route.mutation'
import { toast } from 'sonner'

interface CompleteRouteButtonProps {
  routeId: string
  disabled?: boolean
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const CompleteRouteButton = ({
  routeId,
  disabled = false,
  onSuccess,
  onError,
}: CompleteRouteButtonProps) => {
  const { dictionary } = useDictionary()

  const { mutate: completeRoute, isPending } = useCompleteRouteMutation({
    onSuccess: () => {
      toast(
        dictionary.home.route.complete_route_success ||
          'Route completed successfully',
        {
          description: `Route ID: ${routeId} - ${new Date().toLocaleString()}`,
          action: {
            label: dictionary.home.route.view_details || 'View Details',
            onClick: () => {
              // Можно добавить навигацию к деталям маршрута
              console.log('View route details:', routeId)
            },
          },
        },
      )
      onSuccess?.()
    },
    onError: (error) => {
      toast(
        dictionary.home.route.complete_route_error ||
          'Failed to complete route',
        {
          description: `Error: ${error.message}`,
          action: {
            label: dictionary.home.route.retry || 'Retry',
            onClick: () => {
              completeRoute({ routeId })
            },
          },
        },
      )
      onError?.(error)
    },
  })

  const handleCompleteRoute = () => {
    if (!routeId) {
      toast(dictionary.home.route.route_id_required || 'Route ID is required', {
        description:
          dictionary.home.route.route_id_required_description ||
          'Please provide a valid route ID to complete the route',
        action: {
          label: 'OK',
          onClick: () => console.log('Route ID validation failed'),
        },
      })
      return
    }

    completeRoute({ routeId })
  }

  return (
    <Button
      onClick={handleCompleteRoute}
      disabled={disabled || isPending || !routeId}
      className="rounded-full bg-green-600 hover:bg-green-700 text-white min-w-[140px]"
      variant="default">
      {isPending
        ? dictionary.home.buttons.loading
        : dictionary.home.buttons.complete_route}
    </Button>
  )
}
