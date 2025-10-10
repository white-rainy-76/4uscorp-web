import { FuelPlan } from '@/entities/gas-station'
import { RouteByIdData } from '@/entities/route'

interface UseFuelPlanIdProps {
  fuelPlans?: FuelPlan[]
  routeByIdData?: RouteByIdData
  fuelPlanId?: string
  selectedRouteId: string | null
}

export const useFuelPlanId = ({
  fuelPlans,
  routeByIdData,
  fuelPlanId,
  selectedRouteId,
}: UseFuelPlanIdProps) => {
  const getPriorityFuelPlanId = (): string | undefined => {
    // Приоритет: fuelPlans из get-gas-stations (всегда приоритетнее) > fuelPlanId из get-fuel-route-byId > переданный fuelPlanId
    if (fuelPlans && fuelPlans.length > 0 && selectedRouteId) {
      // Фильтруем fuelPlans по selectedRouteId (выбранной ветке)
      const filteredFuelPlans = fuelPlans.filter(
        (plan) => plan.routeSectionId === selectedRouteId,
      )
      if (filteredFuelPlans.length > 0) {
        return filteredFuelPlans[0].fuelPlanId || undefined
      }
    }

    if (routeByIdData?.fuelPlanId && selectedRouteId) {
      return routeByIdData.fuelPlanId
    }

    // Используем переданный fuelPlanId если он есть
    if (fuelPlanId && selectedRouteId) {
      return fuelPlanId
    }

    return undefined
  }

  return {
    getPriorityFuelPlanId,
  }
}
