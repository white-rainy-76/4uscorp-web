'use client'

import { Button } from '@/shared/ui/button'
import { useDictionary } from '@/shared/lib/hooks'
import { useAssignRouteMutation } from '../api/assign-route.mutation'
import { toast } from 'sonner'
import { FuelPlan } from '@/entities/gas-station'
import { RouteByIdData } from '@/entities/route'

interface AssignRouteButtonProps {
  truckId: string
  routeId: string
  routeSectionId: string
  fuelPlans?: FuelPlan[]
  routeByIdData?: RouteByIdData
  fuelPlanId?: string
  disabled?: boolean
  buttonText?: string
  onSuccess?: () => void
  onError?: (error: Error) => void
}

/**
 * Определяет приоритетный fuelPlanId на основе доступных данных
 * Приоритет: fuelPlans из get-gas-stations > fuelPlanId из get-fuel-route-byId > переданный fuelPlanId
 */
const getPriorityFuelPlanId = (params: {
  fuelPlans?: FuelPlan[]
  selectedRouteId: string | null
  routeByIdData?: RouteByIdData
  fuelPlanId?: string
}): string | undefined => {
  const { fuelPlans, selectedRouteId, routeByIdData, fuelPlanId } = params

  // Приоритет 1: fuelPlans из get-gas-stations (всегда приоритетнее)
  if (fuelPlans && fuelPlans.length > 0 && selectedRouteId) {
    // Фильтруем fuelPlans по selectedRouteId (выбранной ветке)
    const filteredFuelPlans = fuelPlans.filter(
      (plan) => plan.routeSectionId === selectedRouteId,
    )

    if (filteredFuelPlans.length > 0) {
      return filteredFuelPlans[0].fuelPlanId || undefined
    }
  }

  // Приоритет 2: fuelPlanId из get-fuel-route-byId
  if (routeByIdData?.fuelPlanId && selectedRouteId) {
    return routeByIdData.fuelPlanId
  }

  // Приоритет 3: переданный fuelPlanId
  if (fuelPlanId && selectedRouteId) {
    return fuelPlanId
  }

  return undefined
}

export const AssignRouteButton = ({
  truckId,
  routeId,
  routeSectionId,
  fuelPlans,
  routeByIdData,
  fuelPlanId,
  disabled = false,
  buttonText,
  onSuccess,
  onError,
}: AssignRouteButtonProps) => {
  const { dictionary } = useDictionary()

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
    onError: (error) => {
      toast('Failed to assign route', {
        description: `Error: ${error.message}`,
        action: {
          label: dictionary.home.route.retry || 'Retry',
          onClick: () => {
            const priorityFuelPlanId = getPriorityFuelPlanId({
              fuelPlans,
              selectedRouteId: routeSectionId,
              routeByIdData,
              fuelPlanId,
            })

            assignRoute({
              truckId,
              routeId,
              routeSectionId,
              fuelPlanId: priorityFuelPlanId,
            })
          },
        },
      })
      onError?.(error)
    },
  })

  const handleAssignRoute = () => {
    if (!routeId || !routeSectionId || !truckId) {
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

    const priorityFuelPlanId = getPriorityFuelPlanId({
      fuelPlans,
      selectedRouteId: routeSectionId,
      routeByIdData,
      fuelPlanId,
    })

    assignRoute({
      truckId,
      routeId,
      routeSectionId,
      fuelPlanId: priorityFuelPlanId,
    })
  }

  return (
    <Button
      onClick={handleAssignRoute}
      disabled={disabled || isPending || !routeId || !routeSectionId}
      className="rounded-full min-w-[140px]">
      {isPending
        ? dictionary.home.buttons.loading
        : buttonText || dictionary.home.buttons.submit}
    </Button>
  )
}
