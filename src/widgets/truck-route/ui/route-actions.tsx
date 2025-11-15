'use client'

import { AssignRouteButton } from '@/features/route/assign-route'
import { CompleteRouteButton } from '@/features/route/complete-route'
import { RouteActionsProps } from '../model/types'
import { useRouteInfoStore } from '@/shared/store'

export const RouteActions = ({
  truck,
  routeId,
  fuelPlans,
  routeByIdData,
  fuelPlanId,
  onRouteCompleted,
  submitButtonText,
}: RouteActionsProps) => {
  const { selectedSectionId } = useRouteInfoStore()

  return (
    <div className="flex flex-col gap-3 min-w-[140px]">
      {routeId && selectedSectionId && (
        <AssignRouteButton
          truckId={truck.id}
          routeId={routeId}
          routeSectionId={selectedSectionId}
          fuelPlans={fuelPlans}
          routeByIdData={routeByIdData}
          fuelPlanId={fuelPlanId}
          buttonText={submitButtonText}
        />
      )}
      {routeId && routeByIdData?.routeId && (
        <CompleteRouteButton
          routeId={routeId}
          disabled={!routeByIdData?.routeId}
          onSuccess={onRouteCompleted}
        />
      )}
    </div>
  )
}
