'use client'

import { useState } from 'react'
import { useDictionary } from '@/shared/lib/hooks'
import { TruckRouteInfoProps } from '../model/types'
import { RouteInfoDisplay } from './route-info-display'
import { RouteInfoEditor } from './route-info-editor'
import { RouteActions } from './route-actions'

export const TruckRouteInfo = ({
  isRoute = false,
  onSubmitForm,
  truck,
  routeByIdData,
  onRouteCompleted,
}: TruckRouteInfoProps) => {
  const { dictionary } = useDictionary()
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return (
      <div className="flex items-start gap-4">
        <RouteInfoEditor truck={truck} onSubmitForm={onSubmitForm} />
        <RouteActions
          truck={truck}
          routeByIdData={routeByIdData}
          onRouteCompleted={onRouteCompleted}
          submitButtonText={dictionary.home.buttons.submit}
        />
      </div>
    )
  }

  return (
    <RouteInfoDisplay isRoute={isRoute} onEdit={() => setIsEditing(true)} />
  )
}
