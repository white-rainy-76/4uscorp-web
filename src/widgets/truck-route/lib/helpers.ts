import { FuelPlan } from '@/entities/gas-station'
import { RouteByIdData } from '@/entities/route'

/**
 * Возвращает отображаемое название локации или fallback значение
 */
export const getDisplayLocationName = (
  name: string | undefined,
  fallback: string,
): string => {
  return name || fallback
}

/**
 * Определяет приоритетный fuelPlanId на основе доступных данных
 * Приоритет: fuelPlans из get-gas-stations > fuelPlanId из get-fuel-route-byId > переданный fuelPlanId
 */
export const getPriorityFuelPlanId = (params: {
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
