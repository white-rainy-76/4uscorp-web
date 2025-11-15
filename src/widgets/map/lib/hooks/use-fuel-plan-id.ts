import { FuelPlan } from '@/entities/gas-station'
import { RouteByIdData } from '@/entities/route'
import { useRouteInfoStore } from '@/shared/store'

interface UseFuelPlanIdProps {
  fuelPlans?: FuelPlan[]
  routeByIdData?: RouteByIdData
  fuelPlanId?: string
}

export const useFuelPlanId = ({
  fuelPlans,
  routeByIdData,
  fuelPlanId,
}: UseFuelPlanIdProps) => {
  const { selectedSectionId } = useRouteInfoStore()

  const getPriorityFuelPlanId = (): string | undefined => {
    // Приоритет: fuelPlans из get-gas-stations (всегда приоритетнее) > fuelPlanId из get-fuel-route-byId > переданный fuelPlanId
    if (fuelPlans && fuelPlans.length > 0 && selectedSectionId) {
      // Фильтруем fuelPlans по selectedSectionId (выбранной ветке)
      const filteredFuelPlans = fuelPlans.filter(
        (plan) => plan.routeSectionId === selectedSectionId,
      )
      if (filteredFuelPlans.length > 0) {
        return filteredFuelPlans[0].fuelPlanId || undefined
      }
    }

    if (routeByIdData?.fuelPlanId && selectedSectionId) {
      return routeByIdData.fuelPlanId
    }

    // Используем переданный fuelPlanId если он есть
    if (fuelPlanId && selectedSectionId) {
      return fuelPlanId
    }

    return undefined
  }

  return {
    getPriorityFuelPlanId,
  }
}
