'use client'

import { AssignRouteButton } from '@/features/route/assign-route'
import { CompleteRouteButton } from '@/features/route/complete-route'
import { RouteActionsProps } from '../model/types'
import { useRouteInfoStore } from '@/shared/store'

export const RouteActions = ({
  truck,
  routeByIdData,
  onRouteCompleted,
  submitButtonText,
}: RouteActionsProps) => {
  const { routeId } = useRouteInfoStore()

  return (
    <div className="flex flex-col gap-3 min-w-[140px]">
      {routeId && (
        <AssignRouteButton
          truckId={truck.id}
          routeId={routeId}
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
