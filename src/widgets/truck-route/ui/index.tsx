'use client'

import { Button } from '@/shared/ui/button'
import { Truck } from '@/entities/truck'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { RouteSearchForm } from '@/features/forms/search-route/ui'
import { Coordinate } from '@/shared/types'
import { useAssignRouteMutation } from '@/entities/route/api/assign-route.mutation'
import { useState } from 'react'
import { Icon } from '@/shared/ui'
import { useDictionary } from '@/shared/lib/hooks'
import { FuelPlan } from '@/entities/gas-station'
import { RouteByIdData } from '@/entities/route'
import { CompleteRouteButton } from '@/features/route/complete-route'

interface TruckRouteInfoProps {
  truck: Truck
  origin: Coordinate | null
  destination: Coordinate | null
  destinationName?: string
  originName?: string
  truckWeight?: number
  finishFuel?: number
  isRoute: boolean
  currentFuelPercent?: number
  onSubmitForm: (payload: {
    origin: Coordinate
    destination: Coordinate
    originName: string
    destinationName: string
    truckWeight?: number
    finishFuel?: number
  }) => void
  routeId: string | undefined
  selectedRouteId: string | null
  fuelPlans?: FuelPlan[]
  routeByIdData?: RouteByIdData
  fuelPlanId?: string
  onRouteCompleted?: () => void
}

export const TruckRouteInfo = ({
  origin,
  destination,
  destinationName,
  originName,
  finishFuel,
  truckWeight,
  isRoute = false,
  currentFuelPercent,
  onSubmitForm,
  routeId,
  truck,
  selectedRouteId,
  fuelPlans,
  routeByIdData,
  fuelPlanId,
  onRouteCompleted,
}: TruckRouteInfoProps) => {
  const { dictionary } = useDictionary()
  const [isEditing, setIsEditing] = useState(false)
  const displayOrigin = originName || dictionary.home.route.departure_city
  const displayDestination =
    destinationName || dictionary.home.route.destination_city

  const { mutateAsync: AssignRoute, isPending: isAssignLoading } =
    useAssignRouteMutation({})

  // Функция для получения приоритетных fuelPlans
  const getPriorityFuelPlans = (): FuelPlan[] | undefined => {
    // Приоритет: fuelPlans из get-gas-stations (всегда приоритетнее) > fuelPlanId из get-fuel-route-byId > переданный fuelPlanId
    if (fuelPlans && fuelPlans.length > 0 && selectedRouteId) {
      // Фильтруем fuelPlans по selectedRouteId (выбранной ветке)
      const filteredFuelPlans = fuelPlans.filter(
        (plan) => plan.routeSectionId === selectedRouteId,
      )
      if (filteredFuelPlans.length > 0) {
        return filteredFuelPlans
      }
    }

    if (routeByIdData?.fuelPlanId && selectedRouteId) {
      return [
        {
          routeSectionId: selectedRouteId,
          fuelPlanId: routeByIdData.fuelPlanId,
        },
      ]
    }

    // Используем переданный fuelPlanId если он есть
    if (fuelPlanId && selectedRouteId) {
      return [
        {
          routeSectionId: selectedRouteId,
          fuelPlanId: fuelPlanId,
        },
      ]
    }

    return undefined
  }

  if (isEditing) {
    return (
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <RouteSearchForm
            originName={originName}
            destinationName={destinationName}
            truckWeight={truckWeight}
            finishFuel={finishFuel}
            origin={origin}
            destination={destination}
            truck={truck}
            currentFuelPercent={currentFuelPercent}
            onSubmitForm={onSubmitForm}
          />
        </div>
        <div className="flex flex-col gap-3 min-w-[140px]">
          <Button
            className="rounded-full min-w-[140px]"
            disabled={!routeId || !selectedRouteId}
            onClick={() =>
              AssignRoute({
                truckId: truck.id,
                routeId: routeId ? routeId : '',
                routeSectionId: selectedRouteId ? selectedRouteId : '',
                fuelPlans: getPriorityFuelPlans(),
              })
            }>
            {dictionary.home.buttons.submit}
          </Button>
          {routeId && routeByIdData?.routeId && (
            <CompleteRouteButton
              routeId={routeId}
              disabled={!routeByIdData?.routeId}
              onSuccess={onRouteCompleted}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between gap-6 flex-wrap">
      <div className="space-y-2">
        {isRoute ? (
          <>
            <div className="bg-input-bg rounded-full px-4 py-1 text-base h-[44px] text-text-neutral font-extrabold flex items-center gap-2">
              {displayOrigin} <span className="text-xl">→</span>{' '}
              {displayDestination}
            </div>
            <div className="text-muted-foreground text-sm flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {format(new Date(), 'yyyy/MM/dd')}
              </div>
              <div className="flex items-center gap-2">
                <Icon name="common/weight" width={16} height={16} />
                <span className="font-semibold text-black">
                  {truckWeight?.toLocaleString()} Lbt
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-muted rounded-full px-4 py-1 text-sm h-[44px] text-text-neutral flex items-center gap-2">
              {displayOrigin}
            </div>
            <div className="text-muted-foreground text-sm flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                {format(new Date(), 'yyyy/MM/dd')}
              </div>
            </div>
          </>
        )}
      </div>

      <Button onClick={() => setIsEditing(true)} className="rounded-full">
        {isRoute
          ? dictionary.home.route.adjust_route
          : dictionary.home.route.create_route}
      </Button>
    </div>
  )
}
