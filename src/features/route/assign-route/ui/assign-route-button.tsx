'use client'

import { Button } from '@/shared/ui/button'
import { useDictionary } from '@/shared/lib/hooks'
import { useAssignRouteMutation } from '../api/assign-route.mutation'
import { toast } from 'sonner'
import { useRouteInfoStore, useCartStore } from '@/shared/store'

interface AssignRouteButtonProps {
  truckId: string
  routeId: string
  disabled?: boolean
  buttonText?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const AssignRouteButton = ({
  truckId,
  routeId,
  disabled = false,
  buttonText,
  onSuccess,
  onError,
}: AssignRouteButtonProps) => {
  const { dictionary } = useDictionary()
  const { selectedSectionId } = useRouteInfoStore()
  const { fuelPlanId } = useCartStore()

  const { mutate: assignRoute, isPending } = useAssignRouteMutation({
    onSuccess: () => {
      toast('Route assigned successfully', {
        description: `Route ID: ${routeId} - ${new Date().toLocaleString()}`,
        action: {
          label: dictionary.home.route.view_details || 'View Details',
          onClick: () => {
            // Можно добавить навигацию к деталям маршрута
            console.log('View route details:', routeId)
          },
        },
      })
      onSuccess?.()
    },
  })

  const handleAssignRoute = () => {
    if (!routeId || !selectedSectionId || !truckId) {
      toast(dictionary.home.route.route_id_required || 'Route ID is required', {
        description:
          dictionary.home.route.route_id_required_description ||
          'Please provide a valid route ID, route section ID, and truck ID to assign the route',
        action: {
          label: 'OK',
          onClick: () => console.log('Route assignment validation failed'),
        },
      })
      return
    }

    assignRoute({
      truckId,
      routeId,
      routeSectionId: selectedSectionId,
      fuelPlanId: fuelPlanId ?? undefined,
    })
  }

  return (
    <Button
      onClick={handleAssignRoute}
      disabled={disabled || isPending || !routeId || !selectedSectionId}
      className="rounded-full min-w-[140px]">
      {isPending
        ? dictionary.home.buttons.loading
        : buttonText || dictionary.home.buttons.submit}
    </Button>
  )
}
