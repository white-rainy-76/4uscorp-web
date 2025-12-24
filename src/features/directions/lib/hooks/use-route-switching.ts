import { useCallback } from 'react'

// Константы для магических чисел
const MAIN_ROUTE_INDEX = 0
const ALTERNATIVE_ROUTES_START_INDEX = 1

interface UseRouteSwitchingProps {
  mainRoute: google.maps.LatLngLiteral[]
  alternativeRoutes: google.maps.LatLngLiteral[][]
  routeSectionIds: string[]
  setMainRoute: (route: google.maps.LatLngLiteral[]) => void
  setAlternativeRoutes: (
    routes:
      | google.maps.LatLngLiteral[][]
      | ((
          prev: google.maps.LatLngLiteral[][],
        ) => google.maps.LatLngLiteral[][]),
  ) => void
  setRouteSectionIds: (ids: string[] | ((prev: string[]) => string[])) => void
  onRouteClick?: (routeSectionId: string) => void
  clearHoverState: () => void
}

export const useRouteSwitching = ({
  mainRoute,
  alternativeRoutes,
  routeSectionIds,
  setMainRoute,
  setAlternativeRoutes,
  setRouteSectionIds,
  onRouteClick,
  clearHoverState,
}: UseRouteSwitchingProps) => {
  /**
   * Переключение на альтернативный маршрут
   * @param index - индекс в массиве alternativeRoutes
   */
  const switchToAlternative = useCallback(
    (index: number) => {
      // Очищаем hover состояние при переключении
      clearHoverState()

      // Сохраняем текущий главный маршрут
      const currentMainRoute = [...mainRoute]

      // Устанавливаем новый главный маршрут
      setMainRoute(alternativeRoutes[index])

      // Обновляем альтернативные маршруты
      setAlternativeRoutes((prevRoutes) => {
        const newAlts = [...prevRoutes]
        newAlts.splice(index, 1)
        return [currentMainRoute, ...newAlts]
      })

      // Обновляем routeSectionIds - перемещаем выбранный ID в начало
      setRouteSectionIds((prevIds) => {
        const newIds = [...prevIds]
        // +1 потому что первый элемент в массиве - это главный маршрут
        const selectedId = newIds[index + ALTERNATIVE_ROUTES_START_INDEX]

        // Перемещаем выбранный ID в начало
        newIds.splice(index + ALTERNATIVE_ROUTES_START_INDEX, 1)
        newIds.unshift(selectedId)

        return newIds
      })

      // Уведомляем родительский компонент о переключении маршрута
      if (onRouteClick) {
        const selectedRouteSectionId =
          routeSectionIds[index + ALTERNATIVE_ROUTES_START_INDEX]
        onRouteClick(selectedRouteSectionId)
      }
    },
    [
      clearHoverState,
      mainRoute,
      alternativeRoutes,
      routeSectionIds,
      setMainRoute,
      setAlternativeRoutes,
      setRouteSectionIds,
      onRouteClick,
    ],
  )

  return {
    switchToAlternative,
    MAIN_ROUTE_INDEX,
    ALTERNATIVE_ROUTES_START_INDEX,
  }
}
